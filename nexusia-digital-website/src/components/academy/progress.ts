"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Lernfortschritt – vorerst nur im Browser (localStorage).
 * Sobald Konten aktiv sind, wird derselbe Datensatz in D1 (Tabelle `progress`) gespeichert.
 */
const KEY = "nexusia-academy-progress-v1";
const EVT = "nexusia-academy-progress";

export type LessonProgress = { done?: boolean; quiz?: number; quizTotal?: number; at: number };
export type ProgressMap = Record<string, Record<string, LessonProgress>>;

let cache: ProgressMap | null = null;
const EMPTY: ProgressMap = {};

function read(): ProgressMap {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || "{}");
    cache = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as ProgressMap) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: ProgressMap) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* Speicher nicht verfügbar */ }
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = null; cb(); } };
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", onStorage);
  return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", onStorage); };
}

export function useProgress() {
  const data = useSyncExternalStore(subscribe, read, () => EMPTY);
  const update = useCallback((course: string, lesson: string, patch: Partial<LessonProgress>) => {
    const cur = read();
    write({ ...cur, [course]: { ...(cur[course] || {}), [lesson]: { ...(cur[course]?.[lesson] || {}), ...patch, at: Date.now() } } });
  }, []);
  const reset = useCallback(() => write({}), []);
  return { data, update, reset };
}
