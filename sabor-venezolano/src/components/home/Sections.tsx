import Link from "next/link";
import { pick, type Locale } from "@/lib/i18n/config";
import { fmt, type Messages } from "@/lib/i18n/messages";
import { formatDate } from "@/lib/ordering";
import type { Settings } from "@/lib/settings";
import { waLink } from "@/lib/whatsapp";
import { Ornament, PineSprig, Sparkles, StarArc } from "../brand/Brand";
import { Icon } from "../ui/Icon";
import { Photo } from "../ui/Photo";

export function SectionHeading({
  eyebrow,
  title,
  text,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className={`eyebrow ${tone === "dark" ? "text-ink-muted" : "text-ink-muted"}`}>{eyebrow}</p>
      <h2 className={`mt-3 font-display text-[2rem] leading-[1.15] sm:text-[2.6rem] ${tone === "dark" ? "text-ink" : "text-ink"}`}>
        {title}
      </h2>
      <Ornament className="mt-5" />
      {text ? <p className={`mt-5 text-base leading-relaxed sm:text-lg ${tone === "dark" ? "text-ink-soft" : "text-ink-soft"}`}>{text}</p> : null}
    </div>
  );
}

export function Hero({ locale, t, settings }: { locale: Locale; t: Messages; settings: Settings }) {
  const c = settings.content;
  const [a, b] = c.cooks;
  return (
    <section className="bg-blush relative overflow-hidden text-ink">
      <StarArc className="pointer-events-none absolute -right-16 -top-10 w-[34rem] text-ink/[0.04]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-[1.05fr_1fr] md:gap-8 md:pb-24 md:pt-16">
        <div className="animate-rise text-center md:text-left">
          <p className="eyebrow text-ink-muted">{t.home.heroEyebrow}</p>
          <h1 className="mt-4 font-display text-[2.35rem] leading-[1.08] sm:text-5xl lg:text-[3.6rem]">
            {pick(c.heroTitle, locale)}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft md:mx-0 sm:text-lg">
            {pick(c.heroSubtitle, locale)}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link href={`/${locale}/productos`} className="btn btn-primary min-h-[3.6rem] px-8 text-lg">
              {pick(c.heroCta, locale) || t.common.orderNow}
            </Link>
            <a
              href={waLink(settings.shop.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary min-h-[3.6rem]"
            >
              <Icon name="whatsapp" className="h-5 w-5" /> WhatsApp
            </a>
          </div>
          <p className="mx-auto mt-6 flex max-w-md items-start gap-2 text-left text-sm text-ink-soft md:mx-0">
            <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" />
            {t.cart.preorderNote}
          </p>
        </div>

        {/* Die beiden Gesichter der Marke */}
        <div className="animate-rise delay-2 relative mx-auto grid w-full max-w-md grid-cols-2 gap-4 md:max-w-none">
          {[a, b].map((cook, i) => (
            <figure key={i} className={`${i === 1 ? "mt-10 animate-float" : "animate-float"}`} style={{ animationDelay: `${i * 1.5}s` }}>
              <div className="soft-frame relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[32px]">
                <Photo
                  src={cook.image}
                  alt={cook.name}
                  label={t.common.photoSoon}
                  tag={t.common.placeholder}
                  kind="portrait"
                  priority
                />
              </div>
              <figcaption className="mt-3 text-center">
                <span className="block font-display text-lg text-ink">{cook.name}</span>
                <span className="text-xs uppercase tracking-[0.16em] text-ink-muted">{pick(cook.specialties, locale)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-ink/15 to-transparent" />
    </section>
  );
}

export function Welcome({ locale, t, settings }: { locale: Locale; t: Messages; settings: Settings }) {
  return (
    <section className="bg-soft px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-ink-muted">{t.home.welcomeEyebrow}</p>
        <h2 className="mt-3 font-display text-[2rem] italic leading-tight text-ink sm:text-[2.8rem]">
          {pick(settings.content.welcomeTitle, locale)}
        </h2>
        <Ornament className="mt-6" />
        <p className="mt-6 text-lg leading-[1.85] text-ink-soft">{pick(settings.content.welcomeText, locale)}</p>
      </div>
    </section>
  );
}

export function Cooks({ locale, t, settings }: { locale: Locale; t: Messages; settings: Settings }) {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.home.cooksEyebrow} title={t.home.cooksTitle} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {settings.content.cooks.map((cook, i) => (
            <article key={i} className="card grid overflow-hidden sm:grid-cols-[0.9fr_1.1fr]">
              <div className="aspect-[4/5] sm:aspect-auto sm:min-h-full">
                <Photo src={cook.image} alt={cook.name} label={t.common.photoSoon} tag={t.common.placeholder} kind="portrait" />
              </div>
              <div className="flex flex-col p-6 sm:p-7">
                <p className="eyebrow text-ink-muted">{pick(cook.role, locale)}</p>
                <h3 className="mt-2 font-display text-2xl text-ink">{cook.name}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{pick(cook.text, locale)}</p>
                <div className="mt-auto pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">{t.home.specialtiesLabel}</p>
                  <p className="mt-1 font-display text-lg italic text-ink">{pick(cook.specialties, locale)}</p>
                </div>
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
    <section className="relative overflow-hidden bg-rose/50 px-4 py-20 text-ink sm:px-6 sm:py-24">
      <PineSprig className="pointer-events-none absolute -left-6 top-6 w-56 text-ink/15 sm:w-72" />
      <PineSprig className="pointer-events-none absolute -right-6 bottom-6 w-56 rotate-180 text-ink/15 sm:w-72" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div className="text-center md:text-left">
          <Sparkles className="mx-auto w-32 text-ink-muted md:mx-0" />
          <p className="eyebrow mt-4 text-ink-muted">{t.christmas.eyebrow}</p>
          <h2 className="mt-3 font-display text-[2rem] leading-tight sm:text-[2.6rem]">{t.christmas.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{pick(x.text, locale)}</p>
          <ChristmasDates locale={locale} t={t} settings={settings} />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link href={`/${locale}/navidad`} className="btn btn-primary">
              {t.christmas.cta}
            </Link>
          </div>
        </div>
        <div className="soft-frame relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[28px]">
          <Photo src={x.image} alt={t.christmas.title} label={t.common.photoSoon} tag={t.common.placeholder} />
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
    <section className="bg-sage/50 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.home.howEyebrow} title={t.home.howTitle} />
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {t.home.steps.map((s, i) => (
            <li key={i} className="card relative p-7 text-center">
              <span className="absolute left-5 top-4 font-display text-4xl italic text-ink/25">{i + 1}</span>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose text-ink">
                <Icon name={icons[i]} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-xl text-ink">{s.title}</h3>
              <p className="mt-2 text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-8 max-w-xl text-center text-sm font-semibold text-ink">{t.cart.confirmNote}</p>
      </div>
    </section>
  );
}

export function Reviews({ t, reviews }: { t: Messages; reviews: { id: number; name: string; text: string; rating: number }[] }) {
  if (reviews.length === 0) return null; // nur echte Bewertungen anzeigen
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={t.home.reviewsEyebrow} title={t.home.reviewsTitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.slice(0, 6).map((r) => (
            <figure key={r.id} className="card p-7">
              <div className="flex gap-0.5 text-ink-muted" aria-label={`${r.rating}/5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon key={i} name="star" className={`h-4 w-4 ${i < r.rating ? "" : "opacity-25"}`} />
                ))}
              </div>
              <blockquote className="mt-4 font-display text-lg italic leading-relaxed text-ink">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm font-bold text-ink">— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhatsAppBand({ t, settings }: { t: Messages; settings: Settings }) {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-24">
      <div className="mx-auto flex max-w-4xl bg-sage flex-col items-center gap-6 rounded-[32px] px-6 py-12 text-center text-ink sm:px-12">
        <StarArc className="w-20 text-ink-muted" />
        <h2 className="font-display text-3xl">{t.home.whatsappTitle}</h2>
        <p className="max-w-md text-ink-soft">{t.home.whatsappText}</p>
        <a
          href={waLink(settings.shop.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary min-h-[3.6rem] px-8 text-lg"
        >
          <Icon name="whatsapp" className="h-6 w-6" /> {settings.shop.whatsappDisplay}
        </a>
      </div>
    </section>
  );
}
