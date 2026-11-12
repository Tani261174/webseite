import { checkoutSchema } from "@/lib/validation";
import { getProduct } from "@/content/products";
import { paypalConfigured, createPaypalOrder } from "@/lib/server/paypal";
import { rateLimit, clientIp, sameOrigin } from "@/lib/server/rate-limit";
import { json, readJson } from "@/lib/server/json";

/**
 * Erstellt eine PayPal-Bestellung. Der Preis wird IMMER hier auf dem Server
 * aus dem Katalog berechnet – Preise aus dem Browser werden ignoriert.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  const rl = rateLimit(`checkout:${clientIp(req)}`, 10);
  if (!rl.ok) return json({ error: "rate_limited" }, 429);

  if (!paypalConfigured()) return json({ error: "payments_disabled" }, 503);

  let body: unknown;
  try { body = await readJson(req, 5_000); } catch { return json({ error: "invalid" }, 400); }
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid" }, 400);

  const items = [...new Set(parsed.data.items)].map(getProduct);
  if (items.some((p) => !p || p.status !== "available" || p.demo || !p.priceCents)) {
    // Demo-, kostenlose oder noch nicht verfügbare Produkte können nicht gekauft werden.
    return json({ error: "unavailable_items" }, 409);
  }
  const total = items.reduce((sum, p) => sum + (p!.priceCents || 0), 0);

  try {
    const order = await createPaypalOrder(total, crypto.randomUUID());
    return json({ id: order.id });
  } catch {
    return json({ error: "provider_error" }, 502);
  }
}
