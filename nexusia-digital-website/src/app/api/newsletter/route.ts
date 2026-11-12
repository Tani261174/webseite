import { newsletterSchema } from "@/lib/validation";
import { rateLimit, clientIp, sameOrigin } from "@/lib/server/rate-limit";
import { json, readJson } from "@/lib/server/json";

/**
 * Newsletter-Anmeldung (vorbereitet für Double-Opt-in).
 * Ohne angebundenen Newsletter-Anbieter wird nichts gespeichert → "not_configured".
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  const rl = rateLimit(`newsletter:${clientIp(req)}`, 5);
  if (!rl.ok) return json({ error: "rate_limited" }, 429, { "Retry-After": String(rl.retryAfter) });

  let body: unknown;
  try { body = await readJson(req, 2_000); } catch { return json({ error: "invalid" }, 400); }
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "invalid", fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))] }, 400);
  }
  if (parsed.data.website) return json({ ok: true });

  if (!process.env.EMAIL_PROVIDER_API_KEY) return json({ error: "not_configured" }, 503);

  // TODO: Kontakt beim Newsletter-Anbieter anlegen und Bestätigungs-E-Mail (Double-Opt-in) senden.
  return json({ error: "not_configured" }, 503);
}
