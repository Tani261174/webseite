import { notFound, redirect } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { href } from "@/lib/site";
import { getCourse, listCourses, previewTarget } from "@/academy/repository";

export const dynamicParams = false;
export async function generateStaticParams() {
  const courses = await listCourses();
  return locales.flatMap((locale) => courses.map((c) => ({ locale, course: c.slug })));
}

/** /academia/[kurs]/aprender → kostenlose Vorschau des Kurses */
export default async function LearnIndex({ params }: { params: Promise<{ locale: string; course: string }> }) {
  const { locale, course: slug } = await params;
  const course = isLocale(locale) ? await getCourse(slug) : undefined;
  if (!course || !isLocale(locale)) notFound();
  redirect(href(locale, `/academia/${course.slug}/aprender/${previewTarget(course)}`));
}
