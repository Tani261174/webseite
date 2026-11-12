import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Brand } from "@/content/brands";
import { href } from "@/lib/site";
import { Artwork } from "@/components/art/Artwork";
import { Icon } from "@/components/ui/Icon";
import { RoseMark } from "./Logo";

export function BrandCard({ brand, locale, cta, soonLabel, index }: { brand: Brand; locale: Locale; cta: string; soonLabel: string; index: number }) {
  return (
    <Link href={href(locale, `/brands/${brand.slug}`)}
      className="gold-frame group reveal relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[1.5rem] bg-ink p-7 text-white sm:p-9">
      <Artwork variant={brand.art} id={`bc-${brand.slug}`} className="absolute inset-0 h-full w-full opacity-70 transition duration-[1.6s] ease-[var(--ease-lux)] group-hover:scale-105 group-hover:opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/0" aria-hidden="true" />
      <span className="display absolute right-7 top-6 text-6xl text-white/10" aria-hidden="true">0{index + 1}</span>
      <div className="relative">
        <div className="flex items-center gap-3">
          {brand.slug === "neuesichmittani" ? <RoseMark className="h-6 w-6 text-gold-300" /> : null}
          {brand.status === "coming-soon" ? (
            <span className="rounded-full border border-gold-300/40 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-gold-200">{soonLabel}</span>
          ) : null}
        </div>
        <h3 className="display mt-4 break-words text-[clamp(1.9rem,8vw,2.6rem)]">{brand.name}</h3>
        <p className="mt-2 text-gold-200/90">{brand.tagline[locale]}</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">{brand.summary[locale]}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition group-hover:gap-3 group-hover:text-gold-200">
          {cta} <Icon name="arrow" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
