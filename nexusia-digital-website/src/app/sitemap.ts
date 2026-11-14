import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { brands } from "@/content/brands";
import { products } from "@/content/products";
import { siteUrl, href } from "@/lib/site";
import { listCourses, flatLessons, INTRO_SLUG } from "@/academy/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await listCourses();
  const paths = [
    "", "/brands", "/shop", "/courses", "/faq", "/contact",
    "/legal/imprint", "/legal/privacy", "/legal/terms", "/legal/withdrawal", "/legal/cookies",
    ...brands.map((b) => `/brands/${b.slug}`),
    ...products.map((p) => `/shop/${p.slug}`),
    "/academia", "/academia/tutor",
    ...courses.flatMap((c) => [
      `/academia/${c.slug}`,
      `/academia/${c.slug}/aprender/${INTRO_SLUG}`,
      ...flatLessons(c).filter((x) => x.lesson.access === "preview" && x.lesson.status === "ready").map((x) => `/academia/${c.slug}/aprender/${x.lesson.slug}`),
    ]),
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
