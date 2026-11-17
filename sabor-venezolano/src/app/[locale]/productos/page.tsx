import type { Metadata } from "next";
import { alternates, resolveLocale } from "@/lib/server/page";
import { listProducts, toCatalogItem } from "@/lib/server/repo";
import { SectionHeading } from "@/components/home/Sections";
import { ProductCard } from "@/components/shop/ProductCard";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { title: t.product.pageTitle, description: t.product.pageIntro, alternates: alternates(locale, "/productos") };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const products = listProducts();

  return (
    <div className="bg-linen px-4 pb-24 pt-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Sabor Venezolano" title={t.product.pageTitle} text={t.product.pageIntro} />
        <p className="mx-auto mt-6 flex max-w-xl items-start justify-center gap-2 text-center text-sm text-wine">
          <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0" />
          {t.cart.preorderNote}
        </p>
        {products.length === 0 ? (
          <p className="mt-16 text-center text-cocoa-muted">{t.product.empty}</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} item={toCatalogItem(p)} locale={locale} t={t} priority={i < 2} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
