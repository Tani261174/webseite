import { tutorSchema } from "@/lib/validation";
import { askTutor } from "@/academy/tutor";
import { rateLimit, clientIp, sameOrigin } from "@/lib/server/rate-limit";
import { json, readJson } from "@/lib/server/json";

/** NexusTutor AI – beantwortet Fragen auf Basis geprüfter Akademie-Inhalte. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  const rl = rateLimit(`tutor:${clientIp(req)}`, 30);
  if (!rl.ok) return json({ error: "rate_limited" }, 429, { "Retry-After": String(rl.retryAfter) });
  let body: unknown;
  try { body = await readJson(req, 4_000); } catch { return json({ error: "invalid" }, 400); }
  const parsed = tutorSchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid" }, 400);
  const { question, locale, course } = parsed.data;
  return json(await askTutor(question, locale, course));
}
