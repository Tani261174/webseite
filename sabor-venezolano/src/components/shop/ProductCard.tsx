import Link from "next/link";
import { pick, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { formatEuro } from "@/lib/money";
import type { CatalogItem, Product } from "@/lib/types";
import { Photo } from "../ui/Photo";
import { AddToCart } from "./AddToCart";

export function ProductCard({
  product,
  item,
  locale,
  t,
  priority = false,
}: {
  product: Product;
  item: CatalogItem;
  locale: Locale;
  t: Messages;
  priority?: boolean;
}) {
  const name = pick(product.name, locale);
  const href = `/${locale}/productos/${product.slug}`;
  const prices = [product.priceCents, ...product.variants.filter((v) => v.active && v.priceCents != null).map((v) => v.priceCents!)];
  const min = Math.min(...prices);
  const hasRange = prices.some((p) => p !== min);

  return (
    <article className="card-product group flex flex-col">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden rounded-[4px] bg-paper" tabIndex={-1} aria-hidden="true">
        <div className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-soft)] group-hover:scale-[1.035]">
          <Photo src={product.image} alt={name} label={t.common.photoSoon} tag={t.common.placeholder} priority={priority} />
        </div>
        {!item.available ? (
          <span className="absolute right-4 top-4 bg-ink px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white">
            {t.common.soldOut}
          </span>
        ) : product.christmas ? (
          <span className="absolute right-4 top-4 flex items-center gap-1.5 bg-white px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-flag-red" aria-hidden="true" />
            {t.product.christmasBadge}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col pt-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-[1.55rem] leading-tight text-ink">
            <Link href={href} className="decoration-ink/40 underline-offset-4 hover:underline">
              {name}
            </Link>
          </h3>
          <p className="shrink-0 text-right">
            <span className="block font-display text-xl text-ink">
              {hasRange ? `${t.common.from} ` : ""}
              {formatEuro(min, locale)}
            </span>
            <span className="text-xs text-ink-muted">{pick(product.unit, locale)}</span>
          </p>
        </div>
        <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-ink-soft">{pick(product.description, locale)}</p>
        <div className="mt-auto pt-5">
          <div className="border-t border-line pt-5">
            <AddToCart item={item} />
          </div>
        </div>
      </div>
    </article>
  );
}
