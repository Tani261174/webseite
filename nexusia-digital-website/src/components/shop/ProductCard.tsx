import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/messages/de";
import type { PublicProduct } from "@/content/products";
import { formatPrice } from "@/content/products";
import { getBrand } from "@/content/brands";
import { href } from "@/lib/site";
import { Artwork } from "@/components/art/Artwork";
import { DemoBadge } from "@/components/ui/Section";
import { ProductAction } from "./ProductAction";

export function StatusPill({ status, label }: { status: PublicProduct["status"]; label: string }) {
  const style =
    status === "available" ? "bg-gold text-ink" : status === "free" ? "bg-white text-ink" : "bg-ink/80 text-white border border-white/20";
  return <span className={`rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] backdrop-blur ${style}`}>{label}</span>;
}

export function PriceTag({ product, locale, t }: { product: PublicProduct; locale: Locale; t: Dictionary }) {
  if (product.status === "free") return <span className="display text-2xl text-ink">{t.shop.statusLabels.free}</span>;
  if (product.priceCents == null) return <span className="text-sm text-graphite">{t.common.comingSoon}</span>;
  return (
    <span className="flex items-baseline gap-2">
      <span className="display text-2xl text-ink">{formatPrice(product.priceCents, locale)}</span>
      {product.demo ? <span className="text-[0.65rem] uppercase tracking-[0.14em] text-smoke">{t.shop.demoPrice}</span> : null}
    </span>
  );
}

export function ProductCard({ product, locale, t }: { product: PublicProduct; locale: Locale; t: Dictionary }) {
  const brand = getBrand(product.brand);
  const url = href(locale, `/shop/${product.slug}`);
  return (
    <article className="card-lux group flex w-full flex-col overflow-hidden">
      <Link href={url} className="relative block aspect-[4/3] overflow-hidden" tabIndex={-1} aria-hidden="true">
        <Artwork variant={product.art} id={`pc-${product.slug}`} className="h-full w-full transition duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-[1.06]" />
        <div className="absolute left-4 top-4 flex gap-2">
          <StatusPill status={product.status} label={t.shop.statusLabels[product.status]} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow text-[0.62rem] text-gold-600">{brand?.name} · {t.shop.categoryLabels[product.category]}</p>
          {product.demo ? <DemoBadge label={t.common.demo} /> : null}
        </div>
        <h3 className="display mt-3 text-[1.7rem] leading-tight">
          <Link href={url} className="transition hover:text-gold-600">{product.title[locale]}</Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-graphite">{product.short[locale]}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <PriceTag product={product} locale={locale} t={t} />
          <ProductAction
            slug={product.slug}
            status={product.status}
            labels={t.shop}
            newsletterHref={`${href(locale)}#newsletter`}
            cartHref={href(locale, "/cart")}
          />
        </div>
      </div>
    </article>
  );
}
