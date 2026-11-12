export const locales = ["de", "es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export const localeNames: Record<Locale, { short: string; native: string; htmlLang: string; og: string }> = {
  de: { short: "DE", native: "Deutsch", htmlLang: "de-DE", og: "de_DE" },
  es: { short: "ES", native: "Español", htmlLang: "es-ES", og: "es_ES" },
  en: { short: "EN", native: "English", htmlLang: "en", og: "en_US" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Lokalisierter Text: ein Wert pro Sprache. */
export type L10n<T = string> = Record<Locale, T>;
