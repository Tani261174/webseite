import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { href, pageMetadata } from "@/lib/site";
import { academyUi } from "@/academy/ui";
import { getCourse, listCourses } from "@/academy/repository";
import { quote } from "@/academy/pricing";
import { Container } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { CourseCover } from "@/components/academy/CourseCover";
import { CheckoutBox } from "@/components/academy/CheckoutBox";

type P = { params: Promise<{ locale: string; course: string }> };

export const dynamicParams = false;
export async function generateStaticParams() {
  const courses = await listCourses();
  return locales.flatMap((locale) => courses.map((c) => ({ locale, course: c.slug })));
}

async function load(params: P["params"]) {
  const { locale, course: slug } = await params;
  if (!isLocale(locale)) notFound();
  const course = await getCourse(slug);
  if (!course) notFound();
  return { locale, course, ui: academyUi(locale) };
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, course, ui } = await load(params);
  return pageMetadata({ locale, path: `/academia/checkout/${course.slug}`, title: `${ui.checkout.metaTitle} · ${course.title[locale]}`, description: course.short[locale], noindex: true });
}

export default async function CheckoutPage({ params }: P) {
  const { locale, course, ui } = await load(params);
  const q = quote(course);
  return (
    <section className="bg-pearl py-14 sm:py-20">
      <Container className="grid max-w-5xl gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Link href={href(locale, `/academia/${course.slug}`)} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-graphite hover:text-ink">
            <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" /> {course.title[locale]}
          </Link>
          <h1 className="display mt-6 text-5xl">{ui.checkout.title}</h1>
          <div className="mt-8 flex gap-5 rounded-3xl border border-mist bg-white p-5">
            <CourseCover motif={course.cover} id={`co-${course.slug}`} image={course.image} className="aspect-[16/10] w-32 shrink-0 rounded-xl sm:w-44" />
            <div>
              <p className="eyebrow text-[0.6rem] text-gold-600">{ui.checkout.course}</p>
              <p className="display mt-1 text-2xl leading-tight">{course.title[locale]}</p>
              {course.priceIsExample ? <p className="mt-2 text-xs text-graphite">{ui.course.exampleNote}</p> : null}
            </div>
          </div>
          <div className="mt-8 rounded-3xl border border-mist bg-white p-6">
            <h2 className="font-semibold">{ui.checkout.stepsTitle}</h2>
            <ol className="mt-4 space-y-3 text-sm text-graphite">
              {ui.checkout.steps.map((s, i) => <li key={s} className="flex gap-3"><span className="display text-gold text-xl leading-none">{i + 1}</span>{s}</li>)}
            </ol>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-mist bg-white p-6 sm:p-8 lg:sticky lg:top-24">
            {course.priceCents ? (
              <CheckoutBox course={course.slug} initial={q} ui={ui.checkout} locale={locale} />
            ) : (
              <div className="space-y-5">
                <p className="font-semibold">{ui.checkout.notForSale}</p>
                <p className="text-sm text-graphite">{ui.checkout.disabledText}</p>
                <Link href={`${href(locale)}#newsletter`} className="btn btn-dark w-full">{ui.checkout.notify}</Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
