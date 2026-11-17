"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Icon } from "../ui/Icon";
import { useI18n } from "../providers/I18nProvider";

export function ContactForm({ token }: { token: string }) {
  const { locale, t } = useI18n();
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");
  const [field, setField] = useState<string | null>(null);
  const hp = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError("");
    setField(null);
    setState("busy");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          name: String(f.get("name") || ""),
          contact: String(f.get("contact") || ""),
          message: String(f.get("message") || ""),
          consent: f.get("consent") === "on",
          token,
          website: hp.current?.value || "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setState("done");
        return;
      }
      const key = String(data.error || "generic");
      setError((t.errors as Record<string, string>)[key] || t.errors.generic);
      setField({ nameRequired: "name", contactRequired: "contact", messageRequired: "message", consentRequired: "consent" }[key] ?? null);
    } catch {
      setError(t.errors.generic);
    }
    setState("idle");
  }

  if (state === "done") {
    return (
      <div className="flex items-start gap-3 rounded-md bg-paper p-5 text-ink" role="status">
        <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="font-semibold">{t.contact.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="c-name" className="mb-1.5 block text-sm font-bold">{t.contact.name} *</label>
        <input id="c-name" name="name" className="field" autoComplete="name" maxLength={80} required aria-invalid={field === "name"} />
      </div>
      <div>
        <label htmlFor="c-contact" className="mb-1.5 block text-sm font-bold">{t.contact.contact} *</label>
        <input id="c-contact" name="contact" className="field" autoComplete="email" maxLength={120} required aria-invalid={field === "contact"} />
      </div>
      <div>
        <label htmlFor="c-message" className="mb-1.5 block text-sm font-bold">{t.contact.message} *</label>
        <textarea id="c-message" name="message" className="field min-h-36" maxLength={2000} rows={5} required aria-invalid={field === "message"} />
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" ref={hp} tabIndex={-1} autoComplete="off" />
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
        <input type="checkbox" name="consent" className="mt-1 h-5 w-5 shrink-0 accent-[#2e2e31]" aria-invalid={field === "consent"} />
        <span>
          {t.contact.consent}{" "}
          <Link href={`/${locale}/legal/privacidad`} className="text-ink underline underline-offset-2" target="_blank">
            {t.cart.privacy}
          </Link>
          .
        </span>
      </label>
      {error ? (
        <p className="rounded-md bg-danger/10 p-4 text-sm font-semibold text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary w-full" disabled={state === "busy"}>
        <Icon name="mail" className="h-5 w-5" /> {state === "busy" ? t.contact.sending : t.contact.submit}
      </button>
    </form>
  );
}
