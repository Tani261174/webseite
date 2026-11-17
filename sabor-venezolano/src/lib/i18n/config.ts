export const locales = ["es", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const localeInfo: Record<Locale, { label: string; flag: string; htmlLang: string; og: string; intl: string }> = {
  es: { label: "Español", flag: "🇻🇪", htmlLang: "es-VE", og: "es_VE", intl: "es-ES" },
  de: { label: "Deutsch", flag: "🇩🇪", htmlLang: "de-DE", og: "de_DE", intl: "de-DE" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Zweisprachiger Text (Spanisch + Deutsch). */
export type Bi = { es: string; de: string };

/** Wählt die passende Sprache, fällt auf Spanisch zurück, wenn Deutsch leer ist. */
export function pick(text: Bi | undefined | null, locale: Locale): string {
  if (!text) return "";
  return (text[locale] || text.es || "").trim();
}
