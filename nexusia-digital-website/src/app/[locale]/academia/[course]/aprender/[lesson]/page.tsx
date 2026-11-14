import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { href, pageMetadata } from "@/lib/site";
import { academyUi, fmt, type AcademyUi } from "@/academy/ui";
import { listCourses, getCourse, findLesson, flatLessons, previewTarget, INTRO_SLUG } from "@/academy/repository";
import type { Course } from "@/academy/types";
import { Container } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { VideoPlayer } from "@/components/academy/VideoPlayer";
import { LessonBlocks } from "@/components/academy/LessonBlocks";
import { Quiz, MarkDone, DoneMark } from "@/components/academy/LessonInteractive";
import { TutorChat } from "@/components/academy/TutorChat";

type P = { params: Promise<{ locale: string; course: string; lesson: string }> };

/** Alle Lektionsseiten (inkl. gesperrter und kommender) werden vorab erzeugt – keine leeren Seiten, kein 404. */
export const dynamicParams = false;
export async function generateStaticParams() {
  const courses = await listCourses();
  return locales.flatMap((locale) =>
    courses.flatMap((c) => [INTRO_SLUG, ...flatLessons(c).map((x) => x.lesson.slug)].map((lesson) => ({ locale, course: c.slug, lesson }))),
  );
}

async function load(params: P["params"]) {
  const { locale, course: cs, lesson: ls } = await params;
  if (!isLocale(locale)) notFound();
  const course = await getCourse(cs);
  if (!course) notFound();
  const found = ls === INTRO_SLUG ? undefined : findLesson(course, ls);
  if (ls !== INTRO_SLUG && !found) notFound();
  return { locale, course, found, ui: academyUi(locale) };
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, course, found, ui } = await load(params);
  const title = found ? found.lesson.title[locale] : `${ui.learn.intro} · ${course.title[locale]}`;
  const indexable = !found || (found.lesson.access === "preview" && found.lesson.status === "ready");
  return pageMetadata({ locale, path: `/academia/${course.slug}/aprender/${found?.lesson.slug ?? INTRO_SLUG}`, title, description: course.short[locale], noindex: !indexable });
}

