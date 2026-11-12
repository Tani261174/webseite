import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const siteName = "NexusIA Digital";

/** Baut einen Pfad mit Sprachpräfix: href("de", "/shop") → "/de/shop" */
export function href(locale: Locale, path = "") {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

/** Metadaten inkl. hreflang-Alternativen und Open Graph. */
export function pageMetadata(opts: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  const { locale, path, title, description, noindex } = opts;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${siteUrl}${href(l, path)}`;
  languages["x-default"] = `${siteUrl}${href(defaultLocale, path)}`;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}${href(locale, path)}`, languages },
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: `${siteUrl}${href(locale, path)}`,
      locale: { de: "de_DE", es: "es_ES", en: "en_US" }[locale],
      images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: siteName }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}/og.png`] },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
