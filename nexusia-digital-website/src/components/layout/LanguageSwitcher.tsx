"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { Icon } from "@/components/ui/Icon";

function swapLocale(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  parts[1] = to;
  return parts.join("/") || `/${to}`;
}

export function LanguageSwitcher({ locale, label, variant = "dropdown" }: { locale: Locale; label: string; variant?: "dropdown" | "inline" }) {
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  if (variant === "inline") {
    return (
      <nav aria-label={label} className="flex gap-2">
        {locales.map((l) => (
          <Link key={l} href={swapLocale(pathname, l)} hrefLang={l} lang={l} aria-current={l === locale ? "true" : undefined}
            className={`rounded-full px-4 py-2 text-xs font-semibold tracking-[0.2em] transition ${l === locale ? "bg-gold text-ink" : "border border-white/20 text-white/80 hover:border-gold-300 hover:text-gold-200"}`}>
            {localeNames[l].short}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open} aria-label={label}
        className="flex h-10 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs font-semibold tracking-[0.18em] text-white/85 transition hover:border-gold-300/70 hover:text-gold-200">
        <Icon name="globe" className="h-4 w-4" />
        {localeNames[locale].short}
        <Icon name="chevron" className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`absolute right-0 top-12 w-48 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-ink-soft/95 p-1.5 shadow-2xl backdrop-blur-xl transition duration-300 ${open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}>
        <ul role="listbox" aria-label={label}>
          {locales.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <Link href={swapLocale(pathname, l)} hrefLang={l} lang={l} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${l === locale ? "text-gold-200" : "text-white/80 hover:bg-white/5 hover:text-white"}`}>
                <span>{localeNames[l].native}</span>
                <span className="text-[0.65rem] tracking-[0.2em] text-white/40">{localeNames[l].short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
