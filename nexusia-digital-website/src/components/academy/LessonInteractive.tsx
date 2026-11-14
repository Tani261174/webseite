"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/academy/types";
import { Icon } from "@/components/ui/Icon";
import { useProgress } from "./progress";

const f = (s: string, v: Record<string, number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

export function Quiz({ course, lesson, questions, labels }: {
  course: string;
  lesson: string;
  questions: QuizQuestion[];
  labels: { quiz: string; quizCheck: string; quizRetry: string; quizScore: string; quizAll: string };
}) {
  const { update } = useProgress();
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [checked, setChecked] = useState(false);
  const [warn, setWarn] = useState(false);
  const score = answers.filter((a, i) => a === questions[i].correct).length;

  function check() {
    if (answers.some((a) => a === null)) { setWarn(true); return; }
    setWarn(false);
    setChecked(true);
    update(course, lesson, { quiz: score, quizTotal: questions.length });
  }

  return (
    <section aria-labelledby="quiz-title" className="rounded-3xl border border-mist bg-pearl p-6 sm:p-8">
      <h2 id="quiz-title" className="display text-3xl">{labels.quiz}</h2>
      <ol className="mt-6 space-y-7">
        {questions.map((q, qi) => (
          <li key={qi}>
            <fieldset>
              <legend className="font-semibold">{qi + 1}. {q.q}</legend>
              <div className="mt-3 grid gap-2">
                {q.options.map((o, oi) => {
                  const chosen = answers[qi] === oi;
                  const right = checked && oi === q.correct;
                  const wrong = checked && chosen && oi !== q.correct;
                  return (
                    <label key={oi} className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm transition ${right ? "border-emerald-600 bg-emerald-50" : wrong ? "border-red-700 bg-red-50" : chosen ? "border-gold-400" : "border-mist hover:border-gold-200"}`}>
                      <input
                        type="radio"
                        name={`q${qi}`}
                        className="mt-0.5 accent-[#c09840]"
                        checked={chosen}
                        disabled={checked}
                        onChange={() => setAnswers((a) => a.map((x, i) => (i === qi ? oi : x)))}
                      />
                      <span>{o}</span>
                    </label>
                  );
                })}
              </div>
              {checked ? <p className="mt-3 text-sm text-graphite" role="status">{answers[qi] === q.correct ? "✓ " : "✗ "}{q.explain}</p> : null}
            </fieldset>
          </li>
        ))}
      </ol>
      {warn ? <p className="mt-6 text-sm text-red-800" role="alert">{labels.quizAll}</p> : null}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {checked ? (
          <>
            <p className="font-semibold" role="status">{f(labels.quizScore, { n: score, t: questions.length })}</p>
            <button type="button" className="btn btn-outline" onClick={() => { setChecked(false); setAnswers(questions.map(() => null)); }}>{labels.quizRetry}</button>
          </>
        ) : (
          <button type="button" className="btn btn-dark" onClick={check}>{labels.quizCheck}</button>
        )}
      </div>
    </section>
  );
}

export function MarkDone({ course, lesson, labels }: { course: string; lesson: string; labels: { markDone: string; done: string } }) {
  const { data, update } = useProgress();
  const done = !!data[course]?.[lesson]?.done;
  return (
    <button type="button" aria-pressed={done} onClick={() => update(course, lesson, { done: !done })} className={`btn ${done ? "btn-outline" : "btn-gold"}`}>
      <Icon name="check" className="h-4 w-4" /> {done ? labels.done : labels.markDone}
    </button>
  );
}

export function DoneMark({ course, lesson }: { course: string; lesson: string }) {
  const { data } = useProgress();
  if (!data[course]?.[lesson]?.done) return null;
  return <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-gold-300" />;
}
