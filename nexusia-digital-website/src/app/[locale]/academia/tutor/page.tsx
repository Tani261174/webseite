import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n/page";
import { pageMetadata } from "@/lib/site";
import { academyUi } from "@/academy/ui";
import { Container, PageHero } from "@/components/ui/Section";
import { TutorChat } from "@/components/academy/TutorChat";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const ui = academyUi(locale);
  return pageMetadata({ locale, path: "/academia/tutor", title: ui.tutor.metaTitle, description: ui.tutor.text });
}

export default async function TutorPage({ params }: P) {
  const { locale } = await resolveLocale(params);
  const ui = academyUi(locale);
  return (
    <>
      <PageHero eyebrow={ui.name} title={ui.tutor.title} text={ui.tutor.text} />
      <section className="py-10 sm:py-20">
        <Container className="max-w-3xl">
          <TutorChat locale={locale} ui={ui.tutor} />
        </Container>
      </section>
    </>
  );
}
