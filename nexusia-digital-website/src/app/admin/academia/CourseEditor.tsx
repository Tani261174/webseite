"use client";

import { useState } from "react";

/**
 * Kurs-Editor: Formular mit Live-Vorschau der Kurskarte.
 * Speichern geht an /api/admin/courses. Ohne verbundene Datenbank antwortet der Server ehrlich mit
 * „Datenbank nicht verbunden“ – es wird nichts vorgetäuscht.
 */
type L = { es: string; de: string; en: string };
const emptyL: L = { es: "", de: "", en: "" };
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

export function CourseEditor() {
  const [title, setTitle] = useState<L>(emptyL);
  const [short, setShort] = useState<L>(emptyL);
  const [description, setDescription] = useState<L>(emptyL);
  const [slug, setSlug] = useState("");
  const [area, setArea] = useState("ecommerce");
  const [level, setLevel] = useState("beginner");
  const [status, setStatus] = useState("draft");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [msg, setMsg] = useState<{ tone: "ok" | "warn" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const priceCents = price.trim() ? Math.round(parseFloat(price.replace(",", ".")) * 100) : null;
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slug || slugify(title.es), title, short, description, area, level, status, priceCents: Number.isFinite(priceCents) ? priceCents : null, image: image.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; issues?: string[] };
      if (res.status === 503 && data.error === "database_not_configured")
        setMsg({ tone: "warn", text: "Eingaben sind gültig. Speichern ist erst möglich, wenn die Datenbank (Cloudflare D1) verbunden ist – danach erscheint ein veröffentlichter Kurs automatisch im Katalog." });
      else if (res.status === 409) setMsg({ tone: "err", text: "Diese Kurs-Adresse (Slug) ist schon vergeben." });
      else if (res.status === 400) setMsg({ tone: "err", text: `Bitte prüfe diese Felder: ${(data.issues || []).join(", ") || "Eingaben"}` });
      else if (res.ok) setMsg({ tone: "ok", text: "Gespeichert." });
      else setMsg({ tone: "err", text: "Unerwarteter Fehler." });
    } catch {
      setMsg({ tone: "err", text: "Keine Verbindung zum Server." });
    } finally {
      setBusy(false);
    }
  }

  const label = "mb-1 block text-xs font-semibold uppercase tracking-wider text-graphite";
  const L3 = ({ name, value, set, area: big, max }: { name: string; value: L; set: (v: L) => void; area?: boolean; max: number }) => (
    <div className="grid gap-3 sm:grid-cols-3">
      {(["es", "de", "en"] as const).map((l) => (
        <div key={l}>
          <label className={label} htmlFor={`${name}-${l}`}>{name} · {l.toUpperCase()}{l === "es" ? " *" : ""}</label>
          {big ? (
            <textarea id={`${name}-${l}`} className="field min-h-28" maxLength={max} value={value[l]} onChange={(e) => set({ ...value, [l]: e.target.value })} />
          ) : (
            <input id={`${name}-${l}`} className="field" maxLength={max} value={value[l]} onChange={(e) => set({ ...value, [l]: e.target.value })} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <form onSubmit={save} className="space-y-5 rounded-2xl border border-mist bg-white p-6 lg:col-span-2">
        {L3({ name: "Titel", value: title, set: setTitle, max: 160 })}
        {L3({ name: "Kurzbeschreibung", value: short, set: setShort, max: 240 })}
        {L3({ name: "Beschreibung", value: description, set: setDescription, area: true, max: 4000 })}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={label} htmlFor="slug">Adresse (Slug)</label><input id="slug" className="field" placeholder={slugify(title.es) || "mein-kurs"} value={slug} onChange={(e) => setSlug(slugify(e.target.value))} /></div>
          <div><label className={label} htmlFor="price">Preis in € (leer = Próximamente)</label><input id="price" className="field" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9.,]/g, ""))} /></div>
          <div><label className={label} htmlFor="area">Bereich</label>
            <select id="area" className="field" value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="ecommerce">E-Commerce</option><option value="affiliate">Affiliate</option><option value="social">Social & Content</option><option value="digital">Digitale Produkte</option><option value="ai">KI & Design</option>
            </select>
          </div>
          <div><label className={label} htmlFor="level">Niveau</label>
            <select id="level" className="field" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="beginner">Einsteiger</option><option value="intermediate">Fortgeschritten</option><option value="all">Alle Niveaus</option>
            </select>
          </div>
          <div><label className={label} htmlFor="status">Status</label>
            <select id="status" className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Entwurf (nicht öffentlich)</option><option value="soon">Veröffentlicht – Próximamente</option><option value="open">Veröffentlicht – im Verkauf</option>
            </select>
          </div>
          <div><label className={label} htmlFor="image">Kursbild (URL, optional)</label><input id="image" className="field" type="url" placeholder="https://…" value={image} onChange={(e) => setImage(e.target.value)} /></div>
        </div>
        {msg ? <p role="status" className={`rounded-xl px-4 py-3 text-sm ${msg.tone === "ok" ? "bg-emerald-50 text-emerald-800" : msg.tone === "warn" ? "bg-gold-50 text-gold-700" : "bg-red-50 text-red-800"}`}>{msg.text}</p> : null}
        <button type="submit" disabled={busy} className="btn btn-dark">{busy ? "Prüfe …" : "Kurs speichern"}</button>
      </form>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-graphite">Vorschau der Kurskarte</p>
        <div className="overflow-hidden rounded-2xl border border-mist bg-white">
          <div className="bg-noir relative grid aspect-[16/10] place-items-center overflow-hidden">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : <span className="display text-gold text-5xl">NX</span>}
          </div>
          <div className="p-5">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gold-600">{area}</p>
            <p className="display mt-2 text-2xl leading-tight">{title.es || "Título del curso"}</p>
            <p className="mt-2 text-sm text-graphite">{short.es || "Descripción corta del curso."}</p>
            <div className="mt-4 flex items-center justify-between border-t border-mist pt-4">
              <span className="font-semibold">{price ? `${price} €` : "Próximamente"}</span>
              <span className="btn btn-dark min-h-9 px-4 text-[0.65rem]">Ver curso</span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-graphite">Die Karte erscheint im Katalog, sobald der Kurs gespeichert und veröffentlicht ist.</p>
      </div>
    </div>
  );
}
