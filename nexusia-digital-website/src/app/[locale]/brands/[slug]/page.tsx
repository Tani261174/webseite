import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brands, getBrand } from "@/content/brands";
import { products, toPublic } from "@/content/products";
import { locales } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/page";
import { href, pageMetadata } from "@/lib/site";
import { Container, SectionHeading, Notice } from "@/components/ui/Section";
import { Artwork } from "@/components/art/Artwork";
import { Icon } from "@/components/ui/Icon";
import { RoseMark } from "@/components/brand/Logo";
import { ProductCard } from "@/components/shop/ProductCard";

type P = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => brands.map((b) => ({ locale, slug: b.slug })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  const brand = getBrand((await params).slug);
  if (!brand) return {};
  return pageMetadata({ locale, path: `/brands/${brand.slug}`, title: `${brand.name} – ${brand.tagline[locale]}`, description: brand.summary[locale] ?? t.brandsPage.description });
}

export default async function BrandPage({ params }: P) {
  const { locale, t } = await resolveLocale(params);
  const brand = getBrand((await params).slug);
  if (!brand) notFound();
  const items = products.filter((p) => p.brand === brand.slug).map(toPublic);
  const others = brands.filter((b) => b.slug !== brand.slug);
  const soon = brand.status === "coming-soon";

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <Artwork variant={brand.art} id={`bh-${brand.slug}`} className="absolute inset-0 h-full w-full opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" aria-hidden="true" />
        <Container className="relative py-24 sm:py-36">
          <Link href={href(locale, "/brands")} className="intro-1 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 transition hover:text-gold-200">
            <Icon name="arrow" className="h-4 w-4 rotate-180" /> {t.common.backTo} {t.nav.brands}
          </Link>
          <div className="intro-2 mt-8 flex items-center gap-3">
            {brand.slug === "neuesichmittani" ? <RoseMark className="h-8 w-8 text-gold-300" /> : null}
            {soon ? <span className="rounded-full border border-gold-300/50 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-gold-200">{t.common.comingSoon}</span> : null}
          </div>
          <h1 className="display intro-2 mt-5 text-6xl sm:text-8xl">{brand.name}</h1>
          <p className="intro-3 text-gold-shine display mt-4 text-3xl italic sm:text-4xl">{brand.tagline[locale]}</p>
          <p className="intro-4 mt-8 max-w-2xl text-lg leading-relaxed text-white/70">{brand.description[locale]}</p>
          <div className="intro-4 mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href={`${href(locale, "/shop")}?brand=${brand.slug}`} className="btn btn-gold">{t.brandsPage.visitShop} <Icon name="arrow" className="h-4 w-4" /></Link>
            <Link href={`${href(locale)}#newsletter`} className="btn btn-ghost-light"><Icon name="mail" className="h-4 w-4" /> {t.shop.notifyMe}</Link>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={brand.name} title={t.brandsPage.features} />
          </div>
          <div className="lg:col-span-8">
            <ul className="grid gap-4 sm:grid-cols-2">
              {brand.features[locale].map((f, i) => (
                <li key={f} className="card-lux reveal flex items-center gap-4 p-6">
                  <span className="display text-gold text-3xl">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium">{f}</span>
                  {soon ? <span className="ml-auto text-[0.6rem] font-bold uppercase tracking-[0.16em] text-smoke">{t.common.comingSoon}</span> : null}
                </li>
              ))}
            </ul>
            {brand.disclaimer ? <div className="mt-8"><Notice>{brand.disclaimer[locale]}</Notice></div> : null}
            {brand.slug === "nexuscreator-ai" ? <div className="mt-8"><Notice>{t.aiSection.honest}</Notice></div> : null}
          </div>
        </Container>
      </section>

      <section className="bg-pearl py-20 sm:py-28">
        <Container>
          <SectionHeading title={t.brandsPage.products} />
          {items.length ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => <ProductCard key={p.slug} product={p} locale={locale} t={t} />)}
            </div>
          ) : (
            <p className="mt-8 text-graphite">{t.brandsPage.noProducts}</p>
          )}
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <h2 className="eyebrow text-gold-600">{t.brandsPage.otherBrands}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((b) => (
              <Link key={b.slug} href={href(locale, `/brands/${b.slug}`)} className="card-lux group flex items-center justify-between p-6">
                <span>
                  <span className="display block text-2xl">{b.name}</span>
                  <span className="text-sm text-graphite">{b.tagline[locale]}</span>
                </span>
                <Icon name="arrow" className="h-5 w-5 shrink-0 text-gold-600 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
