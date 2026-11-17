import es from "@/messages/es";
import de from "@/messages/de";
import type { Locale } from "./config";

export type { Messages } from "@/messages/es";

const dictionaries = { es, de } as const;

export function getMessages(locale: Locale) {
  return dictionaries[locale];
}

/** Ersetzt {platzhalter} in Texten. */
export function fmt(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in values ? String(values[k]) : `{${k}}`));
}
