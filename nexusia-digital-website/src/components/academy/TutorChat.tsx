"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { AcademyUi } from "@/academy/ui";
import { Icon } from "@/components/ui/Icon";

type Source = { course: string; courseTitle: string; lesson: string; title: string; ready: boolean; free: boolean };
type Msg = { role: "user" | "tutor"; text: string; sources?: Source[]; mode?: "local" | "ai" };

export function TutorChat({ locale, ui, course, compact = false }: { locale: Locale; ui: AcademyUi["tutor"]; course?: string; compact?: boolean }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "tutor", text: ui.hello }]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);

  async function ask(question: string) {
    const text = question.trim();
    if (text.length < 2 || busy) return;
    setQ("");
    setBusy(true);
    setMsgs((m) => [...m, { role: "user", text }]);
    try {
      const res = await fetch("/api/academy/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: text.slice(0, 500), locale, course }) });
      if (res.status === 429) throw new Error("limit");
      if (!res.ok) throw new Error("err");
      const data = (await res.json()) as { answer: string; sources: Source[]; mode: "local" | "ai" };
      setMsgs((m) => [...m, { role: "tutor", text: data.answer, sources: data.sources, mode: data.mode }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "tutor", text: e instanceof Error && e.message === "limit" ? ui.limit : ui.error }]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() => list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" }));
    }
  }

  return (
    <div className="bg-noir flex flex-col overflow-hidden rounded-3xl border border-white/10 text-white">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-ink"><Icon name="sparkle" className="h-4 w-4" /></span>
        <div>
          <p className="font-semibold">{ui.title}</p>
          <p className="text-[0.7rem] text-white/50">{ui.modeLocal}</p>
        </div>
      </div>
      <div ref={list} className={`space-y-4 overflow-y-auto px-5 py-5 ${compact ? "max-h-[22rem]" : "max-h-[30rem] min-h-[18rem]"}`} aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
            <div className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-gold text-ink" : "bg-white/[0.06] text-white/85"}`}>
              <p className="whitespace-pre-line">{m.text}</p>
              {m.sources?.length ? (
                <ul className="mt-3 space-y-2">
                  {m.sources.map((s) => (
                    <li key={`${s.course}-${s.lesson}`}>
                      <Link href={`/${locale}/academia/${s.course}/aprender/${s.lesson}`} className="flex items-start gap-2 rounded-xl border border-white/10 px-3 py-2 text-[0.8rem] transition hover:border-gold-300/60">
                        <Icon name="play" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-300" />
                        <span><span className="text-white">{s.title}</span><span className="block text-white/45">{s.courseTitle}</span></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
              {m.mode === "ai" ? <p className="mt-2 text-[0.68rem] text-white/40">{ui.modeAi}</p> : null}
            </div>
          </div>
        ))}
        {busy ? <p className="text-sm text-white/50">{ui.thinking}</p> : null}
      </div>
      {msgs.length < 2 ? (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {ui.suggestions.map((s) => (
            <button key={s} type="button" onClick={() => ask(s)} className="rounded-full border border-white/15 px-3 py-1.5 text-[0.72rem] text-white/75 transition hover:border-gold-300 hover:text-gold-200">{s}</button>
          ))}
        </div>
      ) : null}
      <form className="flex gap-2 border-t border-white/10 p-3" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
        <label htmlFor={`tutor-q-${compact ? "c" : "f"}`} className="sr-only">{ui.label}</label>
        <input id={`tutor-q-${compact ? "c" : "f"}`} value={q} onChange={(e) => setQ(e.target.value)} maxLength={500} placeholder={ui.placeholder} className="min-h-11 min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35 focus:border-gold-300 focus:outline-none" />
        <button type="submit" disabled={busy || q.trim().length < 2} className="btn btn-gold min-h-11 shrink-0 px-4 text-[0.7rem] sm:px-5">{ui.send}</button>
      </form>
    </div>
  );
}
