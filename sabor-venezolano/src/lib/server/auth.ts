import "server-only";
import { randomBytes, scryptSync } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { safeEqual, sha256 } from "./security";

/**
 * Admin-Anmeldung
 * - Benutzer + Passwort-Hash (scrypt) aus Umgebungsvariablen – kein Passwort im Code.
 * - Sitzung: zufälliges Token im HttpOnly-Cookie, in der DB nur als SHA-256-Hash gespeichert.
 */
const COOKIE = "sv_admin";
const SESSION_HOURS = 12;

export function adminConfigured() {
  return Boolean(process.env.ADMIN_USER && process.env.ADMIN_PASSWORD_HASH?.startsWith("scrypt:"));
}

export function verifyPassword(user: string, password: string) {
  const expectedUser = process.env.ADMIN_USER || "";
  const stored = process.env.ADMIN_PASSWORD_HASH || "";
  // Format: scrypt:<salt>:<hash>
  const [scheme, saltB64, keyB64] = stored.split(":");
  // Immer rechnen (auch bei falschem Benutzer), damit die Antwortzeit nichts verrät.
  const salt = saltB64 ? Buffer.from(saltB64, "base64url") : randomBytes(16);
  const derived = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("base64url");
  const userOk = safeEqual(user.trim().toLowerCase(), expectedUser.trim().toLowerCase());
  const passOk = scheme === "scrypt" && !!keyB64 && safeEqual(derived, keyB64);
  return userOk && passOk;
}

export async function createSession() {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  const c = db();
  c.prepare("DELETE FROM sessions WHERE expires_at < ?").run(now);
  c.prepare("INSERT INTO sessions (id, expires_at, created_at) VALUES (?, ?, ?)").run(
    sha256(token),
    now + SESSION_HOURS * 3600 * 1000,
    now,
  );
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: (process.env.SITE_URL || "").startsWith("https://"),
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const row = db().prepare("SELECT expires_at FROM sessions WHERE id=?").get(sha256(token)) as
    | { expires_at: number }
    | undefined;
  return !!row && Number(row.expires_at) > Date.now();
}

/** Am Anfang JEDER Admin-Seite und JEDER Admin-Aktion aufrufen. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) db().prepare("DELETE FROM sessions WHERE id=?").run(sha256(token));
  jar.delete(COOKIE);
}
