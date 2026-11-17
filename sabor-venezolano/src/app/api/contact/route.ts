import { NextResponse } from "next/server";
import { z } from "zod";
import { isLocale } from "@/lib/i18n/config";
import { createInquiry } from "@/lib/server/repo";
import { checkFormToken, clientKey, rateLimit, sameOrigin } from "@/lib/server/security";

/**
 * Kontaktformular → wird im Adminbereich unter "Mensajes" angezeigt.
 * Spam-Schutz: Herkunftsprüfung, Honeypot, Zeit-Token, Rate-Limit, Längenbegrenzung, Link-Filter.
 */
const schema = z.object({
  locale: z.string(),
  name: z.string().trim().min(2).max(80),
  contact: z.string().trim().min(5).max(120),
  message: z.string().trim().min(5).max(2000),
  consent: z.literal(true),
  token: z.string().max(200),
  website: z.string().max(0).optional(),
});

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("generic", 403);
  const raw = await req.json().catch(() => null);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const f = parsed.error.issues[0]?.path[0];
    if (f === "website") return NextResponse.json({ ok: true });
    if (f === "name") return fail("nameRequired");
    if (f === "contact") return fail("contactRequired");
    if (f === "message") return fail("messageRequired");
    if (f === "consent") return fail("consentRequired");
    return fail("invalid");
  }
  const d = parsed.data;
  const t = checkFormToken(d.token);
  if (t === "fast") return fail("tooFast");
  if (t !== "ok") return fail("generic");

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.contact);
  const phoneOk = /^[+0-9 ()/-]{6,30}$/.test(d.contact);
  if (!emailOk && !phoneOk) return fail("contactRequired");
  // Typischer Spam: viele Links
  if ((d.message.match(/https?:\/\//g) || []).length > 2) return NextResponse.json({ ok: true });

  if (!rateLimit("contact", clientKey(req.headers), 4, 30 * 60 * 1000)) return fail("rateLimited", 429);

  createInquiry({ name: d.name, contact: d.contact, message: d.message, locale: isLocale(d.locale) ? d.locale : "es" });
  return NextResponse.json({ ok: true });
}
