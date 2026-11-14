import "server-only";
/**
 * NexusTutor AI – Lernassistent.
 * Modus 1 (aktiv, kostenlos): Antworten aus dem geprüften Glossar + passende Lektionen aus dem Lehrplan.
 * Modus 2 (vorbereitet): Wenn GEMINI_API_KEY als Secret gesetzt ist, formuliert Google Gemini die Antwort –
 *   aber NUR auf Grundlage der hier gefundenen, geprüften Inhalte (Retrieval-Augmented Generation).
 * Der Schlüssel bleibt ausschließlich auf dem Server.
 */
import type { Locale } from "@/lib/i18n/config";
import { glossary, type GlossaryEntry } from "./glossary";
import { listCourses, flatLessons } from "./repository";
import type { Course, LessonBody } from "./types";

export interface TutorSource { course: string; courseTitle: string; lesson: string; title: string; ready: boolean; free: boolean }
export interface TutorAnswer { answer: string; sources: TutorSource[]; mode: "local" | "ai" }

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9äöüß\s-]/g, " ");
const STOP = new Set("de la el los las un una y o en con para por que como del al es se mi tu su lo que der die das und oder mit fur ein eine ist wie was the a an and or of to in on for with is what how do i me my".split(" "));
const words = (s: string) => norm(s).split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

const L = {
  es: {
    none: "No he encontrado ese tema en los contenidos revisados de la academia. Prueba con otras palabras (por ejemplo «afiliados», «FBA», «KDP», «embudo» o «margen») o explora el temario de los cursos.",
    lessons: "Para profundizar, te recomiendo estas lecciones:",
    exercise: "Para el ejercicio de la lección, ve paso a paso:",
    exerciseEnd: "No hay respuestas incorrectas: lo importante es que la decisión sea honesta con tu situación.",
    motivate: ["Paso a paso se llega lejos. ¡Sigue así!", "Preguntar es la mejor forma de aprender.", "Lo importante es avanzar con constancia, no con prisa."],
  },
  de: {
    none: "Dazu habe ich in den geprüften Inhalten der Akademie nichts gefunden. Versuch es mit anderen Worten (z. B. „Affiliate“, „FBA“, „KDP“, „Funnel“ oder „Marge“) oder stöbere im Lehrplan der Kurse.",
    lessons: "Zum Vertiefen empfehle ich dir diese Lektionen:",
    exercise: "Für die Übung der Lektion gehst du Schritt für Schritt vor:",
    exerciseEnd: "Es gibt keine falschen Antworten – wichtig ist, dass die Entscheidung ehrlich zu deiner Situation passt.",
    motivate: ["Schritt für Schritt kommst du weit. Bleib dran!", "Fragen ist der beste Weg zu lernen.", "Wichtig ist, beständig voranzukommen – nicht schnell."],
  },
  en: {
    none: "I couldn't find that topic in the academy's reviewed content. Try other words (e.g. “affiliate”, “FBA”, “KDP”, “funnel” or “margin”) or explore the course curricula.",
    lessons: "To go deeper, I recommend these lessons:",
    exercise: "For the lesson exercise, go step by step:",
    exerciseEnd: "There are no wrong answers – what matters is that your decision is honest about your situation.",
    motivate: ["Step by step gets you far. Keep going!", "Asking is the best way to learn.", "What matters is steady progress, not speed."],
  },
};

