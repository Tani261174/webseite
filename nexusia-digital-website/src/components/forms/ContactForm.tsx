"use client";

import { useId, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { contactSchema } from "@/lib/validation";
import { useSubmit, FormStatus, type FormMessages } from "./useSubmit";

interface Labels { name: string; email: string; subject: string; message: string; consent: string; button: string }
type Msgs = FormMessages & { invalidEmail: string; invalidName: string; invalidMessage: string; consentRequired: string; success: string };

export function ContactForm({ locale, labels, messages, requiredLabel }: { locale: Locale; labels: Labels; messages: Msgs; requiredLabel: string }) {
  const id = useId();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, submit } = useSubmit("/api/contact", messages, messages.success);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") || ""),
      locale,
    };
    const result = contactSchema.safeParse(payload);
    if (!result.success) {
      const map: Record<string, string> = { name: messages.invalidName, email: messages.invalidEmail, message: messages.invalidMessage, consent: messages.consentRequired };
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const k = String(issue.path[0]);
        if (map[k]) next[k] = map[k];
      }
      setErrors(next);
      return;
    }
    setErrors({});
    submit(result.data);
  }

  const field = (name: "name" | "email" | "subject", type = "text", autoComplete?: string, required = true) => (
    <div>
      <label htmlFor={`${id}-${name}`} className="mb-2 block text-sm font-medium">
        {labels[name]} {required ? <span className="text-gold-600" title={requiredLabel}>*</span> : null}
      </label>
      <input id={`${id}-${name}`} name={name} type={type} autoComplete={autoComplete} required={required} maxLength={name === "email" ? 200 : 150}
        aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${id}-${name}-err` : undefined} className="field" />
      {errors[name] ? <p id={`${id}-${name}-err`} className="mt-1.5 text-sm text-red-700">{errors[name]}</p> : null}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "text", "name")}
        {field("email", "email", "email")}
      </div>
      {field("subject", "text", undefined, false)}
      <div>
        <label htmlFor={`${id}-message`} className="mb-2 block text-sm font-medium">
          {labels.message} <span className="text-gold-600" title={requiredLabel}>*</span>
        </label>
        <textarea id={`${id}-message`} name="message" rows={6} required maxLength={5000} aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${id}-message-err` : undefined} className="field resize-y" />
        {errors.message ? <p id={`${id}-message-err`} className="mt-1.5 text-sm text-red-700">{errors.message}</p> : null}
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex items-start gap-3 text-sm text-graphite">
        <input type="checkbox" name="consent" aria-invalid={!!errors.consent} className="mt-0.5 h-4 w-4 shrink-0 accent-[#c09840]" />
        <span>{labels.consent}</span>
      </label>
      {errors.consent ? <p className="text-sm text-red-700">{errors.consent}</p> : null}
      <button type="submit" className="btn btn-dark w-full sm:w-auto" disabled={state.status === "loading"}>
        {state.status === "loading" ? messages.sending : labels.button}
      </button>
      <FormStatus state={state} />
    </form>
  );
}
