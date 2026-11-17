import { localeInfo, type Locale } from "./i18n/config";

const cache = new Map<string, Intl.NumberFormat>();

/** 1600 → "16,00 €" */
export function formatEuro(cents: number, locale: Locale = "es") {
  const key = locale;
  let f = cache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(localeInfo[locale].intl, { style: "currency", currency: "EUR" });
    cache.set(key, f);
  }
  return f.format(cents / 100).replace(/ /g, " ");
}

/** "8,50" oder "8.50" → 850; ungültig → null */
export function parseEuro(input: string): number | null {
  const clean = input.trim().replace(/€/g, "").replace(/\s/g, "").replace(",", ".");
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(clean)) return null;
  return Math.round(Number(clean) * 100);
}

export function centsToInput(cents: number | null | undefined) {
  if (cents == null) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}
