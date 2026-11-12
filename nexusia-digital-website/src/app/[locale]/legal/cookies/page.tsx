import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n/page";
import { pageMetadata } from "@/lib/site";
import { Container, Notice } from "@/components/ui/Section";
import { CookiePreferences } from "@/components/legal/CookiePreferences";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/legal/cookies", title: t.cookies.title, description: t.cookies.description });
}

export default async function CookiesPage({ params }: P) {
  const { t } = await resolveLocale(params);
  return (
    <section className="bg-pearl py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="display text-5xl sm:text-6xl">{t.cookies.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-graphite">{t.cookies.intro}</p>
        <div className="mt-6"><Notice>⚠ {t.legal.reviewNotice}</Notice></div>
        <div className="mt-10"><CookiePreferences labels={t.cookies} /></div>
      </Container>
    </section>
  );
}
