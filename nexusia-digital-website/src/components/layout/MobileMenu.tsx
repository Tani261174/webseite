"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";

export function MobileMenu({
  locale, items, labels,
}: {
  locale: Locale;
  items: { href: string; label: string }[];
  labels: { open: string; close: string; language: string };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.documentElement.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setOpen(true)} aria-label={labels.open} aria-expanded={open} aria-controls="mobile-menu"
        className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold-300/70">
        <Icon name="menu" />
      </button>
      <div id="mobile-menu" role="dialog" aria-modal="true" aria-label={labels.open}
        className={`bg-noir fixed inset-0 z-[60] flex flex-col px-6 pb-10 pt-5 transition duration-500 ease-[var(--ease-lux)] ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="flex justify-end">
          <button type="button" onClick={() => setOpen(false)} aria-label={labels.close}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white">
            <Icon name="close" />
          </button>
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {items.map((it, i) => (
            <Link key={it.href} href={it.href} tabIndex={open ? 0 : -1}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              className={`display border-b border-white/10 py-4 text-4xl text-white transition duration-700 hover:text-gold-200 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
              {it.label}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher locale={locale} label={labels.language} variant="inline" />
      </div>
    </div>
  );
}
