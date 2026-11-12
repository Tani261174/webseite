import type { Metadata } from "next";
import Link from "next/link";
import { resolveLocale } from "@/lib/i18n/page";
import { href, pageMetadata } from "@/lib/site";
import { Container, PageHero } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { Icon } from "@/components/ui/Icon";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/contact", title: t.contact.pageTitle, description: t.contact.pageDescription });
}

export default async function ContactPage({ params }: P) {
  const { locale, t } = await resolveLocale(params);
  return (
    <>
      <PageHero eyebrow={t.contact.eyebrow} title={t.contact.title} text={t.contact.text} />
      <section className="bg-pearl py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="rounded-[1.5rem] border border-mist bg-white p-6 shadow-[var(--shadow-lux)] sm:p-10 lg:col-span-8">
            <ContactForm locale={locale} labels={t.contact} messages={t.forms} requiredLabel={t.common.required} />
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-[1.5rem] bg-ink p-7 text-white">
              <h2 className="eyebrow text-gold-300">{t.contact.direct}</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65">{t.contact.directText}</p>
              <Link href={href(locale, "/legal/imprint")} className="mt-5 inline-flex items-center gap-2 text-sm text-gold-200 hover:text-gold-100">
                {t.legalNav.imprint} <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
            <Link href={href(locale, "/faq")} className="card-lux flex items-center justify-between p-7">
              <span className="display text-2xl">{t.faq.title}</span>
              <Icon name="arrow" className="h-5 w-5 text-gold-600" />
            </Link>
          </aside>
        </Container>
      </section>
    </>
  );
}
