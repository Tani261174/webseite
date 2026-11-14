import { adminCourseSchema } from "@/lib/validation";
import { listCourses, courseStats } from "@/academy/repository";
import { sameOrigin } from "@/lib/server/rate-limit";
import { json, readJson } from "@/lib/server/json";

/**
 * Admin-API Kurse. Zugriff wird in middleware.ts geprüft (ADMIN_USER/ADMIN_PASSWORD).
 * GET  → Kursliste (funktioniert).
 * POST → Kurs prüfen und speichern. Speichern braucht die Datenbank (Cloudflare D1, Binding "DB").
 *        Bis sie verbunden ist, wird der Kurs validiert und mit 503 "database_not_configured" beantwortet.
 */
export async function GET() {
  const courses = await listCourses({ includeDrafts: true });
  return json({ courses: courses.map((c) => ({ slug: c.slug, title: c.title.es, status: c.status, priceCents: c.priceCents ?? null, ...courseStats(c) })) });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);
  let body: unknown;
  try { body = await readJson(req, 30_000); } catch { return json({ error: "invalid" }, 400); }
  const parsed = adminCourseSchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid", issues: parsed.error.issues.map((i) => i.path.join(".")) }, 400);
  if ((await listCourses({ includeDrafts: true })).some((c) => c.slug === parsed.data.slug)) return json({ error: "slug_taken" }, 409);
  // TODO (mit D1): INSERT INTO courses ... – danach erscheint der Kurs automatisch im Katalog.
  return json({ error: "database_not_configured", valid: true }, 503);
}
