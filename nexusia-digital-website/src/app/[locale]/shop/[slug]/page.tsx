import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct, toPublic } from "@/content/products";
import { getBrand } from "@/content/brands";
import { locales } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/page";
import { href, pageMetadata, siteUrl } from "@/lib/site";
import { Container, DemoBadge, Notice } from "@/components/ui/Section";
import { Artwork } from "@/components/art/Artwork";
import { Icon } from "@/components/ui/Icon";
import { ProductCard, PriceTag, StatusPill } from "@/components/shop/ProductCard";
import { ProductAction } from "@/components/shop/ProductAction";

type P = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const p = getProduct((await params).slug);
  if (!p) return {};
  return pageMetadata({ locale, path: `/shop/${p.slug}`, title: p.title[locale], description: p.short[locale] });
}

export default async function ProductPage({ params }: P) {
  const { locale, t } = await resolveLocale(params);
  const raw = getProduct((await params).slug);
  if (!raw) notFound();
  const p = toPublic(raw);
  const brand = getBrand(p.brand)!;
  const related = products.filter((x) => x.slug !== p.slug && (x.brand === p.brand || x.category === p.category)).slice(0, 3).map(toPublic);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": p.category === "courses" ? "Course" : "Product",
    name: p.title[locale],
    description: p.description[locale],
    brand: { "@type": "Brand", name: brand.name },
    url: `${siteUrl}${href(locale, `/shop/${p.slug}`)}`,
  };

  return (
    <>
      {/* Demo-Produkte: strukturierte Daten ohne Preis/Angebot, um nichts Falsches zu behaupten */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="py-10 sm:py-16">
        <Container>
          <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.16em] text-smoke">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href={href(locale)} className="hover:text-ink">{t.nav.home}</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={href(locale, "/shop")} className="hover:text-ink">{t.nav.shop}</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-ink" aria-current="page">{p.title[locale]}</li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="gold-frame relative aspect-[4/3] overflow-hidden rounded-[1.75rem] lg:sticky lg:top-28 lg:self-start">
              <Artwork variant={p.art} id={`pd-${p.slug}`} className="h-full w-full" title={p.title[locale]} />
              <div className="absolute left-5 top-5"><StatusPill status={p.status} label={t.shop.statusLabels[p.status]} /></div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href={href(locale, `/brands/${brand.slug}`)} className="eyebrow text-gold-600 hover:text-ink">{brand.name}</Link>
                <span className="text-smoke">·</span>
                <span className="eyebrow text-graphite">{t.shop.categoryLabels[p.category]}</span>
                {p.demo ? <DemoBadge label={t.common.demo} /> : null}
              </div>
              <h1 className="display mt-4 text-5xl sm:text-6xl">{p.title[locale]}</h1>
              <p className="mt-5 text-lg leading-relaxed text-graphite">{p.description[locale]}</p>

              <div className="mt-8 flex flex-wrap items-center gap-6 border-y border-mist py-6">
                <PriceTag product={p} locale={locale} t={t} />
                <ProductAction slug={p.slug} status={p.status} labels={t.shop} newsletterHref={`${href(locale)}#newsletter`} cartHref={href(locale, "/cart")} size="lg" />
              </div>

              {p.status === "coming-soon" ? <div className="mt-6"><Notice>{t.product.comingSoonText}</Notice></div> : null}
              {p.status === "free" ? <div className="mt-6"><Notice>{t.product.freeText}</Notice></div> : null}
              {p.demo ? <p className="mt-4 text-xs text-smoke">{t.common.demoNotice}</p> : null}

              <dl className="mt-10 divide-y divide-mist">
                <div className="grid gap-2 py-5 sm:grid-cols-3">
                  <dt className="font-semibold">{t.product.includes}</dt>
                  <dd className="sm:col-span-2">
                    <ul className="space-y-2 text-graphite">
                      {p.includes[locale].map((i) => (
                        <li key={i} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-gold-600" /> {i}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="grid gap-2 py-5 sm:grid-cols-3">
                  <dt className="font-semibold">{t.product.format}</dt>
                  <dd className="flex flex-wrap gap-2 sm:col-span-2">
                    {p.formats.map((f) => <span key={f} className="rounded-full border border-mist px-3 py-1 text-xs font-semibold tracking-wider">{f}</span>)}
                  </dd>
                </div>
                {p.level ? (
                  <div className="grid gap-2 py-5 sm:grid-cols-3">
                    <dt className="font-semibold">{t.coursesPage.level}</dt>
                    <dd className="text-graphite sm:col-span-2">{t.coursesPage.levels[p.level]}</dd>
                  </div>
                ) : null}
                <div className="grid gap-2 py-5 sm:grid-cols-3">
                  <dt className="font-semibold">{t.product.delivery}</dt>
                  <dd className="text-graphite sm:col-span-2">{t.product.deliveryText}</dd>
                </div>
                <div className="grid gap-2 py-5 sm:grid-cols-3">
                  <dt className="font-semibold">{t.product.license}</dt>
                  <dd className="text-graphite sm:col-span-2">{t.product.licenseText}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {related.length ? (
        <section className="bg-pearl py-20">
          <Container>
            <h2 className="display text-4xl">{t.product.related}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <ProductCard key={r.slug} product={r} locale={locale} t={t} />)}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
