import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { brands } from "@/content/brands";
import { products } from "@/content/products";
import { siteUrl, href } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "", "/brands", "/shop", "/courses", "/faq", "/contact",
    "/legal/imprint", "/legal/privacy", "/legal/terms", "/legal/withdrawal", "/legal/cookies",
    ...brands.map((b) => `/brands/${b.slug}`),
    ...products.map((p) => `/shop/${p.slug}`),
  ];
  const now = new Date();
  return paths.map((path) => ({
    url: `${siteUrl}${href(defaultLocale, path)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}${href(l, path)}`])) },
  }));
}
