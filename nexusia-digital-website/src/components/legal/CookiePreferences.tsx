"use client";

import { useState } from "react";

/**
 * Cookie-Einstellungen. Aktuell gibt es nur notwendige Speicher – optionale Kategorien
 * sind deaktiviert und können erst gewählt werden, wenn entsprechende Dienste existieren.
 * Gespeichert wird die Auswahl lokal unter "nexusia-consent-v1".
 */
export function CookiePreferences({ labels }: {
  labels: { necessary: string; necessaryText: string; analytics: string; analyticsText: string; marketing: string; marketingText: string; alwaysOn: string; notUsed: string; save: string; saved: string };
}) {
  const [saved, setSaved] = useState(false);
  const rows = [
    { key: "necessary", title: labels.necessary, text: labels.necessaryText, on: true, state: labels.alwaysOn },
    { key: "analytics", title: labels.analytics, text: labels.analyticsText, on: false, state: labels.notUsed },
    { key: "marketing", title: labels.marketing, text: labels.marketingText, on: false, state: labels.notUsed },
  ];
  function save() {
    try {
      localStorage.setItem("nexusia-consent-v1", JSON.stringify({ necessary: true, analytics: false, marketing: false, ts: Date.now() }));
    } catch { /* ignorieren */ }
    setSaved(true);
  }
  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.key} className="flex items-start justify-between gap-6 rounded-2xl border border-mist bg-white p-6">
          <div>
            <h2 className="font-semibold">{r.title}</h2>
            <p className="mt-1 text-sm text-graphite">{r.text}</p>
          </div>
          <label className="flex shrink-0 items-center gap-3 text-xs text-graphite">
            <span>{r.state}</span>
            <input type="checkbox" role="switch" checked={r.on} disabled readOnly aria-label={r.title}
              className="h-5 w-9 cursor-not-allowed appearance-none rounded-full bg-mist transition checked:bg-[#c09840]" />
          </label>
        </div>
      ))}
      <div className="flex items-center gap-4 pt-2">
        <button type="button" onClick={save} className="btn btn-dark">{labels.save}</button>
        {saved ? <p role="status" className="text-sm text-gold-700">{labels.saved}</p> : null}
      </div>
    </div>
  );
}
