import type { Metadata } from "next";
import { brands } from "@/content/brands";
import { resolveLocale } from "@/lib/i18n/page";
import { pageMetadata } from "@/lib/site";
import { Container, PageHero } from "@/components/ui/Section";
import { BrandCard } from "@/components/brand/BrandCard";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/brands", title: t.brandsPage.title, description: t.brandsPage.description });
}

export default async function BrandsPage({ params }: P) {
  const { locale, t } = await resolveLocale(params);
  return (
    <>
      <PageHero eyebrow={t.brandsPage.eyebrow} title={t.brandsPage.title} text={t.brandsPage.intro} />
      <section className="bg-pearl py-20 sm:py-28">
        <Container className="grid gap-6 md:grid-cols-2">
          {brands.map((b, i) => (
            <BrandCard key={b.slug} brand={b} locale={locale} cta={t.brandsSection.discover} soonLabel={t.common.comingSoon} index={i} />
          ))}
        </Container>
      </section>
    </>
  );
}
