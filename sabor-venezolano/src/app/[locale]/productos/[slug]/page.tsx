import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pick } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/messages";
import { formatEuro } from "@/lib/money";
import { alternates, resolveLocale, siteUrl } from "@/lib/server/page";
import { getProductBySlug, getSettings, isAvailable, toCatalogItem } from "@/lib/server/repo";
import { Ornament } from "@/components/brand/Brand";
import { AddToCart } from "@/components/shop/AddToCart";
import { Icon } from "@/components/ui/Icon";
import { Photo } from "@/components/ui/Photo";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return {};
  return {
    title: pick(p.name, locale),
    description: pick(p.description, locale).slice(0, 160),
    alternates: alternates(locale, `/productos/${p.slug}`),
    openGraph: p.image ? { images: [{ url: p.image }] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { locale, t } = await resolveLocale(params);
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) notFound();
  const settings = getSettings();
  const name = pick(p.name, locale);
  const lead = Math.max(settings.ordering.minLeadDays, p.leadDays ?? 0);
  const ingredients = pick(p.ingredients, locale);
  const foodInfo = pick(p.foodInfo, locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: pick(p.description, locale),
    ...(p.image ? { image: `${siteUrl()}${p.image}` } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: (p.priceCents / 100).toFixed(2),
      availability: isAvailable(p) ? "https://schema.org/PreOrder" : "https://schema.org/SoldOut",
    },
  };

  return (
    <div className="bg-linen px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-6xl">
        <Link href={`/${locale}/productos`} className="inline-flex items-center gap-2 text-sm font-semibold text-bordeaux hover:underline">
          <Icon name="arrow" className="h-4 w-4 rotate-180" /> {t.product.back}
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="card relative aspect-square overflow-hidden md:sticky md:top-24 md:self-start">
            <Photo src={p.image} alt={name} label={t.common.photoSoon} tag={t.common.placeholder} priority />
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              {p.christmas ? (
                <span className="rounded-full bg-bordeaux px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-light">
                  ✦ {t.product.christmasBadge}
                </span>
              ) : null}
              {p.seasonal ? (
                <span className="rounded-full bg-gold/25 px-3 py-1 text-xs font-bold uppercase tracking-wider text-bordeaux">
                  {t.product.seasonalBadge}
                </span>
              ) : null}
            </div>
            <h1 className="mt-3 font-display text-4xl leading-tight text-bordeaux sm:text-5xl">{name}</h1>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold text-cocoa">{formatEuro(p.priceCents, locale)}</span>
              <span className="text-cocoa-muted">{pick(p.unit, locale)}</span>
            </p>
            <Ornament className="my-6 justify-start" />
            <p className="text-lg leading-relaxed text-cocoa-soft">{pick(p.description, locale)}</p>

            <div className="card mt-8 p-5 sm:p-6">
              <AddToCart item={toCatalogItem(p)} layout="detail" />
              <p className="mt-4 flex items-start gap-2 text-sm text-cocoa-muted">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                {fmt(t.product.leadTime, { n: lead })}
              </p>
            </div>

            <section className="mt-10 space-y-6" aria-label={t.product.foodInfo}>
              <div>
                <h2 className="eyebrow text-gold-dark">{t.product.allergens}</h2>
                {p.allergensConfirmed ? (
                  p.allergens.length ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {p.allergens.map((a) => (
                        <li key={a} className="rounded-full border border-bordeaux/25 bg-ivory px-3 py-1.5 text-sm font-semibold text-bordeaux">
                          {t.allergens[a]}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-cocoa-soft">{t.product.noAllergens}</p>
                  )
                ) : (
                  <p className="mt-2 flex items-start gap-2 rounded-2xl bg-gold/15 p-4 text-sm text-cocoa">
                    <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-bordeaux" />
                    {t.product.allergensMissing}
                  </p>
                )}
              </div>
              {ingredients ? (
                <div>
                  <h2 className="eyebrow text-gold-dark">{t.product.ingredients}</h2>
                  <p className="mt-2 whitespace-pre-line text-cocoa-soft">{ingredients}</p>
                </div>
              ) : null}
              {foodInfo ? (
                <div>
                  <h2 className="eyebrow text-gold-dark">{t.product.foodInfo}</h2>
                  <p className="mt-2 whitespace-pre-line text-cocoa-soft">{foodInfo}</p>
                </div>
              ) : null}
              <p className="text-sm">
                <Link href={`/${locale}/legal/alimentos`} className="text-bordeaux underline underline-offset-4">
                  {t.legal.food}
                </Link>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
