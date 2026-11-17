import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/server/page";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/es/carrito", "/de/carrito"] }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
