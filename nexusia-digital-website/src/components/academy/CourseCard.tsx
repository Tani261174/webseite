import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Course } from "@/academy/types";
import { courseStats } from "@/academy/repository";
import { formatPrice } from "@/academy/pricing";
import { fmt, type AcademyUi } from "@/academy/ui";
import { href } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";
import { CourseVisual } from "./CourseCover";

export function PriceLabel({ course, locale, ui, size = "md" }: { course: Course; locale: Locale; ui: AcademyUi; size?: "md" | "lg" }) {
  if (!course.priceCents) return <span className={`font-semibold text-gold-700 ${size === "lg" ? "text-xl" : "text-sm"}`}>{ui.card.soon}</span>;
  return (
    <span className="flex flex-col">
      <span className={`display ${size === "lg" ? "text-4xl" : "text-2xl"}`}>{formatPrice(course.priceCents, locale)}</span>
      {course.priceIsExample ? <span className="text-[0.65rem] uppercase tracking-[0.14em] text-graphite">{ui.card.exampleTag}</span> : null}
    </span>
  );
}

export function CourseCard({ course, locale, ui }: { course: Course; locale: Locale; ui: AcademyUi }) {
  const s = courseStats(course);
  const url = href(locale, `/academia/${course.slug}`);
  return (
    <article className="card-lux reveal group flex flex-col overflow-hidden">
      <Link href={url} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/10] overflow-hidden bg-ink">
        <CourseVisual course={course} label={ui.card.independent} id={`card-${course.slug}`} number={course.order} className="h-full w-full transition duration-[1.2s] ease-[var(--ease-lux)] group-hover:scale-[1.04]" />
        <span className="absolute right-[7%] top-[11%] rounded-full bg-black/70 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-200 backdrop-blur">
          {s.previews > 0 ? ui.card.previewTag : ui.card.soon}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow text-[0.6rem] text-gold-600">{ui.areas[course.area]}</p>
        <h3 className="display mt-2 text-[1.65rem] leading-tight">
          <Link href={url} className="transition hover:text-gold-600">{course.title[locale]}</Link>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-graphite">{course.short[locale]}</p>
        <ul className="mt-5 flex flex-wrap gap-2 text-[0.7rem] text-graphite">
          <li className="rounded-full bg-pearl px-3 py-1">{ui.levels[course.level]}</li>
          <li className="rounded-full bg-pearl px-3 py-1">{fmt(ui.card.lessons, { n: s.lessons })}</li>
          <li className="rounded-full bg-pearl px-3 py-1">{fmt(ui.card.modules, { n: s.modules })}</li>
        </ul>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-mist pt-5">
          <PriceLabel course={course} locale={locale} ui={ui} />
          <Link href={url} className="btn btn-dark min-h-10 shrink-0 whitespace-nowrap px-4 text-[0.68rem] sm:px-5 sm:text-[0.7rem]">
            {ui.card.view} <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
