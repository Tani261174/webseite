"use client";

import Link from "next/link";
import { useProgress } from "./progress";

export type ProgressCourse = { slug: string; title: string; lessons: { slug: string; title: string }[]; firstPreview: string };

export function MyProgress({ locale, courses, labels }: {
  locale: string;
  courses: ProgressCourse[];
  labels: { noProgress: string; completed: string; reset: string; continue: string; startPreview: string };
}) {
  const { data, reset } = useProgress();
  const rows = courses
    .map((c) => {
      const p = data[c.slug] || {};
      const done = c.lessons.filter((l) => p[l.slug]?.done).length;
      const quizzes = c.lessons.filter((l) => p[l.slug]?.quizTotal).map((l) => ({ title: l.title, ...p[l.slug] }));
      return { c, done, quizzes, touched: Object.keys(p).length > 0 };
    })
    .filter((r) => r.touched);

  if (!rows.length) {
    const first = courses[0];
    return (
      <div className="rounded-2xl border border-dashed border-mist p-6 text-sm text-graphite">
        <p>{labels.noProgress}</p>
        {first ? <Link href={`/${locale}/academia/${first.slug}/aprender/${first.firstPreview}`} className="btn btn-dark mt-4">{labels.startPreview}</Link> : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rows.map(({ c, done, quizzes }) => {
        const pct = Math.round((done / Math.max(1, c.lessons.length)) * 100);
        return (
          <div key={c.slug} className="rounded-2xl border border-mist bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="display text-2xl">{c.title}</h3>
              <Link href={`/${locale}/academia/${c.slug}/aprender/${c.firstPreview}`} className="btn btn-outline min-h-10 px-5 text-[0.7rem]">{labels.continue}</Link>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-mist" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
              <div className="bg-gold h-full" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-sm text-graphite">{labels.completed.replace("{n}", String(done))} · {pct} %</p>
            {quizzes.length ? (
              <ul className="mt-3 space-y-1 text-sm">
                {quizzes.map((q) => <li key={q.title}>Quiz · {q.title}: <strong>{q.quiz}/{q.quizTotal}</strong></li>)}
              </ul>
            ) : null}
          </div>
        );
      })}
      <button type="button" onClick={reset} className="text-xs text-graphite underline underline-offset-4 hover:text-ink">{labels.reset}</button>
    </div>
  );
}
