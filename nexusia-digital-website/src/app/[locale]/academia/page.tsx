import type { Metadata } from "next";
import Link from "next/link";
import { resolveLocale } from "@/lib/i18n/page";
import { href, pageMetadata, siteUrl } from "@/lib/site";
import { academyUi } from "@/academy/ui";
import { listCourses, previewTarget } from "@/academy/repository";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { CourseCard } from "@/components/academy/CourseCard";
import { CourseVisual } from "@/components/academy/CourseCover";

type P = { params: Promise<{ locale: string }> };

const SLOGAN = ["Aprende.", "Emprende.", "Crece."] as const;

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const ui = academyUi(locale);
  return pageMetadata({ locale, path: "/academia", title: ui.home.metaTitle, description: ui.home.metaDescription });
}

export default async function AcademyHome({ params }: P) {
  const { locale } = await resolveLocale(params);
  const ui = academyUi(locale);
  const courses = await listCourses();
  const featured = courses[0];
  const base = href(locale, "/academia");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: ui.name,
    itemListElement: courses.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: `${siteUrl}${base}/${c.slug}`, name: c.title[locale] })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* HERO */}
      <section className="bg-noir grain relative overflow-hidden text-white">
        <div className="pointer-events-none absolute -right-48 -top-48 h-[36rem] w-[36rem] rounded-full border border-gold-400/15" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full border border-gold-400/10" aria-hidden="true" />
        <Container className="relative grid items-center gap-10 py-12 sm:gap-14 sm:py-28 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow intro-1 flex items-center gap-3 text-gold-300"><span className="gold-hairline inline-block w-8" aria-hidden="true" />{ui.home.eyebrow}</p>
            {/* Markenslogan – bewusst in allen Sprachen auf Spanisch */}
            <h1 lang="es" className="display intro-2 mt-5 text-[3rem] leading-[1] sm:mt-6 sm:text-7xl lg:text-[5.6rem]">
              {SLOGAN[0]} {SLOGAN[1]}<br /><span className="text-gold-shine italic">{SLOGAN[2]}</span>
            </h1>
            <p className="intro-3 mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:mt-7 sm:text-lg">{ui.home.subtitle}</p>
            <div className="intro-4 mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
              <Link href="#cursos" className="btn btn-gold">{ui.home.primary} <Icon name="arrow" className="h-4 w-4" /></Link>
              {featured ? <Link href={`${base}/${featured.slug}/aprender/${previewTarget(featured)}`} className="btn btn-ghost-light"><Icon name="play" className="h-4 w-4" /> {ui.home.secondary}</Link> : null}
            </div>
            <dl className="intro-4 mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:mt-14 sm:gap-6 sm:pt-8">
              {ui.home.facts.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="display text-gold text-3xl sm:text-5xl">{f.value}</dd>
                  <dd className="mt-1 text-xs leading-snug text-white/50">{f.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          {featured ? (
            <div className="intro-3 lg:col-span-5">
              <Link href={`${base}/${featured.slug}`} className="gold-frame group block overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-gold)]">
                <CourseVisual course={featured} label={ui.card.independent} id="hero" number={featured.order} className="aspect-[16/11] w-full transition duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-[1.03]" />
                <div className="bg-ink-soft px-6 py-5">
                  <p className="eyebrow text-[0.6rem] text-gold-300">{ui.card.previewTag}</p>
                  <p className="display mt-2 text-2xl leading-tight text-white">{featured.title[locale]}</p>
                </div>
              </Link>
            </div>
          ) : null}
        </Container>
      </section>

      {/* KATALOG */}
      <section id="cursos" className="scroll-mt-28 py-14 sm:py-28">
        <Container>
          <SectionHeading eyebrow={ui.home.catalogEyebrow} title={ui.home.catalogTitle} text={ui.home.catalogText} />
          <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {courses.map((c) => <CourseCard key={c.slug} course={c} locale={locale} ui={ui} />)}
          </div>
        </Container>
      </section>

      {/* SO FUNKTIONIERT'S */}
      <section className="bg-pearl py-14 sm:py-28">
        <Container>
          <SectionHeading eyebrow={ui.home.howEyebrow} title={ui.home.howTitle} align="center" />
          <ol className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-3">
            {ui.home.how.map((s, i) => (
              <li key={s.title} className="reveal rounded-3xl border border-mist bg-white p-6 sm:p-8">
                <span className="display text-gold text-5xl">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* TUTOR + EHRLICHKEIT */}
      <section className="py-14 sm:py-28">
        <Container className="grid gap-5 sm:gap-8 lg:grid-cols-2">
          <div className="bg-noir grain reveal relative overflow-hidden rounded-[2rem] p-8 text-white sm:p-12">
            <p className="eyebrow text-gold-300">{ui.home.tutorEyebrow}</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">{ui.home.tutorTitle}</h2>
            <p className="mt-5 leading-relaxed text-white/65">{ui.home.tutorText}</p>
            <Link href={`${base}/tutor`} className="btn btn-gold mt-8"><Icon name="sparkle" className="h-4 w-4" /> {ui.home.tutorCta}</Link>
          </div>
          <div className="reveal rounded-[2rem] border border-mist p-8 sm:p-12">
            <p className="eyebrow text-gold-600">{ui.home.honestyEyebrow}</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">{ui.home.honestyTitle}</h2>
            <ul className="mt-6 space-y-4">
              {ui.home.honesty.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-graphite"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />{h}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-pearl py-14 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" title={ui.course.faq} align="center" />
          <div className="mt-10 divide-y divide-mist rounded-3xl border border-mist bg-white">
            {ui.faqGeneral.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex items-center justify-between gap-4 font-semibold">{f.q}<Icon name="plus" className="faq-icon h-4 w-4 shrink-0 transition" /></summary>
                <p className="mt-3 text-sm leading-relaxed text-graphite">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-xs leading-relaxed text-graphite">{ui.course.disclaimer}</p>
        </Container>
      </section>
    </>
  );
}
