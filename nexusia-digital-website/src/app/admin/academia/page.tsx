import Link from "next/link";
import { listCourses, courseStats, flatLessons } from "@/academy/repository";
import { coupons, formatPrice } from "@/academy/pricing";
import { CourseEditor } from "./CourseEditor";

/**
 * Admin · Akademie. Geschützt über middleware.ts (ADMIN_USER / ADMIN_PASSWORD).
 * Lesen funktioniert bereits (Kurse aus dem Code-Katalog). Schreiben braucht Cloudflare D1.
 */
const planned: [string, string][] = [
  ["Module & Lektionen", "Module anlegen, Lektionen sortieren, Inhalte als Blöcke (Text, Beispiel, Übung, Tabelle) bearbeiten"],
  ["Videos", "Upload nach Cloudflare R2/Stream oder YouTube-/Vimeo-Link je Lektion"],
  ["E-Books & Dateien", "PDF, EPUB, Arbeitsblätter, Checklisten – privat in R2, Auslieferung über signierte Links"],
  ["Quiz & Zertifikate", "Quizfragen je Lektion, Zertifikatsvorlage, automatische Ausstellung bei Kursabschluss"],
  ["Nutzer", "Konten, Rollen (Admin / Teilnehmer), Zugänge manuell freischalten oder sperren"],
  ["Verkäufe", "Bestellungen, Zahlungsstatus (PayPal / Stripe), Rückerstattungen, Kurspakete"],
  ["Lernfortschritt", "Fortschritt und Quiz-Ergebnisse je Kurs und Teilnehmer:in"],
];

export default async function AdminAcademy() {
  const courses = await listCourses({ includeDrafts: true });
  const statusLabel = { draft: "Entwurf", soon: "Próximamente", open: "Im Verkauf" } as const;
  return (
    <main className="mx-auto max-w-6xl space-y-14 px-6 py-14">
      <header>
        <Link href="/admin" className="text-xs uppercase tracking-[0.18em] text-graphite hover:text-ink">← Admin</Link>
        <p className="eyebrow mt-6 text-gold-600">Academia NexusIA Digital</p>
        <h1 className="display mt-3 text-5xl">Akademie verwalten</h1>
        <div role="note" className="mt-6 rounded-2xl border border-gold-300/60 bg-gold-50 p-5 text-sm text-gold-700">
          <strong>Status: vorbereitet.</strong> Die Kursliste wird live gelesen. Speichern, Hochladen, Nutzer- und Verkaufsdaten
          werden aktiv, sobald die Datenbank (Cloudflare D1) und der Dateispeicher (R2) verbunden sind. Bis dahin wird nichts gespeichert.
        </div>
      </header>

      <section>
        <h2 className="display text-3xl">Kurse ({courses.length})</h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-mist bg-white">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-mist bg-pearl text-xs uppercase tracking-wider text-graphite">
              <tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Kurs</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Module</th><th className="px-4 py-3">Lektionen (fertig)</th><th className="px-4 py-3">Videos</th><th className="px-4 py-3">Dateien</th><th className="px-4 py-3">Übung / Quiz</th><th className="px-4 py-3">Logo</th><th className="px-4 py-3">Preis</th><th className="px-4 py-3" /></tr>
            </thead>
            <tbody>
              {courses.map((c) => {
                const s = courseStats(c);
                const ls = flatLessons(c).map((x) => x.lesson);
                const videos = ls.filter((l) => l.video).length;
                const files = ls.reduce((n, l) => n + (l.downloads?.length || 0), 0);
                const ex = ls.filter((l) => l.body?.blocks.some((b) => b.type === "exercise")).length;
                const qz = ls.filter((l) => l.body?.quiz?.length).length;
                return (
                  <tr key={c.slug} className="border-b border-mist last:border-0">
                    <td className="px-4 py-3 text-graphite">{c.order}</td>
                    <td className="px-4 py-3 font-medium">{c.title.es}</td>
                    <td className="px-4 py-3">{statusLabel[c.status]}</td>
                    <td className="px-4 py-3">{s.modules}</td>
                    <td className="px-4 py-3">{s.lessons} ({s.ready})</td>
                    <td className="px-4 py-3">{videos}</td>
                    <td className="px-4 py-3">{files}</td>
                    <td className="px-4 py-3">{ex} / {qz}</td>
                    <td className="px-4 py-3">{c.brand ? <a href={c.brand.logo.terms} target="_blank" rel="noopener" title={c.brand.logo.note} className={c.brand.logo.status === "approved" ? "text-emerald-700" : "text-gold-700"}>{c.brand.logo.status === "approved" ? "freigegeben" : "ausstehend"}</a> : "eigenes Motiv"}</td>
                    <td className="px-4 py-3">{c.priceCents ? `${formatPrice(c.priceCents, "de")}${c.priceIsExample ? " (Beispiel)" : ""}` : "—"}</td>
                    <td className="px-4 py-3"><a href={`/es/academia/${c.slug}`} target="_blank" rel="noopener" className="text-gold-700 underline underline-offset-4">Ansehen</a></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="display text-3xl">Plattform-Logos</h2>
        <p className="mt-2 max-w-3xl text-sm text-graphite">Originallogos werden erst angezeigt, wenn eine schriftliche Freigabe vorliegt. Bis dahin zeigt jede Karte eine neutrale Textkarte mit dem Plattformnamen als reinem Text.</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {courses.filter((c) => c.brand).map((c) => (
            <li key={c.slug} className="rounded-xl border border-mist bg-white p-4 text-sm">
              <div className="flex items-center justify-between gap-3"><strong>{c.brand!.name}</strong><span className="rounded-full bg-gold-50 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-gold-700">{c.brand!.logo.status === "approved" ? "freigegeben" : "Freigabe ausstehend"}</span></div>
              <p className="mt-2 text-graphite">{c.brand!.logo.note}</p>
              <a href={c.brand!.logo.terms} target="_blank" rel="noopener" className="mt-2 inline-block text-xs text-gold-700 underline underline-offset-4">Richtlinie / Kontakt</a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="display text-3xl">Neuen Kurs anlegen</h2>
        <p className="mt-2 text-sm text-graphite">Pflicht ist die spanische Fassung; Deutsch und Englisch können später ergänzt werden.</p>
        <div className="mt-5"><CourseEditor /></div>
      </section>

      <section>
        <h2 className="display text-3xl">Gutscheine</h2>
        <ul className="mt-5 space-y-2">
          {coupons.map((c) => (
            <li key={c.code} className="flex flex-wrap items-center gap-3 rounded-xl border border-mist bg-white px-4 py-3 text-sm">
              <code className="font-semibold">{c.code}</code>
              <span>{c.percentOff ? `${c.percentOff} %` : c.amountOffCents ? formatPrice(c.amountOffCents, "de") : ""}</span>
              <span className="text-graphite">{c.courses?.length ? c.courses.join(", ") : "alle Kurse"}</span>
              {c.demo ? <span className="rounded-full bg-pearl px-2 py-0.5 text-[0.65rem] uppercase tracking-wider">Testgutschein</span> : null}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-graphite">Neue Gutscheine anlegen: verfügbar mit Datenbank (Tabelle <code>coupons</code>).</p>
      </section>

      <section>
        <h2 className="display text-3xl">Weitere Bereiche</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {planned.map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-mist bg-white p-5">
              <div className="flex items-center justify-between"><h3 className="font-semibold">{title}</h3><span className="rounded-full bg-pearl px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-graphite">braucht Datenbank</span></div>
              <p className="mt-2 text-sm text-graphite">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
