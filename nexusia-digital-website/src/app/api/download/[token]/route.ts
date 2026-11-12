import { verifyDownload } from "@/lib/server/signed-url";
import { json } from "@/lib/server/json";
import { rateLimit, clientIp } from "@/lib/server/rate-limit";

/**
 * Geschützte Downloads: Nur mit gültigem, nicht abgelaufenem Token.
 * Die Dateien liegen später in einem privaten R2-Bucket (nie im public/-Ordner).
 */
export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const rl = rateLimit(`dl:${clientIp(req)}`, 30);
  if (!rl.ok) return json({ error: "rate_limited" }, 429);

  if (!process.env.DOWNLOAD_SIGNING_SECRET) return json({ error: "downloads_not_configured" }, 503);

  const { token } = await params;
  const grant = await verifyDownload(token);
  if (!grant) return json({ error: "invalid_or_expired" }, 403);

  // TODO: Datei aus R2 streamen, z. B.:
  // const { env } = getCloudflareContext();
  // const obj = await env.PRODUCT_FILES.get(grant.k);
  // return new Response(obj.body, { headers: { "Content-Disposition": "attachment", "Cache-Control": "private, no-store" } });
  return json({ error: "storage_not_configured" }, 503);
}
