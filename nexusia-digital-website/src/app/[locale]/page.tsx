import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/site";
import { brands, getBrand } from "@/content/brands";
import { products, toPublic } from "@/content/products";
import { Container, SectionHeading, DemoBadge } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/ui/Icon";
import { HeroEmblem } from "@/components/home/HeroEmblem";
import { ProductCard } from "@/components/shop/ProductCard";
import { BrandCard } from "@/components/brand/BrandCard";
import { Artwork } from "@/components/art/Artwork";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ContactForm } from "@/components/forms/ContactForm";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  if (!isLocale(l)) notFound();
  const locale: Locale = l;
  const t = getDictionary(locale);

  const featured = products.filter((p) => p.featured && p.category !== "courses").slice(0, 6).map(toPublic);
  const courses = products.filter((p) => p.category === "courses").slice(0, 3);
  const ai = getBrand("nexuscreator-ai")!;

  const categories: { key: keyof typeof t.categories.items; icon: IconName; query: string }[] = [
    { key: "graphics", icon: "sparkle", query: "svg" },
    { key: "templates", icon: "menu", query: "templates" },
    { key: "ebooks", icon: "download", query: "ebooks" },
    { key: "courses", icon: "play", query: "courses" },
    { key: "ai", icon: "bolt", query: "ai" },
    { key: "bundles", icon: "plus", query: "bundles" },
  ];
  const benefitIcons: IconName[] = ["download", "shield", "languages", "check"];

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="bg-noir grain relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden="true"
          style={{ backgroundImage: "linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)", backgroundSize: "72px 72px", maskImage: "radial-gradient(ellipse at 60% 40%, #000 20%, transparent 70%)" }} />
        <Container className="relative grid items-center gap-14 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:grid-cols-12 lg:gap-8 lg:pb-32">
          <div className="lg:col-span-7">
            <p className="eyebrow intro-1 flex items-center gap-3 text-gold-300">
              <span className="gold-hairline inline-block w-10" aria-hidden="true" />
              {t.hero.eyebrow}
            </p>
            <h1 className="display intro-2 mt-7 text-[3.1rem] leading-[0.98] sm:text-7xl xl:text-[5.6rem]">
              <span className="block">{t.hero.titleA}</span>
              <span className="text-gold-shine block italic">{t.hero.titleB}</span>
              <span className="block">{t.hero.titleC}</span>
            </h1>
            <p className="intro-3 mt-8 max-w-xl text-lg leading-relaxed text-white/65">{t.hero.subtitle}</p>
            <div className="intro-4 mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href={href(locale, "/shop")} className="btn btn-gold">
                {t.hero.primary} <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href={href(locale, "/brands")} className="btn btn-ghost-light">{t.hero.secondary}</Link>
            </div>
            <dl className="intro-4 mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {t.hero.stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="display text-gold text-4xl">{s.value}</dd>
                  <dd className="mt-1 text-xs leading-snug text-white/50">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="intro-3 lg:col-span-5">
            <HeroEmblem />
          </div>
        </Container>
        <div className="gold-hairline" aria-hidden="true" />
      </section>

      {/* ───────────── INTRO ───────────── */}
      <section className="py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow={t.intro.eyebrow} title={t.intro.title} />
          </div>
          <div className="lg:col-span-6 lg:pt-12">
            <p className="reveal text-lg leading-relaxed text-graphite">{t.intro.text}</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {t.intro.pillars.map((p, i) => (
                <div key={p.title} className="reveal border-t border-ink pt-5">
                  <span className="display text-gold text-3xl">0{i + 1}</span>
                  <h3 className="mt-2 font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ───────────── KATEGORIEN ───────────── */}
      <section className="bg-pearl py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow={t.categories.eyebrow} title={t.categories.title} />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link key={c.key} href={`${href(locale, "/shop")}?category=${c.query}`} className="card-lux reveal group flex items-start gap-5 p-7">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-gold-300 transition duration-500 group-hover:bg-gold group-hover:text-ink">
                  <Icon name={c.icon} />
                </span>
                <span>
                  <span className="display block text-2xl">{t.categories.items[c.key].title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-graphite">{t.categories.items[c.key].text}</span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────── PRODUKTE ───────────── */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow={t.featured.eyebrow} title={t.featured.title} text={t.featured.subtitle} />
            <Link href={href(locale, "/shop")} className="btn btn-outline shrink-0">{t.featured.viewAll}</Link>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <ProductCard key={p.slug} product={p} locale={locale} t={t} />)}
          </div>
        </Container>
      </section>

      {/* ───────────── KI ───────────── */}
      <section className="bg-noir grain relative overflow-hidden py-24 text-white sm:py-32">
        <Container className="relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading tone="dark" eyebrow={t.aiSection.eyebrow} title={t.aiSection.title} text={t.aiSection.text} />
            <ul className="reveal mt-10 grid gap-3 sm:grid-cols-2">
              {ai.features[locale].map((f) => (
                <li key={f} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80">
                  <Icon name="sparkle" className="h-4 w-4 shrink-0 text-gold-300" /> {f}
                </li>
              ))}
            </ul>
            <p className="reveal mt-6 flex items-center gap-2 text-xs text-white/45">
              <Icon name="lock" className="h-4 w-4" /> {t.aiSection.honest}
            </p>
            <Link href={href(locale, "/brands/nexuscreator-ai")} className="btn btn-gold reveal mt-10">
              {t.aiSection.cta} <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className="gold-frame reveal relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
            <Artwork variant="orbit" id="home-ai" className="h-full w-full" />
            <span className="absolute bottom-5 left-5 rounded-full border border-gold-300/40 bg-black/60 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-gold-200 backdrop-blur">
              {t.common.comingSoon}
            </span>
          </div>
        </Container>
      </section>

      {/* ───────────── KURSE ───────────── */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow={t.coursesSection.eyebrow} title={t.coursesSection.title} text={t.coursesSection.text} />
            <Link href={href(locale, "/courses")} className="btn btn-outline shrink-0">{t.coursesSection.cta}</Link>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {courses.map((c) => (
              <Link key={c.slug} href={href(locale, `/shop/${c.slug}`)} className="card-lux reveal group overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Artwork variant={c.art} id={`hc-${c.slug}`} className="h-full w-full transition duration-[1.4s] group-hover:scale-105" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full border border-gold-300/60 bg-black/50 text-gold-200 backdrop-blur transition group-hover:scale-110">
                      <Icon name="play" className="h-5 w-5" />
                    </span>
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow text-[0.62rem] text-gold-600">{c.level ? t.coursesPage.levels[c.level] : ""}</p>
                    <DemoBadge label={t.common.demo} />
                  </div>
                  <h3 className="display mt-3 text-2xl">{c.title[locale]}</h3>
                  <p className="mt-2 text-sm text-graphite">{c.short[locale]}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────── MARKEN ───────────── */}
      <section className="bg-pearl py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow={t.brandsSection.eyebrow} title={t.brandsSection.title} text={t.brandsSection.text} align="center" />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {brands.map((b, i) => (
              <BrandCard key={b.slug} brand={b} locale={locale} cta={t.brandsSection.discover} soonLabel={t.common.comingSoon} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────── VORTEILE ───────────── */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow={t.benefits.eyebrow} title={t.benefits.title} align="center" />
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.benefits.items.map((b, i) => (
              <div key={b.title} className="reveal text-center">
                <span className="gold-frame mx-auto grid h-16 w-16 place-items-center rounded-full text-gold-600">
                  <Icon name={benefitIcons[i]} className="h-6 w-6" />
                </span>
                <h3 className="display mt-6 text-2xl">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{b.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────── NEWSLETTER ───────────── */}
      <section id="newsletter" className="scroll-mt-24 px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="bg-noir grain gold-frame relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-16 text-white sm:px-14 sm:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-gold-400/20" aria-hidden="true" />
          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
            <SectionHeading tone="dark" eyebrow={t.newsletter.eyebrow} title={t.newsletter.title} text={t.newsletter.text} />
            <div className="reveal">
              <NewsletterForm locale={locale} labels={t.newsletter} messages={t.forms} privacyHref={href(locale, "/legal/privacy")} />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── KONTAKT ───────────── */}
      <section id="contact" className="bg-pearl py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} text={t.contact.text} />
          </div>
          <div className="reveal rounded-[1.5rem] border border-mist bg-white p-6 shadow-[var(--shadow-lux)] sm:p-10 lg:col-span-7">
            <ContactForm locale={locale} labels={t.contact} messages={t.forms} requiredLabel={t.common.required} />
          </div>
        </Container>
      </section>
    </>
  );
}
