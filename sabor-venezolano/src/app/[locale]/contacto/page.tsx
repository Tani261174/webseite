import type { Metadata } from "next";
import { alternates, resolveLocale } from "@/lib/server/page";
import { getSettings } from "@/lib/server/repo";
import { formToken } from "@/lib/server/security";
import { waLink } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/home/Sections";
import { ContactForm } from "@/components/forms/ContactForm";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { title: t.contact.title, description: t.contact.intro, alternates: alternates(locale, "/contacto") };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await resolveLocale(params);
  const settings = getSettings();
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="bg-linen px-4 pb-24 pt-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Sabor Venezolano" title={t.contact.title} text={t.contact.intro} />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="bg-velvet flex flex-col items-center justify-center rounded-[24px] p-8 text-center text-cream">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1f7a4d]">
              <Icon name="whatsapp" className="h-8 w-8 text-white" />
            </span>
            <h2 className="mt-5 font-display text-2xl">{t.contact.whatsappTitle}</h2>
            <p className="mt-2 text-cream/75">{t.contact.whatsappText}</p>
            <a href={waLink(settings.shop.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6 w-full max-w-xs">
              <Icon name="whatsapp" className="h-5 w-5" /> {settings.shop.whatsappDisplay}
            </a>
          </div>

          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl text-bordeaux">{t.contact.formTitle}</h2>
            <div className="mt-5">
              <ContactForm token={formToken()} />
            </div>
          </div>
        </div>

        <section className="mx-auto mt-20 max-w-3xl" aria-labelledby="faq">
          <h2 id="faq" className="text-center font-display text-3xl text-bordeaux">
            {t.contact.faqTitle}
          </h2>
          <div className="mt-8 space-y-3">
            {t.faq.map((f, i) => (
              <details key={i} className="card group p-0 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 font-semibold text-cocoa">
                  {f.q}
                  <Icon name="plus" className="h-5 w-5 shrink-0 text-gold-dark transition-transform group-open:rotate-45" />
                </summary>
                <p className="px-5 pb-5 leading-relaxed text-cocoa-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
