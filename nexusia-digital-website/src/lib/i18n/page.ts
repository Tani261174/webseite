import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

/** Hilfsfunktion für Seiten: prüft die Sprache und lädt die Texte. */
export async function resolveLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { locale: locale as Locale, t: getDictionary(locale) };
}
