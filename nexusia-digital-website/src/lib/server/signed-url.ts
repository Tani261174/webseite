import "server-only";

/**
 * Zeitlich begrenzte, signierte Download-Token (HMAC-SHA256, Web Crypto – läuft auf Cloudflare).
 * Format: base64url(payload).base64url(signature), payload = { k: fileKey, o: orderId, e: expiresAt }
 */
const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  arr.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function key() {
  const secret = process.env.DOWNLOAD_SIGNING_SECRET;
  if (!secret || secret.length < 32) throw new Error("signing_not_configured");
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signDownload(fileKey: string, orderId: string, ttlSeconds = 60 * 60 * 24) {
  const payload = b64url(enc.encode(JSON.stringify({ k: fileKey, o: orderId, e: Date.now() + ttlSeconds * 1000 })));
  const sig = await crypto.subtle.sign("HMAC", await key(), enc.encode(payload));
  return `${payload}.${b64url(sig)}`;
}

export async function verifyDownload(token: string): Promise<{ k: string; o: string } | null> {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await key(), fromB64url(sig), enc.encode(payload));
    if (!ok) return null;
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as { k: string; o: string; e: number };
    return data.e > Date.now() ? { k: data.k, o: data.o } : null;
  } catch {
    return null;
  }
}
