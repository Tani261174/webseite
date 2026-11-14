/**
 * Datenzugriff der Akademie.
 * Heute: Kurse aus den Dateien in src/academy/courses.
 * Später: Kurse aus Cloudflare D1 (Tabelle `courses` usw., siehe migrations/0001_academy.sql).
 * Alle Seiten lesen Kurse NUR über diese Funktionen – sobald hier die Datenbank angebunden ist,
 * erscheinen im Admin angelegte und veröffentlichte Kurse automatisch im Katalog.
 */
import { amazonCourse } from "./courses/amazon";
import { otherCourses } from "./courses/catalog";
import type { Course, Lesson, Module } from "./types";

const staticCourses: Course[] = [amazonCourse, ...otherCourses];

export async function listCourses(opts: { includeDrafts?: boolean } = {}): Promise<Course[]> {
  return staticCourses
    .filter((c) => opts.includeDrafts || c.status !== "draft")
    .sort((a, b) => a.order - b.order);
}

export async function getCourse(slug: string): Promise<Course | undefined> {
  return (await listCourses()).find((c) => c.slug === slug);
}

export interface FlatLesson {
  module: Module;
  moduleIndex: number;
  lesson: Lesson;
}

export function flatLessons(course: Course): FlatLesson[] {
  return course.modules.flatMap((module, moduleIndex) => module.lessons.map((lesson) => ({ module, moduleIndex, lesson })));
}

export function findLesson(course: Course, slug: string) {
  const all = flatLessons(course);
  const i = all.findIndex((x) => x.lesson.slug === slug);
  if (i < 0) return undefined;
  return { ...all[i], position: i + 1, total: all.length, prev: all[i - 1], next: all[i + 1] };
}

export function courseStats(course: Course) {
  const all = flatLessons(course);
  return {
    modules: course.modules.length,
    lessons: all.length,
    ready: all.filter((x) => x.lesson.status === "ready").length,
    previews: all.filter((x) => x.lesson.access === "preview" && x.lesson.status === "ready").length,
    minutes: all.reduce((s, x) => s + (x.lesson.minutes || 0), 0),
  };
}

/** Kostenlose Vorschau: ausführliche Beispiellektion oder – falls keine existiert – die Kursvorstellung. */
export function previewTarget(course: Course) {
  const sample = course.sampleLesson && findLesson(course, course.sampleLesson);
  return sample && sample.lesson.status === "ready" ? course.sampleLesson! : INTRO_SLUG;
}

/** Virtuelle Lektion „Kursvorstellung“ – wird aus den Kursdaten erzeugt und ist immer öffentlich. */
export const INTRO_SLUG = "presentacion";
