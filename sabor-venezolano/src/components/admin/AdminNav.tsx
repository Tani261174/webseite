"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav({ links }: { links: { href: string; label: string; badge?: number }[] }) {
  const path = usePathname() || "";
  return (
    <nav aria-label="Admin" className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
      {links.map((l) => {
        const active = l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center justify-between gap-2 rounded-md px-4 py-2.5 text-sm font-semibold whitespace-nowrap ${
              active ? "bg-ink text-white" : "text-ink-soft hover:bg-ink/5"
            }`}
          >
            {l.label}
            {l.badge ? (
              <span className={`rounded-full px-2 text-xs ${active ? "bg-white text-ink" : "bg-ink text-white"}`}>{l.badge}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

/** Hält die aktuelle Seite fest, damit der Sprachwechsel dorthin zurückführt. */
export function BackInput() {
  const path = usePathname() || "/admin";
  return <input type="hidden" name="back" value={path} />;
}
