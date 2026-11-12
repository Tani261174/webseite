import type { Metadata } from "next";
import { products, toPublic, type ProductCategory } from "@/content/products";
import { brands } from "@/content/brands";
import { resolveLocale } from "@/lib/i18n/page";
import { pageMetadata } from "@/lib/site";
import { Container, PageHero, Notice } from "@/components/ui/Section";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopBrowser, type ShopItem } from "@/components/shop/ShopBrowser";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/shop", title: t.shop.title, description: t.shop.description });
}

export default async function ShopPage({ params }: P) {
  const { locale, t } = await resolveLocale(params);
  const list = products.map(toPublic);

  const items: ShopItem[] = list.map((p, i) => ({
    slug: p.slug,
    category: p.category,
    brand: p.brand,
    status: p.status,
    price: p.priceCents ?? Number.MAX_SAFE_INTEGER,
    title: p.title[locale],
    text: [p.title[locale], p.short[locale], ...p.tags, t.shop.categoryLabels[p.category], brands.find((b) => b.slug === p.brand)?.name ?? ""].join(" ").toLowerCase(),
    order: (p.featured ? 0 : 100) + i,
  }));
  const cards = Object.fromEntries(list.map((p) => [p.slug, <ProductCard key={p.slug} product={p} locale={locale} t={t} />]));
  const usedCats = [...new Set(list.map((p) => p.category))] as ProductCategory[];

  return (
    <>
      <PageHero eyebrow={t.shop.eyebrow} title={t.shop.title} text={t.shop.intro} />
      <section className="bg-pearl py-12 sm:py-16">
        <Container>
          <ShopBrowser
            items={items}
            cards={cards}
            labels={t.shop}
            categories={usedCats.map((c) => ({ value: c, label: t.shop.categoryLabels[c] }))}
            brands={brands.map((b) => ({ value: b.slug, label: b.name }))}
            statuses={(["available", "coming-soon", "free"] as const).map((s) => ({ value: s, label: t.shop.statusLabels[s] }))}
          />
          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            <Notice>{t.common.demoNotice}</Notice>
            <Notice>{t.shop.vatNotice}</Notice>
          </div>
        </Container>
      </section>
    </>
  );
}
