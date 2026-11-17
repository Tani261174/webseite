import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { db } from "./db";

/* ---------- Geheimer Schlüssel ---------- */

const g = globalThis as unknown as { __saborDevSecret?: string };

export function secret(): string {
  const env = process.env.SESSION_SECRET;
  if (env && env.length >= 32) return env;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET fehlt oder ist kürzer als 32 Zeichen.");
  }
  // Nur in der Entwicklung: zufälliger Schlüssel pro Serverstart
  g.__saborDevSecret ??= randomBytes(32).toString("hex");
  return g.__saborDevSecret;
}

export function hmac(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

/* ---------- Client-IP (nur gehasht gespeichert → datenschutzfreundlich) ---------- */

export function clientKey(headers: Headers) {
  const ip =
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";
  return hmac(`ip:${ip}`).slice(0, 24);
}

/* ---------- Rate-Limiting (persistiert in SQLite) ---------- */

export function rateLimit(bucket: string, key: string, limit: number, windowMs: number) {
  const c = db();
  const now = Date.now();
  const k = `${bucket}:${key}`;
  c.prepare("DELETE FROM rate_hits WHERE at < ?").run(now - 24 * 60 * 60 * 1000);
  const count = Number(
    (c.prepare("SELECT COUNT(*) AS n FROM rate_hits WHERE key=? AND at>?").get(k, now - windowMs) as { n: number }).n,
  );
  if (count >= limit) return false;
  c.prepare("INSERT INTO rate_hits (key, at) VALUES (?, ?)").run(k, now);
  return true;
}

/* ---------- Spam-Schutz für Formulare ----------
 * Signiertes Zeitstempel-Token: Formulare, die schneller als 3 Sekunden
 * oder nach mehr als 6 Stunden abgeschickt werden, werden abgelehnt.
 * Zusätzlich ein unsichtbares Honeypot-Feld (siehe Formulare).
 */
export function formToken() {
  const ts = Date.now().toString(36);
  return `${ts}.${hmac(`form:${ts}`)}`;
}

export function checkFormToken(token: unknown): "ok" | "fast" | "invalid" {
  if (typeof token !== "string") return "invalid";
  const [ts, sig] = token.split(".");
  if (!ts || !sig || !safeEqual(sig, hmac(`form:${ts}`))) return "invalid";
  const age = Date.now() - parseInt(ts, 36);
  if (age < 3000) return "fast";
  if (age > 6 * 60 * 60 * 1000) return "invalid";
  return "ok";
}

/** Nur Anfragen von der eigenen Website annehmen (CSRF-Schutz für JSON-Endpunkte). */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
