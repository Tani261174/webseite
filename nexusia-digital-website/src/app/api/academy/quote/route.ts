import { quoteSchema } from "@/lib/validation";
import { getCourse } from "@/academy/repository";
import { quote } from "@/academy/pricing";
import { rateLimit, clientIp, sameOrigin } from "@/lib/server/rate-limit";
import { json, readJson } from "@/lib/server/json";

/** Serverseitige Preisberechnung inkl. Gutschein. Erstellt KEINE Zahlung. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  const rl = rateLimit(`quote:${clientIp(req)}`, 30);
  if (!rl.ok) return json({ error: "rate_limited" }, 429);
  let body: unknown;
  try { body = await readJson(req, 2_000); } catch { return json({ error: "invalid" }, 400); }
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid" }, 400);
  const course = await getCourse(parsed.data.course);
  if (!course) return json({ error: "not_found" }, 404);
  return json({ ...quote(course, parsed.data.code), purchasable: false });
}
