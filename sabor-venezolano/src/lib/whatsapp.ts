import type { Locale } from "./i18n/config";
import { getMessages } from "./i18n/messages";
import { formatEuro } from "./money";
import { formatDate } from "./ordering";

export type WaLine = { qty: number; name: string; variant: string | null; lineCents: number };

export function buildOrderMessage(
  locale: Locale,
  data: { lines: WaLine[]; totalCents: number; date: string; name: string; phone?: string; notes?: string; code?: string },
) {
  const t = getMessages(locale).wa;
  const lines = data.lines.map((l) => {
    const label = l.variant ? `${l.name} (${l.variant})` : l.name;
    return `${l.qty} × ${label} – ${formatEuro(l.lineCents, locale)}`;
  });
  const parts = [
    t.greeting,
    "",
    ...lines,
    "",
    `*${t.total}: ${formatEuro(data.totalCents, locale)}*`,
    "",
    `${t.date}: ${data.date ? formatDate(data.date, locale, true) : t.none}`,
    "",
    `${t.name}: ${data.name || t.none}`,
  ];
  if (data.phone) parts.push(`${t.phone}: ${data.phone}`);
  parts.push("", `${t.notes}: ${data.notes?.trim() || t.none}`);
  if (data.code) parts.push("", `${t.ref}: ${data.code}`);
  parts.push("", t.thanks);
  return parts.join("\n");
}

export function waLink(number: string, text?: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
