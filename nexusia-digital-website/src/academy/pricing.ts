/**
 * Preis- und Gutscheinberechnung – läuft IMMER auf dem Server.
 * Preise oder Rabatte aus dem Browser werden nie übernommen.
 * Gutscheine kommen später aus D1 (Tabelle `coupons`), angelegt im Admin-Dashboard.
 */
import type { Course } from "./types";

export interface Coupon {
  code: string;
  percentOff?: number;
  amountOffCents?: number;
  /** leer = gilt für alle Kurse */
  courses?: string[];
  expiresAt?: string;
  active: boolean;
  /** Beispielgutschein für den Testbetrieb */
  demo: boolean;
}

/** Nur zum Testen der Rabattlogik – ohne echte Zahlung wirkungslos. */
export const coupons: Coupon[] = [
  { code: "BIENVENIDA10", percentOff: 10, active: true, demo: true },
];

export type CouponResult = { code: string; ok: true; demo: boolean } | { code: string; ok: false; reason: "unknown" | "expired" | "not_applicable" };

export function quote(course: Course, rawCode?: string) {
  const subtotal = course.priceCents ?? null;
  let discount = 0;
  let coupon: CouponResult | null = null;
  const code = rawCode?.trim().toUpperCase();
  if (code && subtotal) {
    const c = coupons.find((x) => x.code === code && x.active);
    if (!c) coupon = { code, ok: false, reason: "unknown" };
    else if (c.expiresAt && new Date(c.expiresAt) < new Date()) coupon = { code, ok: false, reason: "expired" };
    else if (c.courses?.length && !c.courses.includes(course.slug)) coupon = { code, ok: false, reason: "not_applicable" };
    else {
      discount = Math.min(subtotal, c.percentOff ? Math.round((subtotal * c.percentOff) / 100) : c.amountOffCents || 0);
      coupon = { code, ok: true, demo: c.demo };
    }
  }
  return { subtotal, discount, total: subtotal === null ? null : subtotal - discount, coupon };
}

export function formatPrice(cents: number, locale: string) {
  return new Intl.NumberFormat({ es: "es-ES", de: "de-DE", en: "en-IE" }[locale] || "es-ES", { style: "currency", currency: "EUR" }).format(cents / 100);
}
