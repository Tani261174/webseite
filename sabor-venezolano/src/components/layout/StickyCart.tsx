"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatEuro } from "@/lib/money";
import { waLink } from "@/lib/whatsapp";
import { Icon } from "../ui/Icon";
import { useCart, useCartLines } from "../providers/CartProvider";
import { useI18n } from "../providers/I18nProvider";

/** Mobile: feste Leiste unten mit Warenkorb – oder ein WhatsApp-Button, solange der Warenkorb leer ist. */
export function StickyCart({ whatsappNumber }: { whatsappNumber: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() || "";
  const { count, ready } = useCart();
  const { totalCents } = useCartLines();
  if (!ready || pathname.endsWith("/carrito")) return null;

  if (count === 0) {
    return (
      <a
        href={waLink(whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.common.whatsapp}
        className="fixed bottom-5 right-4 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-[0_14px_30px_-12px_rgba(23,23,23,0.5)] ring-4 ring-white transition-transform hover:scale-105"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <Icon name="whatsapp" className="h-7 w-7" />
      </a>
    );
  }

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-30 px-3 pt-2 md:hidden">
      <Link
        href={`/${locale}/carrito`}
        className="flex min-h-[3.6rem] items-center justify-between gap-3 rounded-md bg-ink px-5 text-white shadow-[0_16px_36px_-14px_rgba(23,23,23,0.6)]"
      >
        <span className="flex items-center gap-3">
          <span className="relative">
            <Icon name="bag" className="h-6 w-6 text-white" />
            <span className="absolute -right-2 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[0.7rem] font-bold text-ink">
              {count}
            </span>
          </span>
          <span className="text-[0.8rem] font-semibold uppercase tracking-[0.14em]">{t.cart.stickyLabel}</span>
        </span>
        <span className="flex items-center gap-2 font-display text-lg text-white">
          {formatEuro(totalCents, locale)}
          <Icon name="arrow" className="h-4 w-4" />
        </span>
      </Link>
    </div>
  );
}
