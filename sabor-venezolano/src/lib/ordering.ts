import type { Settings } from "./settings";

/**
 * Vorbestell-Regeln – werden im Browser (Hinweise) UND auf dem Server (verbindlich) geprüft.
 * Alle Daten im Format YYYY-MM-DD, "heute" bezieht sich auf die Zeitzone Europe/Berlin.
 */
export const TIMEZONE = "Europe/Berlin";

export type DateRules = Pick<Settings["ordering"], "accepting" | "minLeadDays" | "maxAdvanceDays" | "closedWeekdays"> & {
  blockedDates: string[];
  christmas: { enabled: boolean; orderDeadline: string; periodStart: string; periodEnd: string };
};

export type DateError =
  | "date_invalid"
  | "date_too_soon"
  | "date_too_far"
  | "date_closed_day"
  | "date_blocked"
  | "date_christmas_closed"
  | "date_seasonal"
  | "paused";

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(s: string) {
  if (!ISO.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

export function todayIso(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function weekday(iso: string) {
  return new Date(`${iso}T00:00:00Z`).getUTCDay();
}

export function inChristmasPeriod(iso: string, rules: DateRules) {
  const { periodStart, periodEnd } = rules.christmas;
  if (!periodStart || !periodEnd) return false;
  return iso >= periodStart && iso <= periodEnd;
}

/** Frühestmöglicher Termin (unter Beachtung von Ruhetagen und gesperrten Tagen). */
export function earliestDate(rules: DateRules, leadDays: number, now = new Date()) {
  const start = addDays(todayIso(now), Math.max(0, leadDays));
  const limit = addDays(todayIso(now), rules.maxAdvanceDays);
  let d = start;
  for (let i = 0; i < 400 && d <= limit; i++) {
    if (!rules.closedWeekdays.includes(weekday(d)) && !rules.blockedDates.includes(d)) return d;
    d = addDays(d, 1);
  }
  return start;
}

export function latestDate(rules: DateRules, now = new Date()) {
  return addDays(todayIso(now), rules.maxAdvanceDays);
}

export function checkPickupDate(
  date: string,
  rules: DateRules,
  opts: { leadDays: number; hasSeasonal: boolean; hasChristmasItems?: boolean },
  now = new Date(),
): DateError | null {
  if (!rules.accepting) return "paused";
  if (!isIsoDate(date)) return "date_invalid";
  const today = todayIso(now);
  if (date < addDays(today, Math.max(0, opts.leadDays))) return "date_too_soon";
  if (date > addDays(today, rules.maxAdvanceDays)) return "date_too_far";
  if (rules.closedWeekdays.includes(weekday(date))) return "date_closed_day";
  if (rules.blockedDates.includes(date)) return "date_blocked";

  const xmasDate = rules.christmas.enabled && inChristmasPeriod(date, rules);
  if (opts.hasSeasonal && !xmasDate) return "date_seasonal";
  // Bestellschluss: Abholtermine in der Weihnachtszeit können nach dem Stichtag nicht mehr bestellt werden.
  if (inChristmasPeriod(date, rules) && rules.christmas.orderDeadline && today > rules.christmas.orderDeadline) {
    return "date_christmas_closed";
  }
  return null;
}

export function toDateRules(s: Settings): DateRules {
  return {
    accepting: s.ordering.accepting,
    minLeadDays: s.ordering.minLeadDays,
    maxAdvanceDays: s.ordering.maxAdvanceDays,
    closedWeekdays: s.ordering.closedWeekdays,
    blockedDates: s.ordering.blockedDates.map((b) => b.date),
    christmas: {
      enabled: s.christmas.enabled,
      orderDeadline: s.christmas.orderDeadline,
      periodStart: s.christmas.periodStart,
      periodEnd: s.christmas.periodEnd,
    },
  };
}

/** "2026-12-23" → "23/12/2026" bzw. "23.12.2026" (lesbar, inkl. Wochentag optional) */
export function formatDate(iso: string, locale: "es" | "de", withWeekday = false) {
  if (!isIsoDate(iso)) return iso;
  const d = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "es-ES", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withWeekday ? { weekday: "long" } : {}),
  }).format(d);
}

export function weekdayName(day: number, locale: "es" | "de") {
  // 2023-01-01 war ein Sonntag
  const d = new Date(Date.UTC(2023, 0, 1 + day, 12));
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "es-ES", { weekday: "long", timeZone: "UTC" }).format(d);
}
