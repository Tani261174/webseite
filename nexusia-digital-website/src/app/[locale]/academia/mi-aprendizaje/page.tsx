import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n/page";
import { pageMetadata } from "@/lib/site";
import { academyUi } from "@/academy/ui";
import { listCourses, flatLessons, previewTarget } from "@/academy/repository";
import { Container, PageHero, Notice } from "@/components/ui/Section";
import { MyProgress } from "@/components/academy/MyProgress";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const ui = academyUi(locale);
  return pageMetadata({ locale, path: "/academia/mi-aprendizaje", title: ui.dashboard.metaTitle, description: ui.dashboard.text, noindex: true });
}

export default async function Dashboard({ params }: P) {
  const { locale } = await resolveLocale(params);
  const ui = academyUi(locale);
  const courses = (await listCourses()).map((c) => ({
    slug: c.slug,
    title: c.title[locale],
    firstPreview: previewTarget(c),
    lessons: flatLessons(c).map((x) => ({ slug: x.lesson.slug, title: x.lesson.title[locale] })),
  }));
  const card = "rounded-3xl border border-mist bg-white p-7";
  return (
    <>
      <PageHero eyebrow={ui.name} title={ui.dashboard.title} text={ui.dashboard.text} />
      <section className="bg-pearl py-14 sm:py-20">
        <Container className="space-y-8">
          <Notice><strong>{ui.dashboard.demoTitle}.</strong> {ui.dashboard.demoText}</Notice>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <h2 className="display text-3xl">{ui.dashboard.progress}</h2>
              <MyProgress locale={locale} courses={courses} labels={{ ...ui.dashboard, startPreview: ui.learn.startPreview }} />
            </div>
            <div className="space-y-4">
              <div className={card}><h2 className="font-semibold">{ui.dashboard.courses}</h2><p className="mt-2 text-sm text-graphite">{ui.dashboard.noCourses}</p></div>
              <div className={card}><h2 className="font-semibold">{ui.dashboard.certificates}</h2><p className="mt-2 text-sm text-graphite">{ui.dashboard.certificatesText}</p></div>
              <div className={card}><h2 className="font-semibold">{ui.dashboard.profile}</h2><p className="mt-2 text-sm text-graphite">{ui.dashboard.profileText}</p></div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
