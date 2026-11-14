import Link from "next/link";
import { adminUi } from "@/academy/admin-ui";
import { AdminLangSwitch, resolveAdminLocale } from "@/components/admin/AdminLang";

/**
 * Admin-Dashboard – Architektur-Gerüst.
 * Erreichbar nur, wenn ADMIN_USER/ADMIN_PASSWORD gesetzt sind (siehe middleware.ts).
 * Für den Livebetrieb empfohlen: Cloudflare Access (Zero Trust) vor /admin schalten.
 */
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = await resolveAdminLocale(searchParams);
  const a = adminUi(locale);
  return (
    <main lang={locale} className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="eyebrow text-gold-600">{a.home.eyebrow}</p>
        <AdminLangSwitch locale={locale} path="/admin" label={a.langLabel} />
      </div>
      <h1 className="display mt-3 text-5xl">{a.home.title}</h1>
      <p className="mt-4 max-w-2xl text-graphite">{a.home.text}</p>
      <Link href={`/admin/academia?lang=${locale}`} className="mt-10 flex items-center justify-between rounded-2xl bg-ink p-6 text-white transition hover:shadow-[var(--shadow-gold)]">
        <span><span className="eyebrow block text-gold-300">Academia NexusIA Digital</span><span className="display mt-1 block text-3xl">{a.home.academy}</span></span>
      </Link>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {a.home.modules.map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-mist bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{title}</h2>
              <span className="rounded-full bg-pearl px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-graphite">{a.home.planned}</span>
            </div>
            <p className="mt-2 text-sm text-graphite">{text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