function matchGlossary(q: string): GlossaryEntry[] {
  const nq = ` ${norm(q)} `;
  return glossary
    .map((g) => ({ g, score: Math.max(0, ...g.aliases.map((a) => (nq.includes(` ${norm(a)} `) || nq.includes(` ${norm(a)}s `) ? norm(a).length : 0))) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => x.g);
}

function matchLessons(q: string, courses: Course[], locale: Locale, hint?: string): TutorSource[] {
  const qw = words(q);
  if (!qw.length) return [];
  const scored: { s: TutorSource; score: number }[] = [];
  for (const c of courses) {
    const kw = c.keywords.map(norm);
    const courseHit = qw.filter((w) => kw.some((k) => k.includes(w) || w.includes(k))).length;
    for (const { lesson, module } of flatLessons(c)) {
      const text = norm(`${Object.values(lesson.title).join(" ")} ${Object.values(module.title).join(" ")}`);
      const hits = qw.filter((w) => text.includes(w)).length;
      let score = hits * 3 + courseHit;
      if (lesson.status === "ready") score += 1.5;
      if (hint && c.slug === hint) score += 1;
      if (hits > 0 || courseHit > 0) scored.push({ score, s: { course: c.slug, courseTitle: c.title[locale], lesson: lesson.slug, title: lesson.title[locale], ready: lesson.status === "ready", free: lesson.access === "preview" } });
    }
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 3).map((x) => x.s);
}

function sampleExercise(courses: Course[]): LessonBody | undefined {
  for (const c of courses) for (const { lesson } of flatLessons(c)) if (lesson.body?.blocks.some((b) => b.type === "exercise")) return lesson.body;
}

export async function askTutor(question: string, locale: Locale, courseHint?: string): Promise<TutorAnswer> {
  const courses = await listCourses();
  const l = L[locale];
  const terms = matchGlossary(question);
  const sources = matchLessons(question, courses, locale, courseHint);
  const wantsExercise = /ejercicio|ubung|übung|exercise|tarea|aufgabe/i.test(question);
  const body = wantsExercise ? sampleExercise(courses) : undefined;

  // Lektionen aus Glossarverweisen ergänzen
  for (const g of terms) {
    if (!g.lesson || sources.some((s) => s.course === g.lesson![0] && s.lesson === g.lesson![1])) continue;
    const c = courses.find((x) => x.slug === g.lesson![0]);
    const f = c && flatLessons(c).find((x) => x.lesson.slug === g.lesson![1]);
    if (c && f) sources.unshift({ course: c.slug, courseTitle: c.title[locale], lesson: f.lesson.slug, title: f.lesson.title[locale], ready: f.lesson.status === "ready", free: f.lesson.access === "preview" });
  }
  const top = sources.slice(0, 3);

  const parts: string[] = [];
  for (const g of terms) parts.push(`${g.term[locale]}: ${g.def[locale]}`);
  if (body) {
    const ex = body.blocks.find((b) => b.type === "exercise");
    if (ex && ex.type === "exercise") parts.push(`${l.exercise}\n${ex.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n${l.exerciseEnd}`);
  }

  if (process.env.GEMINI_API_KEY && (parts.length || top.length)) {
    const ai = await askGemini(question, locale, parts, top).catch(() => null);
    if (ai) return { answer: ai, sources: top, mode: "ai" };
  }

  if (!parts.length && !top.length) return { answer: l.none, sources: [], mode: "local" };
  if (top.length) parts.push(l.lessons);
  else parts.push(l.motivate[question.length % l.motivate.length]);
  return { answer: parts.join("\n\n"), sources: top, mode: "local" };
}

/** Vorbereitete Gemini-Anbindung (REST). Nur aktiv mit GEMINI_API_KEY. Modell über GEMINI_MODEL wählbar. */
async function askGemini(question: string, locale: Locale, facts: string[], sources: TutorSource[]) {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const lang = { es: "español", de: "Deutsch", en: "English" }[locale];
  const context = [...facts, ...sources.map((s) => `Lección recomendada: «${s.title}» (curso: ${s.courseTitle}${s.ready ? "" : ", próximamente"})`)].join("\n");
  const system = `Eres NexusTutor AI, el asistente de aprendizaje de Academia NexusIA Digital. Responde en ${lang}, de forma clara, breve y motivadora. Usa EXCLUSIVAMENTE la información del CONTEXTO. Si no basta, dilo con honestidad y recomienda consultar las fuentes oficiales de la plataforma. Nunca prometas ingresos ni resultados. No inventes cifras, tarifas ni condiciones. Texto plano, sin HTML.`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: `CONTEXTO:\n${context}\n\nPREGUNTA:\n${question}` }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim();
    return text ? text.slice(0, 3000) : null;
  } finally {
    clearTimeout(timer);
  }
}
