import "server-only";

/**
 * Einfaches Rate-Limiting (Sliding Window, im Speicher der jeweiligen Instanz).
 * Auf Cloudflare laufen mehrere Isolates parallel – für den Livebetrieb daher
 * zusätzlich die Cloudflare-Rate-Limiting-Regeln (WAF) oder das
 * "ratelimit"-Binding bzw. Durable Objects verwenden.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false as const, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.clear(); // Speicher begrenzen
  return { ok: true as const };
}

export function clientIp(req: Request) {
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

/** Nur Anfragen von der eigenen Seite akzeptieren (einfacher CSRF-Schutz für JSON-POSTs). */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}