export default async function LessonPage({ params }: P) {
  const { locale, course, found, ui } = await load(params);
  const base = href(locale, `/academia/${course.slug}`);
  const current = found?.lesson.slug ?? INTRO_SLUG;
  const all = flatLessons(course);
  const next = found ? found.next : all[0];
  const prev = found ? found.prev : undefined;

  return (
    <div className="bg-paper">
      <div className="border-b border-mist bg-pearl">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs">
          <Link href={base} className="inline-flex items-center gap-2 font-medium text-graphite hover:text-ink">
            <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" /> {course.title[locale]}
          </Link>
          {found ? <span className="text-graphite">{fmt(ui.learn.of, { n: found.position, t: found.total })}</span> : null}
        </Container>
      </div>

      <Container className="grid gap-10 py-10 lg:grid-cols-12 lg:py-14">
        {/* Lehrplan */}
        <aside className="lg:col-span-4 xl:col-span-3">
          {/* Handy: eingeklappt */}
          <details className="group rounded-3xl border border-mist lg:hidden">
            <summary className="flex items-center justify-between px-5 py-4 font-semibold">
              {ui.learn.sidebar}
              <Icon name="chevron" className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <nav aria-label={ui.learn.sidebar} className="max-h-[70vh] overflow-y-auto border-t border-mist px-2 py-3">
              <SidebarLink href={`${base}/aprender/${INTRO_SLUG}`} active={current === INTRO_SLUG} title={ui.learn.intro} badge={ui.learn.free} free course={course.slug} lesson={INTRO_SLUG} />
              {course.modules.map((m, mi) => (
                <div key={m.slug} className="mt-3">
                  <p className="px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-gold-600">{String(mi + 1).padStart(2, "0")} · {m.title[locale]}</p>
                  {m.lessons.map((l) => {
                    const free = l.access === "preview" && l.status === "ready";
                    return <SidebarLink key={l.slug} href={`${base}/aprender/${l.slug}`} active={current === l.slug} title={l.title[locale]} badge={free ? ui.learn.free : l.status === "soon" ? ui.course.statusSoon : undefined} free={free} course={course.slug} lesson={l.slug} />;
                  })}
                </div>
              ))}
            </nav>
          </details>
          {/* Desktop: immer sichtbar */}
          <div className="hidden rounded-3xl border border-mist lg:sticky lg:top-24 lg:block">
            <p className="px-5 py-4 font-semibold">{ui.learn.sidebar}</p>
            <nav aria-label={ui.learn.sidebar} className="max-h-[70vh] overflow-y-auto border-t border-mist px-2 py-3">
              <SidebarLink href={`${base}/aprender/${INTRO_SLUG}`} active={current === INTRO_SLUG} title={ui.learn.intro} badge={ui.learn.free} free course={course.slug} lesson={INTRO_SLUG} />
              {course.modules.map((m, mi) => (
                <div key={m.slug} className="mt-3">
                  <p className="px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-gold-600">{String(mi + 1).padStart(2, "0")} · {m.title[locale]}</p>
                  {m.lessons.map((l) => {
                    const free = l.access === "preview" && l.status === "ready";
                    return <SidebarLink key={l.slug} href={`${base}/aprender/${l.slug}`} active={current === l.slug} title={l.title[locale]} badge={free ? ui.learn.free : l.status === "soon" ? ui.course.statusSoon : undefined} free={free} course={course.slug} lesson={l.slug} />;
                  })}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Inhalt */}
        <article className="min-w-0 lg:col-span-8 xl:col-span-9">
          {!found ? (
            <Intro course={course} locale={locale} ui={ui} base={base} />
          ) : found.lesson.status === "soon" ? (
            <Gate icon="sparkle" title={ui.learn.soonTitle} text={ui.learn.soonText} lessonTitle={found.lesson.title[locale]} module={found.module.title[locale]} cta={{ href: `${base}/aprender/${previewTarget(course)}`, label: ui.course.preview }} />
          ) : found.lesson.access === "paid" ? (
            <Gate icon="lock" title={ui.learn.locked} text={ui.learn.lockedText} lessonTitle={found.lesson.title[locale]} module={found.module.title[locale]} cta={{ href: href(locale, `/academia/checkout/${course.slug}`), label: ui.course.buy }} />
          ) : (
            <div className="space-y-10">
              <header>
                <p className="eyebrow text-gold-600">{found.module.title[locale]}{found.lesson.minutes ? ` · ${fmt(ui.learn.minutes, { n: found.lesson.minutes })}` : ""}</p>
                <h1 className="display mt-3 text-4xl leading-tight sm:text-5xl">{found.lesson.title[locale]}</h1>
                {found.lesson.body && found.lesson.body.lang !== locale ? <p className="mt-4 rounded-xl bg-gold-50 px-4 py-2 text-sm text-gold-700">{ui.learn.langNote}</p> : null}
              </header>
              <VideoPlayer video={found.lesson.video} title={found.lesson.title[locale]} soonLabel={ui.learn.videoSoon} />
              {found.lesson.body ? (
                <div lang={found.lesson.body.lang} className="space-y-10">
                  <p className="text-lg leading-relaxed text-graphite">{found.lesson.body.intro}</p>
                  <section className="rounded-3xl border border-mist p-6 sm:p-8">
                    <h2 className="eyebrow text-gold-600">{ui.learn.objectives}</h2>
                    <ul className="mt-4 space-y-2">{found.lesson.body.objectives.map((o) => <li key={o} className="flex gap-3"><Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-gold-600" />{o}</li>)}</ul>
                  </section>
                  <LessonBlocks blocks={found.lesson.body.blocks} labels={{ example: ui.learn.example, exercise: ui.learn.exercise }} />
                  {found.lesson.downloads?.length ? (
                    <section>
                      <h2 className="display text-3xl">{ui.learn.downloads}</h2>
                      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {found.lesson.downloads.filter((d) => d.public).map((d) => (
                          <li key={d.href}>
                            <a href={d.href} download className="flex items-center gap-4 rounded-2xl border border-mist p-4 transition hover:border-gold-300">
                              <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-gold-200"><Icon name="download" className="h-5 w-5" /></span>
                              <span><span className="block text-sm font-semibold">{d.label[locale]}</span><span className="text-xs text-graphite">{d.format}</span></span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {found.lesson.body.quiz?.length ? (
                    <Quiz course={course.slug} lesson={found.lesson.slug} questions={found.lesson.body.quiz} labels={ui.learn} />
                  ) : null}
                  <section className="rounded-3xl bg-pearl p-6 sm:p-8">
                    <h2 className="display text-3xl">{ui.learn.takeaways}</h2>
                    <ul className="mt-4 space-y-2">{found.lesson.body.takeaways.map((x) => <li key={x} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />{x}</li>)}</ul>
                  </section>
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-4 border-t border-mist pt-8">
                <MarkDone course={course.slug} lesson={found.lesson.slug} labels={ui.learn} />
                <p className="text-xs text-graphite">{ui.learn.localNote}</p>
              </div>
              <div>
                <h2 className="mb-4 font-semibold">{ui.tutor.title}</h2>
                <TutorChat locale={locale} ui={ui.tutor} course={course.slug} compact />
              </div>
            </div>
          )}

          <nav className="mt-12 grid gap-3 border-t border-mist pt-8 sm:grid-cols-2" aria-label="Lecciones">
            {prev || found ? (
              <Link href={`${base}/aprender/${prev ? prev.lesson.slug : INTRO_SLUG}`} className="rounded-2xl border border-mist p-4 text-sm transition hover:border-gold-300">
                <span className="text-xs text-graphite">← {ui.learn.prev}</span>
                <span className="mt-1 block font-semibold">{prev ? prev.lesson.title[locale] : ui.learn.intro}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`${base}/aprender/${next.lesson.slug}`} className="rounded-2xl border border-mist p-4 text-right text-sm transition hover:border-gold-300">
                <span className="text-xs text-graphite">{ui.learn.next} →</span>
                <span className="mt-1 block font-semibold">{next.lesson.title[locale]}</span>
              </Link>
            ) : null}
          </nav>
        </article>
      </Container>
    </div>
  );
}

function SidebarLink({ href: to, active, title, badge, free, course, lesson }: { href: string; active: boolean; title: string; badge?: string; free?: boolean; course: string; lesson: string }) {
  return (
    <Link href={to} aria-current={active ? "page" : undefined} className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-[0.84rem] leading-snug transition ${active ? "bg-ink text-white" : "text-[#333] hover:bg-pearl"}`}>
      <Icon name={free ? "play" : "lock"} className={`h-3.5 w-3.5 shrink-0 ${free ? "text-gold-500" : "opacity-40"}`} />
      <span className="min-w-0 flex-1">{title}</span>
      <DoneMark course={course} lesson={lesson} />
      {badge ? <span className={`shrink-0 text-[0.55rem] font-bold uppercase tracking-[0.12em] ${active ? "text-gold-200" : "text-graphite"}`}>{badge}</span> : null}
    </Link>
  );
}

function Gate({ icon, title, text, lessonTitle, module, cta }: { icon: "lock" | "sparkle"; title: string; text: string; lessonTitle: string; module: string; cta: { href: string; label: string } }) {
  return (
    <div className="bg-noir grain relative overflow-hidden rounded-[2rem] p-8 text-white sm:p-14">
      <span className="grid h-14 w-14 place-items-center rounded-full border border-gold-400/40 text-gold-200"><Icon name={icon} className="h-6 w-6" /></span>
      <p className="eyebrow mt-8 text-gold-300">{module}</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">{lessonTitle}</h1>
      <p className="mt-6 font-semibold">{title}</p>
      <p className="mt-2 max-w-xl text-white/65">{text}</p>
      <Link href={cta.href} className="btn btn-gold mt-8">{cta.label} <Icon name="arrow" className="h-4 w-4" /></Link>
    </div>
  );
}

function Intro({ course, locale, ui, base }: { course: Course; locale: Locale; ui: AcademyUi; base: string }) {
  const sample = previewTarget(course);
  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow text-gold-600">{ui.learn.free}</p>
        <h1 className="display mt-3 text-4xl leading-tight sm:text-5xl">{ui.learn.intro}</h1>
        <p className="mt-4 text-lg text-graphite">{ui.learn.introText}</p>
      </header>
      <section className="bg-noir grain relative overflow-hidden rounded-[2rem] p-8 text-white sm:p-12">
        <h2 className="display text-3xl sm:text-4xl">{course.title[locale]}</h2>
        <p className="mt-5 leading-relaxed text-white/70">{course.description[locale]}</p>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-mist p-6 sm:p-8">
          <h2 className="eyebrow text-gold-600">{ui.course.goals}</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed">{course.goals[locale].map((g) => <li key={g} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />{g}</li>)}</ul>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-mist p-6 sm:p-8">
            <h2 className="eyebrow text-gold-600">{ui.course.audience}</h2>
            <ul className="mt-4 space-y-2 text-sm text-graphite">{course.audience[locale].map((a) => <li key={a}>{a}</li>)}</ul>
          </div>
          <div className="rounded-3xl border border-mist p-6 sm:p-8">
            <h2 className="eyebrow text-gold-600">{ui.course.requirements}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-graphite marker:text-gold-600">{course.requirements[locale].map((a) => <li key={a}>{a}</li>)}</ul>
          </div>
        </div>
      </section>
      <section>
        <h2 className="display text-3xl">{ui.learn.modulesTitle}</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {course.modules.map((m, i) => (
            <li key={m.slug} className="flex items-baseline gap-4 rounded-2xl border border-mist px-5 py-4">
              <span className="display text-gold text-2xl">{String(i + 1).padStart(2, "0")}</span>
              <span><span className="font-semibold">{m.title[locale]}</span><span className="block text-xs text-graphite">{fmt(ui.card.lessons, { n: m.lessons.length })}</span></span>
            </li>
          ))}
        </ol>
      </section>
      {sample !== INTRO_SLUG ? (
        <Link href={`${base}/aprender/${sample}`} className="btn btn-gold">{ui.course.sampleCta} <Icon name="arrow" className="h-4 w-4" /></Link>
      ) : (
        <Link href={`${href(locale)}#newsletter`} className="btn btn-dark">{ui.checkout.notify}</Link>
      )}
    </div>
  );
}
