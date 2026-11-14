import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { href, pageMetadata, siteUrl } from "@/lib/site";
import { academyUi, fmt } from "@/academy/ui";
import { listCourses, getCourse, courseStats, findLesson, previewTarget, INTRO_SLUG } from "@/academy/repository";
import { Container } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { CourseVisual } from "@/components/academy/CourseCover";
import { PriceLabel } from "@/components/academy/CourseCard";

type P = { params: Promise<{ locale: string; course: string }> };

export const dynamicParams = false;
export async function generateStaticParams() {
  const courses = await listCourses();
  return locales.flatMap((locale) => courses.map((c) => ({ locale, course: c.slug })));
}

async function load(params: P["params"]) {
  const { locale, course: slug } = await params;
  if (!isLocale(locale)) notFound();
  const course = await getCourse(slug);
  if (!course) notFound();
  return { locale, course, ui: academyUi(locale) };
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, course } = await load(params);
  return pageMetadata({ locale, path: `/academia/${course.slug}`, title: course.title[locale], description: course.short[locale] });
}

export default async function CoursePage({ params }: P) {
  const { locale, course, ui } = await load(params);
  const s = courseStats(course);
  const base = href(locale, `/academia/${course.slug}`);
  const preview = `${base}/aprender/${previewTarget(course)}`;
  const sample = course.sampleLesson ? findLesson(course, course.sampleLesson) : undefined;
  const faqs = [...course.faq.map((f) => ({ q: f.q[locale], a: f.a[locale] })), ...ui.faqGeneral];
  const t = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title[locale],
    description: course.description[locale],
    inLanguage: "es",
    url: `${siteUrl}${base}`,
    provider: { "@type": "Organization", name: "Academia NexusIA Digital", url: siteUrl },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-noir grain relative overflow-hidden text-white">
        <Container className="relative grid gap-10 py-10 sm:gap-12 sm:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Link href={href(locale, "/academia")} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/55 hover:text-gold-200">
              <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" /> {ui.course.backToCatalog}
            </Link>
            <p className="eyebrow intro-1 mt-6 text-gold-300 sm:mt-8">{ui.areas[course.area]} · {ui.levels[course.level]}</p>
            <h1 className="display intro-2 mt-4 text-[2.2rem] leading-[1.05] sm:text-6xl">{course.title[locale]}</h1>
            <p className="intro-3 mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:mt-6 sm:text-lg">{course.description[locale]}</p>
            <ul className="intro-4 mt-8 flex flex-wrap gap-2 text-xs text-white/75">
              <li className="rounded-full border border-white/15 px-4 py-2">{fmt(ui.card.modules, { n: s.modules })}</li>
              <li className="rounded-full border border-white/15 px-4 py-2">{fmt(ui.card.lessons, { n: s.lessons })}</li>
              <li className="rounded-full border border-white/15 px-4 py-2">{ui.course.language}: {ui.course.languageValue}</li>
            </ul>
          </div>
          <aside className="intro-3 lg:col-span-5">
            <div className="overflow-hidden rounded-[1.75rem] bg-white text-ink shadow-[var(--shadow-gold)]">
              <CourseVisual course={course} label={ui.card.independent} id={`detail-${course.slug}`} number={course.order} className="aspect-[16/10] w-full" />
              <div className="space-y-5 p-6 sm:p-8">
                <div>
                  <p className="eyebrow text-[0.6rem] text-gold-600">{ui.course.price}</p>
                  <div className="mt-2"><PriceLabel course={course} locale={locale} ui={ui} size="lg" /></div>
                  {course.priceIsExample ? <p className="mt-2 text-xs text-graphite">{ui.course.exampleNote}</p> : null}
                </div>
                <div className="grid gap-3">
                  <Link href={href(locale, `/academia/checkout/${course.slug}`)} className="btn btn-gold w-full">{ui.course.buy}</Link>
                  <Link href={preview} className="btn btn-outline w-full"><Icon name="play" className="h-4 w-4" /> {ui.course.preview}</Link>
                </div>
                <div>
                  <p className="eyebrow text-[0.6rem] text-gold-600">{ui.course.includes}</p>
                  <ul className="mt-3 space-y-2 text-sm text-graphite">
                    {ui.course.includesList.map((x) => <li key={x} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 text-gold-600" />{x}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </Container>
      </section>

      <section className="py-12 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-12 sm:space-y-16 lg:col-span-8">
            <div>
              <h2 className="display text-4xl">{ui.course.goals}</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {course.goals[locale].map((g) => (
                  <li key={g} className="flex gap-3 rounded-2xl border border-mist p-4 text-sm leading-relaxed"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />{g}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="display text-4xl">{ui.course.curriculum}</h2>
                <p className="text-sm text-graphite">{fmt(ui.course.curriculumText, { m: s.modules, l: s.lessons })}</p>
              </div>
              <div className="mt-6 divide-y divide-mist overflow-hidden rounded-3xl border border-mist">
                <Link href={`${base}/aprender/${INTRO_SLUG}`} className="flex items-center justify-between gap-4 bg-pearl px-6 py-4 text-sm transition hover:bg-gold-50">
                  <span className="flex items-center gap-3"><Icon name="play" className="h-4 w-4 text-gold-600" /> {ui.learn.intro}</span>
                  <span className="rounded-full bg-ink px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-gold-200">{ui.course.statusPreview}</span>
                </Link>
                {course.modules.map((m, mi) => (
                  <details key={m.slug} className="group" open={mi === 0}>
                    <summary className="flex items-center justify-between gap-4 px-6 py-5">
                      <span className="flex items-baseline gap-4">
                        <span className="display text-gold text-2xl">{String(mi + 1).padStart(2, "0")}</span>
                        <span className="font-semibold">{m.title[locale]}</span>
                      </span>
                      <span className="flex items-center gap-3 text-xs text-graphite">{fmt(ui.card.lessons, { n: m.lessons.length })}<Icon name="plus" className="faq-icon h-4 w-4 transition" /></span>
                    </summary>
                    <ul className="space-y-1 px-6 pb-5">
                      {m.lessons.map((l) => {
                        const free = l.access === "preview" && l.status === "ready";
                        return (
                          <li key={l.slug}>
                            <Link href={`${base}/aprender/${l.slug}`} className="flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-sm transition hover:bg-pearl">
                              <span className="flex items-center gap-3">
                                <Icon name={free ? "play" : "lock"} className={`h-4 w-4 shrink-0 ${free ? "text-gold-600" : "text-smoke"}`} />
                                {l.title[locale]}
                              </span>
                              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] ${free ? "bg-ink text-gold-200" : "bg-pearl text-graphite"}`}>
                                {free ? ui.course.statusPreview : l.status === "soon" ? ui.course.statusSoon : ui.learn.locked}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                ))}
              </div>
            </div>

            {sample?.lesson.body ? (
              <div className="bg-noir grain relative overflow-hidden rounded-[2rem] p-8 text-white sm:p-12">
                <p className="eyebrow text-gold-300">{ui.course.sample}</p>
                <h2 className="display mt-4 text-3xl sm:text-4xl">{sample.lesson.title[locale]}</h2>
                <p className="mt-5 leading-relaxed text-white/70">{sample.lesson.body.intro}</p>
                <ul className="mt-6 space-y-2 text-sm text-white/75">
                  {sample.lesson.body.objectives.map((o) => <li key={o} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />{o}</li>)}
                </ul>
                {locale !== sample.lesson.body.lang ? <p className="mt-6 text-xs text-white/45">{ui.learn.langNote}</p> : null}
                <Link href={`${base}/aprender/${sample.lesson.slug}`} className="btn btn-gold mt-8">{ui.course.sampleCta} <Icon name="arrow" className="h-4 w-4" /></Link>
              </div>
            ) : null}

            <div>
              <h2 className="display text-4xl">{ui.course.faq}</h2>
              <div className="mt-6 divide-y divide-mist rounded-3xl border border-mist">
                {faqs.map((f) => (
                  <details key={f.q} className="px-6 py-5">
                    <summary className="flex items-center justify-between gap-4 font-semibold">{f.q}<Icon name="plus" className="faq-icon h-4 w-4 shrink-0 transition" /></summary>
                    <p className="mt-3 text-sm leading-relaxed text-graphite">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-8 lg:col-span-4">
            <div className="rounded-3xl border border-mist p-7">
              <h2 className="eyebrow text-gold-600">{ui.course.audience}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-graphite">{course.audience[locale].map((a) => <li key={a}>{a}</li>)}</ul>
            </div>
            <div className="rounded-3xl border border-mist p-7">
              <h2 className="eyebrow text-gold-600">{ui.course.requirements}</h2>
              <ul className="mt-4 list-disc space-y-3 pl-4 text-sm leading-relaxed text-graphite marker:text-gold-600">{course.requirements[locale].map((a) => <li key={a}>{a}</li>)}</ul>
            </div>
            <div className="rounded-3xl bg-pearl p-7 text-sm">
              <p className="font-semibold">{t.newsletter.title}</p>
              <p className="mt-2 text-graphite">{t.newsletter.text}</p>
              <Link href={`${href(locale)}#newsletter`} className="btn btn-dark mt-5 w-full">{ui.checkout.notify}</Link>
            </div>
            <p className="text-xs leading-relaxed text-graphite">{ui.course.disclaimer}</p>
          </aside>
        </Container>
      </section>
    </>
  );
}
