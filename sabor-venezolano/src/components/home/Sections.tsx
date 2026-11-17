import Link from "next/link";
import { pick, type Locale } from "@/lib/i18n/config";
import { fmt, type Messages } from "@/lib/i18n/messages";
import { formatDate } from "@/lib/ordering";
import type { Settings } from "@/lib/settings";
import { waLink } from "@/lib/whatsapp";
import { Ornament, PineSprig, Sparkles, StarArc } from "../brand/Brand";
import { Icon } from "../ui/Icon";
import { Photo } from "../ui/Photo";

export const SLOGAN = "Un pedacito de Venezuela en tu mesa.";
const norm = (x: string) => x.toLowerCase().replace(/[^a-záéíóúñü ]/g, "").trim();

export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow text-ink-muted">{eyebrow}</p>
      <h2 className="mt-4 font-display text-[2.1rem] leading-[1.12] text-ink sm:text-[2.75rem]">{title}</h2>
      <Ornament className="mt-6" />
      {text ? <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">{text}</p> : null}
    </div>
  );
}

/** Startseite oben: Slogan, schwarzer Bestellbutton und großes Foto der beiden Köchinnen. */
export function Hero({ locale, t, settings }: { locale: Locale; t: Messages; settings: Settings }) {
  const c = settings.content;
  const [a, b] = c.cooks;
  return (
    <section className="relative bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 sm:px-6 md:grid-cols-[0.95fr_1.05fr] md:gap-14 md:pb-24 md:pt-20">
        <div className="animate-rise text-center md:text-left">
          <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:justify-start md:gap-3">
            <StarArc className="w-12 text-flag-blue md:w-10" />
            <p className="eyebrow text-ink-muted">{t.home.heroEyebrow}</p>
          </div>
          <h1 lang="es" className="mt-6 font-display text-[2.7rem] leading-[1.04] text-ink sm:text-6xl lg:text-[4.4rem]">
            {SLOGAN}
          </h1>
          <Ornament className="mt-7 md:justify-start" />
          <p className="mx-auto mt-7 max-w-md font-display text-xl italic leading-snug text-ink md:mx-0">{pick(c.heroTitle, locale)}</p>
          <p className="mx-auto mt-3 max-w-md text-[1.02rem] leading-relaxed text-ink-soft md:mx-0">{pick(c.heroSubtitle, locale)}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link href={`/${locale}/productos`} className="btn btn-primary min-h-[3.6rem] px-10">
              {pick(c.heroCta, locale) || t.common.orderNow}
            </Link>
            <a href={waLink(settings.shop.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary min-h-[3.6rem]">
              <Icon name="whatsapp" className="h-5 w-5" /> WhatsApp
            </a>
          </div>
          <p className="mx-auto mt-6 flex max-w-md items-start justify-center gap-2 text-left text-sm text-ink-muted md:mx-0 md:justify-start">
            <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0" />
            {t.cart.preorderNote}
          </p>
        </div>

        {/* Großes Foto der beiden Köchinnen mit ihren Spezialitäten */}
        <figure className="animate-rise delay-2 -mx-5 sm:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden bg-paper sm:aspect-[5/6] sm:rounded-[4px]">
            <Photo src={c.heroImage} alt={`${a.name} & ${b.name}`} label={t.common.photoSoon} tag={t.common.placeholder} kind="group" priority />
          </div>
          <figcaption className="mt-4 flex items-baseline justify-between gap-4 px-5 text-sm sm:px-0">
            <span className="font-display text-base text-ink">
              {a.name} <span className="text-ink-muted">&amp;</span> {b.name}
            </span>
            <span className="hidden text-right text-xs uppercase tracking-[0.16em] text-ink-muted sm:inline">{t.home.cooksEyebrow}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function Welcome({ locale, t, settings }: { locale: Locale; t: Messages; settings: Settings }) {
  return (
    <section className="border-t border-line bg-white px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-ink-muted">{t.home.welcomeEyebrow}</p>
        {/* Doppelung vermeiden: steht der Slogan schon oben als Hauptüberschrift, hier nicht wiederholen */}
        {norm(pick(settings.content.welcomeTitle, locale)) !== norm(SLOGAN) ? (
          <h2 className="mt-4 font-display text-[2rem] italic leading-tight text-ink sm:text-[2.6rem]">{pick(settings.content.welcomeTitle, locale)}</h2>
        ) : null}
        <Ornament className="mt-6" />
        <p className="mt-7 text-[1.05rem] leading-[1.9] text-ink-soft">{pick(settings.content.welcomeText, locale)}</p>
      </div>
    </section>
  );
}

export function Cooks({ locale, t, settings }: { locale: Locale; t: Messages; settings: Settings }) {
  return (
    <section className="bg-white px-5 pb-20 sm:px-6 sm:pb-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.home.cooksEyebrow} title={t.home.cooksTitle} />
        <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
          {settings.content.cooks.map((cook, i) => (
            <article key={i}>
              <div className="aspect-[4/5] overflow-hidden rounded-[4px]">
                <Photo src={cook.image} alt={cook.name} label={t.common.photoSoon} tag={t.common.placeholder} kind="portrait" />
              </div>
              <div className="mt-6 text-center md:text-left">
                <p className="eyebrow text-ink-muted">{pick(cook.role, locale)}</p>
                <h3 className="mt-2 font-display text-[1.7rem] text-ink">{cook.name}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{pick(cook.text, locale)}</p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold uppercase tracking-[0.14em] text-ink-muted">{t.home.specialtiesLabel}: </span>
                  <span className="font-display italic text-ink">{pick(cook.specialties, locale)}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ChristmasTeaser({ locale, t, settings }: { locale: Locale; t: Messages; settings: Settings }) {
  const x = settings.christmas;
  return (
    <section className="relative overflow-hidden border-y border-line bg-paper px-5 py-20 sm:px-6 sm:py-28">
      <PineSprig className="pointer-events-none absolute -right-6 top-8 w-52 text-ink/10 sm:w-72" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden rounded-[4px] md:order-2">
          <Photo src={x.image} alt={t.christmas.title} label={t.common.photoSoon} tag={t.common.placeholder} />
        </div>
        <div className="text-center md:text-left">
          <Sparkles className="mx-auto w-28 text-flag-yellow md:mx-0" />
          <p className="eyebrow mt-5 text-ink-muted">{t.christmas.eyebrow}</p>
          <h2 className="mt-4 font-display text-[2.1rem] leading-tight text-ink sm:text-[2.7rem]">{t.christmas.title}</h2>
          <Ornament className="mt-6 md:justify-start" />
          <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">{pick(x.text, locale)}</p>
          <ChristmasDates locale={locale} t={t} settings={settings} />
          <Link href={`/${locale}/navidad`} className="btn btn-primary mt-9">
            {t.christmas.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ChristmasDates({ locale, t, settings }: { locale: Locale; t: Messages; settings: Settings }) {
  const x = settings.christmas;
  if (!x.orderDeadline && !(x.periodStart && x.periodEnd)) return null;
  return (
    <ul className="mt-6 space-y-2 text-sm text-ink">
      {x.orderDeadline ? (
        <li className="flex items-center justify-center gap-2 md:justify-start">
          <Icon name="calendar" className="h-4 w-4" />
          {fmt(t.christmas.deadline, { date: formatDate(x.orderDeadline, locale) })}
        </li>
      ) : null}
      {x.periodStart && x.periodEnd ? (
        <li className="flex items-center justify-center gap-2 md:justify-start">
          <Icon name="clock" className="h-4 w-4" />
          {fmt(t.christmas.period, { from: formatDate(x.periodStart, locale), to: formatDate(x.periodEnd, locale) })}
        </li>
      ) : null}
    </ul>
  );
}

export function Steps({ t }: { t: Messages }) {
  const icons = ["bag", "whatsapp", "chef"] as const;
  return (
    <section className="bg-white px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.home.howEyebrow} title={t.home.howTitle} />
        <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          {t.home.steps.map((s, i) => (
            <li key={i} className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ink text-ink">
                <Icon name={icons[i]} className="h-6 w-6" />
              </span>
              <p className="mt-5 font-display text-sm italic text-ink-muted">0{i + 1}</p>
              <h3 className="mt-1 font-display text-2xl text-ink">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-14 max-w-xl border-t border-line pt-6 text-center text-sm font-semibold text-ink">{t.cart.confirmNote}</p>
      </div>
    </section>
  );
}

export function Reviews({ t, reviews }: { t: Messages; reviews: { id: number; name: string; text: string; rating: number }[] }) {
  if (reviews.length === 0) return null; // nur echte Bewertungen anzeigen
  return (
    <section className="border-t border-line bg-white px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.home.reviewsEyebrow} title={t.home.reviewsTitle} />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {reviews.slice(0, 6).map((r) => (
            <figure key={r.id} className="text-center">
              <div className="flex justify-center gap-0.5 text-flag-yellow" aria-label={`${r.rating}/5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon key={i} name="star" className={`h-4 w-4 ${i < r.rating ? "" : "opacity-25"}`} />
                ))}
              </div>
              <blockquote className="mt-4 font-display text-lg italic leading-relaxed text-ink">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhatsAppBand({ t, settings }: { t: Messages; settings: Settings }) {
  return (
    <section className="bg-white px-5 pb-24 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 border border-line px-6 py-14 text-center sm:px-12">
        <StarArc className="w-16 text-flag-blue" />
        <h2 className="font-display text-[2rem] text-ink">{t.home.whatsappTitle}</h2>
        <p className="max-w-md text-ink-soft">{t.home.whatsappText}</p>
        <a href={waLink(settings.shop.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2 min-h-[3.6rem]">
          <Icon name="whatsapp" className="h-5 w-5" /> {settings.shop.whatsappDisplay}
        </a>
      </div>
    </section>
  );
}
