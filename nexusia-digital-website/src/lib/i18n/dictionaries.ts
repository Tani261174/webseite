import "server-only";
import type { Locale } from "./config";
import de from "@/messages/de";
import es from "@/messages/es";
import en from "@/messages/en";

const dictionaries = { de, es, en } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
