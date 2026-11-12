/**
 * Admin-Dashboard – Architektur-Gerüst.
 * Erreichbar nur, wenn ADMIN_USER/ADMIN_PASSWORD gesetzt sind (siehe middleware.ts).
 * Für den Livebetrieb empfohlen: Cloudflare Access (Zero Trust) vor /admin schalten.
 */
const modules = [
  ["Produkte", "Anlegen, bearbeiten, Status (Verfügbar / Demnächst / Kostenlos)"],
  ["Bilder", "Upload nach Cloudflare R2 bzw. Cloudflare Images"],
  ["Preise", "Preise in EUR, später Abo-Modelle für NexusStock"],
  ["Kategorien", "Kategorien und Marken verwalten"],
  ["Digitale Dateien", "Private Dateien in R2, Auslieferung nur über signierte Links"],
  ["Bestellungen", "Bestellungen aus D1, PayPal-Status, Rückerstattungen"],
  ["Mehrsprachige Inhalte", "Texte DE / ES / EN je Produkt und Seite"],
  ["Startseite", "Reihenfolge und Inhalte der Startseiten-Bereiche"],
];

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="eyebrow text-gold-600">NexusIA Digital · Admin</p>
      <h1 className="display mt-3 text-5xl">Verwaltung</h1>
      <p className="mt-4 max-w-2xl text-graphite">
        Gerüst für das künftige Dashboard. Noch keine Funktion ist aktiv – es werden keine Daten gelesen oder geschrieben.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {modules.map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-mist bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{title}</h2>
              <span className="rounded-full bg-pearl px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-graphite">geplant</span>
            </div>
            <p className="mt-2 text-sm text-graphite">{text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
