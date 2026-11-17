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
        className="fixed bottom-5 right-4 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose text-ink shadow-[0_14px_30px_-12px_rgba(46,46,49,0.35)] ring-4 ring-vanilla transition-transform hover:scale-105"
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
        className="flex min-h-[3.6rem] items-center justify-between gap-3 rounded-full bg-rose px-5 text-ink shadow-[0_16px_36px_-14px_rgba(46,46,49,0.45)] ring-1 ring-ink/10"
      >
        <span className="flex items-center gap-3">
          <span className="relative">
            <Icon name="bag" className="h-6 w-6 text-ink" />
            <span className="absolute -right-2 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-vanilla px-1 text-[0.7rem] font-extrabold text-ink ring-1 ring-ink/15">
              {count}
            </span>
          </span>
          <span className="font-semibold">{t.cart.stickyLabel}</span>
        </span>
        <span className="flex items-center gap-2 font-display text-lg text-ink">
          {formatEuro(totalCents, locale)}
          <Icon name="arrow" className="h-4 w-4" />
        </span>
      </Link>
    </div>
  );
}
