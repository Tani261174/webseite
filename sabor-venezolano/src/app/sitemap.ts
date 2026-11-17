import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/server/page";
import { getSettings, listProducts } from "@/lib/server/repo";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths = ["", "/productos", "/contacto", ...(getSettings().christmas.enabled ? ["/navidad"] : [])];
  for (const p of listProducts()) paths.push(`/productos/${p.slug}`);
  return paths.flatMap((p) =>
    (["es", "de"] as const).map((l) => ({
      url: `${base}/${l}${p}`,
      alternates: { languages: { es: `${base}/es${p}`, de: `${base}/de${p}` } },
    })),
  );
}
