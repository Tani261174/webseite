"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { newsletterSchema } from "@/lib/validation";
import { useSubmit, FormStatus, type FormMessages } from "./useSubmit";

interface Labels {
  placeholder: string; label: string; button: string; consent: string; privacyLink: string;
}

export function NewsletterForm({ locale, labels, messages, privacyHref }: {
  locale: Locale;
  labels: Labels;
  messages: FormMessages & { invalidEmail: string; consentRequired: string; newsletterSuccess: string };
  privacyHref: string;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  const { state, submit } = useSubmit("/api/newsletter", messages, messages.newsletterSuccess);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const website = String(new FormData(e.currentTarget).get("website") || "");
    const result = newsletterSchema.safeParse({ email, consent, locale, website });
    if (!result.success) {
      const f = new Set(result.error.issues.map((i) => String(i.path[0])));
      setErrors({ email: f.has("email") ? messages.invalidEmail : undefined, consent: f.has("consent") ? messages.consentRequired : undefined });
      return;
    }
    setErrors({});
    submit(result.data);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">{labels.label}</label>
        <input id={`${id}-email`} type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder={labels.placeholder} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-err` : undefined}
          className="field !h-14 !rounded-full !border-white/15 !bg-white/5 !px-6 !text-white placeholder:!text-white/40" />
        <button type="submit" className="btn btn-gold h-14 shrink-0" disabled={state.status === "loading"}>
          {state.status === "loading" ? messages.sending : labels.button}
        </button>
      </div>
      {errors.email ? <p id={`${id}-email-err`} className="px-2 text-sm text-red-300">{errors.email}</p> : null}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex items-start gap-3 px-2 text-sm text-white/60">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={!!errors.consent}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#c09840]" />
        <span>
          {labels.consent}{" "}
          <Link href={privacyHref} className="text-gold-200 underline decoration-gold-400/50 underline-offset-4 hover:text-gold-100">{labels.privacyLink}</Link>
        </span>
      </label>
      {errors.consent ? <p className="px-2 text-sm text-red-300">{errors.consent}</p> : null}
      <FormStatus state={state} />
    </form>
  );
}
