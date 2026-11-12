import { contactSchema } from "@/lib/validation";
import { rateLimit, clientIp, sameOrigin } from "@/lib/server/rate-limit";
import { json, readJson } from "@/lib/server/json";

/**
 * Kontaktformular.
 * Status: Validierung, Honeypot, Rate-Limit und Origin-Prüfung sind aktiv.
 * Der eigentliche Versand ist NICHT angebunden – ohne E-Mail-Anbieter
 * antwortet die Route ehrlich mit "not_configured" (HTTP 503) und speichert nichts.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  const rl = rateLimit(`contact:${clientIp(req)}`, 5);
  if (!rl.ok) return json({ error: "rate_limited" }, 429, { "Retry-After": String(rl.retryAfter) });

  let body: unknown;
  try { body = await readJson(req); } catch { return json({ error: "invalid" }, 400); }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "invalid", fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))] }, 400);
  }
  if (parsed.data.website) return json({ ok: true }); // Bot – still verwerfen

  if (!process.env.EMAIL_PROVIDER_API_KEY || !process.env.CONTACT_RECIPIENT) {
    return json({ error: "not_configured" }, 503);
  }

  // TODO: Versand über einen E-Mail-Anbieter (z. B. Resend, Postmark, Mailgun) per fetch().
  // Der API-Schlüssel bleibt ausschließlich serverseitig (Cloudflare Secret).
  return json({ error: "not_configured" }, 503);
}
