import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/content/products";
import { resolveLocale } from "@/lib/i18n/page";
import { href, pageMetadata } from "@/lib/site";
import { Container, PageHero, SectionHeading, DemoBadge, Notice } from "@/components/ui/Section";
import { Artwork } from "@/components/art/Artwork";
import { Icon } from "@/components/ui/Icon";
import { PriceTag, StatusPill } from "@/components/shop/ProductCard";
import { ProductAction } from "@/components/shop/ProductAction";
import { toPublic } from "@/content/products";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/courses", title: t.coursesPage.title, description: t.coursesPage.description });
}

const areas = {
  de: ["Website-Erstellung", "KI-Tools & kreative Automatisierung", "Digitales Business", "Amazon KDP & Self-Publishing", "Kreatives Design", "Resin-Art", "Weitere Kurse folgen"],
  es: ["Creación de webs", "Herramientas IA y automatización creativa", "Negocio digital", "Amazon KDP y autopublicación", "Diseño creativo", "Arte en resina", "Más cursos próximamente"],
  en: ["Website creation", "AI tools & creative automation", "Digital business", "Amazon KDP & self-publishing", "Creative design", "Resin art", "More courses to come"],
};

export default async function CoursesPage({ params }: P) {
  const { locale, t } = await resolveLocale(params);
  const courses = products.filter((p) => p.category === "courses").map(toPublic);
  return (
    <>
      <PageHero eyebrow={t.coursesPage.eyebrow} title={t.coursesPage.title} text={t.coursesPage.intro}>
        <ul className="flex flex-wrap gap-2" aria-label={t.coursesPage.areas}>
          {areas[locale].map((a) => (
            <li key={a} className="rounded-full border border-white/15 px-4 py-2 text-xs tracking-wider text-white/75">{a}</li>
          ))}
        </ul>
        <Link href={href(locale, "/academia")} className="btn btn-gold mt-8">Academia NexusIA Digital <Icon name="arrow" className="h-4 w-4" /></Link>
      </PageHero>
      <section className="py-20 sm:py-28">
        <Container className="space-y-8">
          {courses.map((c, i) => (
            <article key={c.slug} className="card-lux reveal grid overflow-hidden md:grid-cols-5">
              <div className="relative aspect-[16/10] md:col-span-2 md:aspect-auto">
                <Artwork variant={c.art} id={`cp-${c.slug}`} className="absolute inset-0 h-full w-full" />
                <div className="absolute left-4 top-4"><StatusPill status={c.status} label={t.shop.statusLabels[c.status]} /></div>
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-200 backdrop-blur">
                  <Icon name="play" className="h-3.5 w-3.5" /> {t.coursesPage.previewSoon}
                </span>
              </div>
              <div className="flex flex-col p-7 sm:p-10 md:col-span-3">
                <div className="flex items-center gap-3">
                  <span className="display text-gold text-3xl">{String(i + 1).padStart(2, "0")}</span>
                  {c.level ? <span className="eyebrow text-[0.62rem] text-gold-600">{t.coursesPage.levels[c.level]}</span> : null}
                  {c.demo ? <DemoBadge label={t.common.demo} /> : null}
                </div>
                <h2 className="display mt-3 text-4xl">
                  <Link href={href(locale, `/shop/${c.slug}`)} className="hover:text-gold-600">{c.title[locale]}</Link>
                </h2>
                <p className="mt-3 leading-relaxed text-graphite">{c.description[locale]}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {c.includes[locale].map((x) => <li key={x} className="rounded-full bg-pearl px-3 py-1 text-xs">{x}</li>)}
                </ul>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
                  <PriceTag product={c} locale={locale} t={t} />
                  <ProductAction slug={c.slug} status={c.status} labels={t.shop} newsletterHref={`${href(locale)}#newsletter`} cartHref={href(locale, "/cart")} />
                </div>
              </div>
            </article>
          ))}
          <Notice>{t.common.demoNotice}</Notice>
        </Container>
      </section>
      <section className="bg-pearl py-20">
        <Container className="text-center">
          <SectionHeading align="center" eyebrow={t.newsletter.eyebrow} title={t.newsletter.title} text={t.newsletter.text} />
          <Link href={`${href(locale)}#newsletter`} className="btn btn-dark mt-8">{t.shop.notifyMe}</Link>
        </Container>
      </section>
    </>
  );
}
