"use client";
import { useState } from "react";

export type SubmitState = { status: "idle" | "loading" | "success" | "info" | "error"; message?: string; fields?: string[] };

export interface FormMessages {
  sending: string;
  rateLimited: string;
  notConfigured: string;
  error: string;
}

export function useSubmit(endpoint: string, m: FormMessages, successMessage: string) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function submit(payload: Record<string, unknown>) {
    setState({ status: "loading", message: m.sending });
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: string[] };
      if (res.ok) return setState({ status: "success", message: successMessage });
      if (data.error === "not_configured") return setState({ status: "info", message: m.notConfigured });
      if (res.status === 429) return setState({ status: "error", message: m.rateLimited });
      if (data.error === "invalid") return setState({ status: "error", message: m.error, fields: data.fields });
      setState({ status: "error", message: m.error });
    } catch {
      setState({ status: "error", message: m.error });
    }
  }
  return { state, setState, submit };
}

export function FormStatus({ state }: { state: SubmitState }) {
  if (state.status === "idle" || !state.message) return null;
  const tone =
    state.status === "success" ? "border-emerald-700/30 bg-emerald-50 text-emerald-900"
    : state.status === "info" ? "border-gold-300/70 bg-gold-50 text-gold-700"
    : state.status === "error" ? "border-red-700/30 bg-red-50 text-red-800"
    : "border-mist bg-pearl text-graphite";
  return (
    <p role={state.status === "error" ? "alert" : "status"} aria-live="polite" className={`rounded-xl border px-4 py-3 text-sm ${tone}`}>
      {state.message}
    </p>
  );
}
