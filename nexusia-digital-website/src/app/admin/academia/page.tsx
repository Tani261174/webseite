import Link from "next/link";
import { listCourses, courseStats, flatLessons } from "@/academy/repository";
import { coupons, formatPrice } from "@/academy/pricing";
import { adminUi } from "@/academy/admin-ui";
import { AdminLangSwitch, resolveAdminLocale } from "@/components/admin/AdminLang";
import { CourseEditor } from "./CourseEditor";

/**
 * Admin · Akademie. Geschützt über middleware.ts (ADMIN_USER / ADMIN_PASSWORD).
 * Lesen funktioniert bereits (Kurse aus dem Code-Katalog). Schreiben braucht Cloudflare D1.
 */
export default async function AdminAcademy({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = await resolveAdminLocale(searchParams);
  const a = adminUi(locale).academy;
  const courses = await listCourses({ includeDrafts: true });
  return (
    <main lang={locale} className="mx-auto max-w-6xl space-y-14 px-6 py-14">
      <header>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href={`/admin?lang=${locale}`} className="text-xs uppercase tracking-[0.18em] text-graphite hover:text-ink">{a.back}</Link>
          <AdminLangSwitch locale={locale} path="/admin/academia" label={adminUi(locale).langLabel} />
        </div>
        <p className="eyebrow mt-6 text-gold-600">Academia NexusIA Digital</p>
        <h1 className="display mt-3 text-5xl">{a.title}</h1>
        <div role="note" className="mt-6 rounded-2xl border border-gold-300/60 bg-gold-50 p-5 text-sm text-gold-700">
          <strong>{a.statusNote}</strong> {a.statusText}
        </div>
      </header>

      <section>
        <h2 className="display text-3xl">{a.courses} ({courses.length})</h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-mist bg-white">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-mist bg-pearl text-xs uppercase tracking-wider text-graphite">
              <tr>{a.cols.map((c, i) => <th key={i} className="px-4 py-3">{c}</th>)}</tr>
            </thead>
            <tbody>
              {courses.map((c) => {
                const s = courseStats(c);
                const ls = flatLessons(c).map((x) => x.lesson);
                const videos = ls.filter((l) => l.video).length;
                const files = ls.reduce((n, l) => n + (l.downloads?.length || 0), 0);
                const ex = ls.filter((l) => l.body?.es?.blocks.some((b) => b.type === "exercise")).length;
                const qz = ls.filter((l) => l.body?.es?.quiz?.length).length;
                return (
                  <tr key={c.slug} className="border-b border-mist last:border-0">
                    <td className="px-4 py-3 text-graphite">{c.order}</td>
                    <td className="px-4 py-3 font-medium">{c.title[locale]}</td>
                    <td className="px-4 py-3">{a.status[c.status]}</td>
                    <td className="px-4 py-3">{s.modules}</td>
                    <td className="px-4 py-3">{s.lessons} ({s.ready})</td>
                    <td className="px-4 py-3">{videos}</td>
                    <td className="px-4 py-3">{files}</td>
                    <td className="px-4 py-3">{ex} / {qz}</td>
                    <td className="px-4 py-3">{c.brand ? <a href={c.brand.logo.terms} target="_blank" rel="noopener" title={c.brand.logo.note[locale]} className={c.brand.logo.status === "approved" ? "text-emerald-700" : "text-gold-700"}>{c.brand.logo.status === "approved" ? a.approved : a.pending}</a> : a.ownMotif}</td>
                    <td className="px-4 py-3">{c.priceCents ? `${formatPrice(c.priceCents, locale)}${c.priceIsExample ? ` ${a.example}` : ""}` : "—"}</td>
                    <td className="px-4 py-3"><a href={`/${locale}/academia/${c.slug}`} target="_blank" rel="noopener" className="text-gold-700 underline underline-offset-4">{a.view}</a></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="display text-3xl">{a.logosTitle}</h2>
        <p className="mt-2 max-w-3xl text-sm text-graphite">{a.logosText}</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {courses.filter((c) => c.brand).map((c) => (
            <li key={c.slug} className="rounded-xl border border-mist bg-white p-4 text-sm">
              <div className="flex items-center justify-between gap-3"><strong>{c.brand!.name}</strong><span className="rounded-full bg-gold-50 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-gold-700">{c.brand!.logo.status === "approved" ? a.approved : a.pendingLong}</span></div>
              <p className="mt-2 text-graphite">{c.brand!.logo.note[locale]}</p>
              <a href={c.brand!.logo.terms} target="_blank" rel="noopener" className="mt-2 inline-block text-xs text-gold-700 underline underline-offset-4">{a.guideline}</a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="display text-3xl">{a.newTitle}</h2>
        <p className="mt-2 text-sm text-graphite">{a.newText}</p>
        <div className="mt-5"><CourseEditor t={adminUi(locale).editor} /></div>
      </section>

      <section>
        <h2 className="display text-3xl">{a.couponsTitle}</h2>
        <ul className="mt-5 space-y-2">
          {coupons.map((c) => (
            <li key={c.code} className="flex flex-wrap items-center gap-3 rounded-xl border border-mist bg-white px-4 py-3 text-sm">
              <code className="font-semibold">{c.code}</code>
              <span>{c.percentOff ? `${c.percentOff} %` : c.amountOffCents ? formatPrice(c.amountOffCents, locale) : ""}</span>
              <span className="text-graphite">{c.courses?.length ? c.courses.join(", ") : a.allCourses}</span>
              {c.demo ? <span className="rounded-full bg-pearl px-2 py-0.5 text-[0.65rem] uppercase tracking-wider">{a.testCoupon}</span> : null}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-graphite">{a.couponsNote}</p>
      </section>

      <section>
        <h2 className="display text-3xl">{a.moreTitle}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {a.planned.map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-mist bg-white p-5">
              <div className="flex items-center justify-between"><h3 className="font-semibold">{title}</h3><span className="rounded-full bg-pearl px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-graphite">{a.needsDb}</span></div>
              <p className="mt-2 text-sm text-graphite">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
