import Link from "next/link";
import type { Metadata } from "next";
import { alternates, resolveLocale, siteUrl } from "@/lib/server/page";
import { getSettings, listProducts, listReviews, toCatalogItem } from "@/lib/server/repo";
import { ChristmasTeaser, Cooks, Hero, Reviews, SectionHeading, Steps, Welcome, WhatsAppBand } from "@/components/home/Sections";
import { ProductCard } from "@/components/shop/ProductCard";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return { alternates: alternates(locale, "/") };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const settings = getSettings();
  const products = listProducts().filter((p) => p.featured);
  const reviews = listReviews(true);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Sabor Venezolano",
    slogan: "Un pedacito de Venezuela en tu mesa.",
    servesCuisine: "Venezolana",
    url: `${siteUrl()}/${locale}`,
    telephone: `+${settings.shop.whatsappNumber}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero locale={locale} t={t} settings={settings} />
      <Welcome locale={locale} t={t} settings={settings} />
      <Cooks locale={locale} t={t} settings={settings} />

      <section id="especialidades" className="bg-cream-deep/50 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={t.home.specialtiesEyebrow} title={t.home.specialtiesTitle} text={t.home.specialtiesText} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} item={toCatalogItem(p)} locale={locale} t={t} priority={i < 2} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href={`/${locale}/productos`} className="btn btn-outline">
              {t.home.seeAll} <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {settings.christmas.enabled ? <ChristmasTeaser locale={locale} t={t} settings={settings} /> : null}
      <Steps t={t} />
      <Reviews t={t} reviews={reviews} />
      <div className="pt-20 sm:pt-24" />
      <WhatsAppBand t={t} settings={settings} />
    </>
  );
}
