import type { Metadata } from "next";
import Link from "next/link";
import { resolveLocale } from "@/lib/i18n/page";
import { href, pageMetadata } from "@/lib/site";
import { Container, PageHero } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/faq", title: t.faq.title, description: t.faq.description });
}

export default async function FaqPage({ params }: P) {
  const { locale, t } = await resolveLocale(params);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow={t.faq.eyebrow} title={t.faq.title} />
      <section className="py-16 sm:py-24">
        <Container className="max-w-4xl">
          <div className="divide-y divide-mist border-y border-mist">
            {t.faq.items.map((item, i) => (
              <details key={item.q} className="group py-2" open={i === 0}>
                <summary className="flex items-center justify-between gap-6 py-5">
                  <span className="display text-2xl sm:text-3xl">{item.q}</span>
                  <span className="faq-icon grid h-10 w-10 shrink-0 place-items-center rounded-full border border-mist text-gold-600 transition duration-500 group-hover:border-gold-400">
                    <Icon name="plus" className="h-4 w-4" />
                  </span>
                </summary>
                <p className="max-w-3xl pb-6 leading-relaxed text-graphite">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link href={href(locale, "/contact")} className="btn btn-dark">{t.nav.contact} <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
        </Container>
      </section>
    </>
  );
}
