"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AcademyNav({ base, name, label, items }: { base: string; name: string; label: string; items: { href: string; label: string }[] }) {
  const path = usePathname();
  return (
    <div className="border-b border-white/[0.07] bg-[#0b0b0b]">
      <div className="mx-auto flex max-w-7xl flex-col px-5 sm:flex-row sm:items-center sm:gap-6 sm:px-8">
        <Link href={base} className="display shrink-0 pt-3 text-lg text-gold-shine sm:py-3">{name}</Link>
        <nav aria-label={label} className="-mx-5 min-w-0 overflow-x-auto px-3 sm:mx-0 sm:flex-1 sm:px-0">
          <ul className="flex w-max items-center gap-1 py-2 sm:ml-auto">
            {items.map((i) => {
              const active = i.href === base ? !items.some((x) => x.href !== base && path.startsWith(x.href)) : path.startsWith(i.href);
              return (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    aria-current={active ? "page" : undefined}
                    className={`block whitespace-nowrap rounded-full px-3.5 py-2 text-[0.72rem] font-medium tracking-[0.08em] transition ${active ? "bg-white/10 text-gold-200" : "text-white/65 hover:text-white"}`}
                  >
                    {i.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
