import "server-only";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "../i18n/config";
import { getMessages } from "../i18n/messages";

export async function resolveLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { locale: locale as Locale, t: getMessages(locale as Locale) };
}

export function siteUrl() {
  return (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

/** hreflang-Alternativen für einen Pfad ohne Sprachpräfix, z. B. "/productos". */
export function alternates(locale: Locale, path: string) {
  const p = path === "/" ? "" : path;
  return {
    canonical: `${siteUrl()}/${locale}${p}`,
    languages: {
      es: `${siteUrl()}/es${p}`,
      de: `${siteUrl()}/de${p}`,
      "x-default": `${siteUrl()}/es${p}`,
    },
  };
}
