import { cookies } from "next/headers";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { adminLocale } from "@/academy/admin-ui";

/** Sprache des Admin-Bereichs: ?lang= → Cookie NEXT_LOCALE (Website-Sprache) → Deutsch */
export async function resolveAdminLocale(searchParams: Promise<{ lang?: string }>) {
  const { lang } = await searchParams;
  return adminLocale(lang, (await cookies()).get("NEXT_LOCALE")?.value);
}

export function AdminLangSwitch({ locale, path, label }: { locale: Locale; path: string; label: string }) {
  return (
    <nav aria-label={label} className="flex gap-1.5">
      {locales.map((l) => (
        <a key={l} href={`${path}?lang=${l}`} hrefLang={l} lang={l} aria-current={l === locale ? "true" : undefined}
          className={`rounded-full px-3 py-1.5 text-[0.7rem] font-semibold tracking-[0.18em] ${l === locale ? "bg-ink text-gold-200" : "border border-mist text-graphite hover:border-gold-300"}`}>
          {localeNames[l].short}
        </a>
      ))}
    </nav>
  );
}
