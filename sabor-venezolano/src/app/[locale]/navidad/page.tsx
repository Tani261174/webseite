import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pick } from "@/lib/i18n/config";
import { alternates, resolveLocale } from "@/lib/server/page";
import { getSettings, listProducts, toCatalogItem } from "@/lib/server/repo";
import { waLink } from "@/lib/whatsapp";
import { PineSprig, Sparkles } from "@/components/brand/Brand";
import { ChristmasDates, SectionHeading } from "@/components/home/Sections";
import { ProductCard } from "@/components/shop/ProductCard";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { title: t.christmas.title.replace("🎄 ", ""), alternates: alternates(locale, "/navidad") };
}

export default async function ChristmasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const settings = getSettings();
  if (!settings.christmas.enabled) notFound();
  const products = listProducts().filter((p) => p.christmas);
  const waText = locale === "de" ? "Hallo! Ich interessiere mich für euer Weihnachtsmenü." : "¡Hola! Me interesa su menú navideño.";

  return (
    <>
      <section className="relative bg-rose/50 overflow-hidden px-4 pb-20 pt-14 text-center text-ink sm:px-6">
        <PineSprig className="pointer-events-none absolute -left-8 top-4 w-60 text-ink/15 sm:w-80" />
        <PineSprig className="pointer-events-none absolute -right-8 bottom-2 w-60 rotate-180 text-ink/15 sm:w-80" />
        <div className="relative mx-auto max-w-3xl">
          <Sparkles className="mx-auto w-36 text-ink-muted" />
          <p className="eyebrow mt-5 text-ink-muted">{t.christmas.eyebrow}</p>
          <h1 className="mt-3 font-display text-[2.3rem] leading-tight sm:text-5xl">{t.christmas.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{pick(settings.christmas.text, locale)}</p>
          <div className="flex justify-center">
            <ChristmasDates locale={locale} t={t} settings={settings} />
          </div>
          <p className="mx-auto mt-6 max-w-xl text-sm text-ink-soft">{t.cart.preorderNote}</p>
          <a
            href={waLink(settings.shop.whatsappNumber, waText)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-8"
          >
            <Icon name="whatsapp" className="h-5 w-5" /> {t.christmas.order}
          </a>
        </div>
      </section>

      <section className="bg-soft px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={t.christmas.eyebrow} title={t.christmas.menuTitle} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} item={toCatalogItem(p)} locale={locale} t={t} priority={i < 2} />
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-xl text-center text-sm font-semibold text-ink">{t.cart.confirmNote}</p>
        </div>
      </section>
    </>
  );
}
