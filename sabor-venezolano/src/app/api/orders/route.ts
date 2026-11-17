import { NextResponse } from "next/server";
import { z } from "zod";
import { isLocale, pick, type Locale } from "@/lib/i18n/config";
import { checkPickupDate, toDateRules } from "@/lib/ordering";
import { createOrder, getSettings, isAvailable, listProducts, StockError } from "@/lib/server/repo";
import { checkFormToken, clientKey, rateLimit, sameOrigin } from "@/lib/server/security";
import type { OrderLine } from "@/lib/types";
import { buildOrderMessage, waLink } from "@/lib/whatsapp";

/**
 * Bestellanfrage aus dem Warenkorb.
 * - Prüft alles serverseitig neu (Preise, Verfügbarkeit, Termin) – dem Browser wird nicht vertraut.
 * - Speichert die Anfrage mit Status "nuevo" (über die Website erfasst).
 * - Liefert den fertigen WhatsApp-Text zurück. Ob die WhatsApp-Nachricht tatsächlich gesendet wurde,
 *   kann die Website NICHT wissen – das prüft das Team manuell.
 */
const schema = z.object({
  locale: z.string(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        variantId: z.number().int().positive().nullable(),
        qty: z.number().int().min(1).max(500),
      }),
    )
    .min(1)
    .max(30),
  date: z.string().max(10),
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v === "" || /^[+0-9 ()/-]{6,30}$/.test(v)),
  message: z.string().trim().max(800),
  consent: z.literal(true),
  token: z.string().max(200),
  website: z.string().max(0).optional(), // Honeypot: muss leer bleiben
});

type Err = { error: string; params?: Record<string, string | number> };
const fail = (body: Err, status = 400) => NextResponse.json(body, { status });

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail({ error: "generic" }, 403);

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return fail({ error: "invalid" });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.path[0];
    if (first === "name") return fail({ error: "nameRequired" });
    if (first === "consent") return fail({ error: "consentRequired" });
    if (first === "items") {
      const items = (raw as { items?: unknown })?.items;
      return fail({ error: Array.isArray(items) && items.length ? "invalid" : "cartEmpty" });
    }
    if (first === "website") return NextResponse.json({ ok: true, spam: true }); // Bot still ignorieren
    return fail({ error: "invalid" });
  }
  const d = parsed.data;
  const locale: Locale = isLocale(d.locale) ? d.locale : "es";

  const token = checkFormToken(d.token);
  if (token === "fast") return fail({ error: "tooFast" });
  if (token !== "ok") return fail({ error: "generic" });
  if (!rateLimit("order", clientKey(req.headers), 6, 15 * 60 * 1000)) return fail({ error: "rateLimited" }, 429);

  const settings = getSettings();
  const products = listProducts();
  const lines: OrderLine[] = [];
  const waLines: { qty: number; name: string; variant: string | null; lineCents: number }[] = [];
  const qtyPerProduct = new Map<number, number>();
  let leadDays = settings.ordering.minLeadDays;
  let hasSeasonal = false;

  for (const it of d.items) {
    const p = products.find((x) => x.id === it.productId);
    if (!p) return fail({ error: "unavailable", params: { name: "?" } });
    const pname = pick(p.name, locale);
    if (!isAvailable(p)) return fail({ error: p.soldOut || p.stock === 0 ? "soldOut" : "unavailable", params: { name: pname } });
    const activeVariants = p.variants.filter((v) => v.active);
    let variant = null as (typeof activeVariants)[number] | null;
    if (activeVariants.length) {
      variant = activeVariants.find((v) => v.id === it.variantId) ?? null;
      if (!variant) return fail({ error: "variantRequired", params: { name: pname } });
    } else if (it.variantId != null) {
      return fail({ error: "unavailable", params: { name: pname } });
    }
    const total = (qtyPerProduct.get(p.id) || 0) + it.qty;
    qtyPerProduct.set(p.id, total);
    if (total > p.maxPerOrder || (p.stock != null && total > p.stock)) {
      return fail({ error: "soldOut", params: { name: pname } });
    }
    leadDays = Math.max(leadDays, p.leadDays ?? 0);
    hasSeasonal ||= p.seasonal;
    const unit = variant?.priceCents ?? p.priceCents;
    lines.push({
      productId: p.id,
      variantId: variant?.id ?? null,
      name: p.name.es,
      variant: variant ? variant.name.es : null,
      qty: it.qty,
      unitCents: unit,
      lineCents: unit * it.qty,
    });
    waLines.push({ qty: it.qty, name: pname, variant: variant ? pick(variant.name, locale) : null, lineCents: unit * it.qty });
  }

  const rules = toDateRules(settings);
  const dateError = checkPickupDate(d.date, rules, { leadDays, hasSeasonal });
  if (dateError) return fail({ error: dateError, params: { leadDays } });

  const totalCents = lines.reduce((s, l) => s + l.lineCents, 0);

  let code: string;
  try {
    code = createOrder({
      name: d.name,
      phone: d.phone,
      pickupDate: d.date,
      message: d.message,
      items: lines,
      totalCents,
      locale,
    });
  } catch (e) {
    if (e instanceof StockError) return fail({ error: "soldOut", params: { name: e.productName } }, 409);
    console.error("Bestellung konnte nicht gespeichert werden", e);
    return fail({ error: "generic" }, 500);
  }

  const text = buildOrderMessage(locale, {
    lines: waLines,
    totalCents,
    date: d.date,
    name: d.name,
    phone: d.phone,
    notes: d.message,
    code,
  });
  return NextResponse.json({ ok: true, code, totalCents, text, url: waLink(settings.shop.whatsappNumber, text) });
}
