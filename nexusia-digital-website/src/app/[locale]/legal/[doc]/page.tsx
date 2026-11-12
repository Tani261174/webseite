import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalDocs, type LegalSlug } from "@/content/legal";
import { locales } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/page";
import { pageMetadata } from "@/lib/site";
import { Container, Notice } from "@/components/ui/Section";
import { LegalText } from "@/components/legal/LegalText";

type P = { params: Promise<{ locale: string; doc: string }> };
const docs = Object.keys(legalDocs) as LegalSlug[];

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => docs.map((doc) => ({ locale, doc })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const { doc } = await params;
  const d = legalDocs[doc as LegalSlug]?.[locale];
  if (!d) return {};
  return pageMetadata({ locale, path: `/legal/${doc}`, title: d.title, description: d.description });
}

export default async function LegalPage({ params }: P) {
  const { locale, t } = await resolveLocale(params);
  const { doc } = await params;
  const d = legalDocs[doc as LegalSlug]?.[locale];
  if (!d) notFound();
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="display text-5xl sm:text-6xl">{d.title}</h1>
        <p className="mt-3 text-sm text-smoke">{t.legal.lastUpdated}: <LegalText text={d.updated} /></p>
        <div className="mt-8 space-y-3">
          <Notice>⚠ {t.legal.reviewNotice}</Notice>
          {t.legal.bindingNotice ? <Notice>{t.legal.bindingNotice}</Notice> : null}
        </div>
        <article className="prose-legal mt-6">
          {d.sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              {s.body.map((b, i) =>
                Array.isArray(b) ? (
                  <ul key={i}>{b.map((li) => <li key={li}><LegalText text={li} /></li>)}</ul>
                ) : (
                  <p key={i}><LegalText text={b} /></p>
                ),
              )}
            </section>
          ))}
        </article>
      </Container>
    </section>
  );
}
