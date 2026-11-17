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
    <article className="card-rose group flex flex-col overflow-hidden p-2.5">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden rounded-[22px] sm:aspect-square lg:aspect-[4/5]" tabIndex={-1} aria-hidden="true">
        <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]">
          <Photo src={product.image} alt={name} label={t.common.photoSoon} tag={t.common.placeholder} priority={priority} />
        </div>
        {!item.available ? (
          <span className="absolute right-3 top-3 rounded-full bg-vanilla px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
            {t.common.soldOut}
          </span>
        ) : product.christmas ? (
          <span className="absolute right-3 top-3 rounded-full bg-sage px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
            ✦ {t.product.christmasBadge}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col px-3 pb-2 pt-5 sm:px-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-[1.4rem] leading-tight text-ink">
            <Link href={href} className="hover:underline decoration-ink/30 underline-offset-4">
              {name}
            </Link>
          </h3>
          <p className="shrink-0 text-right">
            <span className="block font-display text-xl font-semibold text-ink">
              {hasRange ? `${t.common.from} ` : ""}
              {formatEuro(min, locale)}
            </span>
            <span className="text-xs text-ink-muted">{pick(product.unit, locale)}</span>
          </p>
        </div>
        <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-ink-soft">{pick(product.description, locale)}</p>
        <div className="mt-auto pt-5">
          <div className="rounded-[20px] bg-vanilla p-3.5">
            <AddToCart item={item} />
          </div>
        </div>
      </div>
    </article>
  );
}
