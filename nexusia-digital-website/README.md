# NexusIA Digital – Website

Mehrsprachige Unternehmenswebsite (DE / ES / EN) für **NexusIA Digital** und seine Marken
NexusCreator AI, NexusStock, NeuesIchMitTani und MundoResinaMagica.
Design: Weiß · Schwarz · Metallic-Gold.

> **Status:** Erste visuelle und funktionale Version. Alle Produkte sind **Demo-Inhalte**,
> Zahlungen sind **nicht aktiv**, nichts ist veröffentlicht.

---

## Technik

| Bereich | Lösung |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, eigenes Designsystem in `src/app/globals.css` |
| Schriften | Cormorant Garamond + Manrope, **selbst gehostet** (kein Google-Fonts-Aufruf → DSGVO-freundlich) |
| Sprachen | Eigenes, typisiertes Übersetzungssystem (`src/messages/*.ts`) + Sprach-Routing per Middleware |
| Validierung | zod (Browser + Server) |
| Hosting | Cloudflare Workers über `@opennextjs/cloudflare` (getestet mit `wrangler dev`) |

## Schnellstart (lokal)

Voraussetzung: Node.js ≥ 20.9

```bash
cd nexusia-digital-website
npm install
cp .env.example .env.local      # Werte bleiben vorerst leer
npm run dev
```

Dann im Browser öffnen: **http://localhost:3000** → leitet automatisch auf `/de`, `/es` oder `/en`
(je nach Browsersprache bzw. zuletzt gewählter Sprache) weiter.

Weitere Befehle:

```bash
npm run typecheck   # TypeScript prüfen
npm run build       # Produktions-Build
npm run start       # Produktions-Build lokal starten (Port 3000)
npm run cf:preview  # Cloudflare-Build + lokale Vorschau im Workers-Simulator (Port 8787)
```

## Projektstruktur

```
src/
  app/
    [locale]/               Alle öffentlichen Seiten je Sprache (/de, /es, /en)
      page.tsx              Startseite
      brands/               Markenübersicht + Markenseiten (/brands/[slug])
      shop/                 Shop mit Suche/Filter + Produktseiten (/shop/[slug])
      courses/              Kursbereich
      cart/ checkout/       Warenkorb & (deaktivierte) Kasse
      account/              Kundenkonto (Architektur-Platzhalter)
      contact/ faq/         Kontakt & FAQ
      legal/[doc]           Impressum, Datenschutz, AGB, Widerruf
      legal/cookies         Cookie-Einstellungen
    admin/                  Admin-Gerüst (serverseitig gesperrt)
    api/                    contact, newsletter, checkout/paypal, download/[token], admin/*
    sitemap.ts robots.ts    SEO
  components/               UI, Layout, Shop, Formulare, Marken, SVG-Kunstwerke
  content/                  brands.ts, products.ts (DEMO), legal.ts (Vorlagen)
  messages/                 de.ts (Vorlage), es.ts, en.ts
  lib/                      i18n, SEO-Helfer, Validierung, Server-Helfer (Rate-Limit, PayPal, signierte Downloads)
  middleware.ts             Sprach-Routing + Admin-Schutz
```

### Neue Texte / Übersetzungen hinzufügen

1. Schlüssel in `src/messages/de.ts` ergänzen.
2. Denselben Schlüssel in `es.ts` und `en.ts` eintragen – **TypeScript meldet fehlende Übersetzungen** (`npm run typecheck`).
3. Im Code über `t.bereich.schluessel` verwenden.

Produkt- und Markentexte stehen direkt bei den Daten (`{ de, es, en }`) in `src/content/`.

### Produkte pflegen (vorerst)

`src/content/products.ts` – jedes Produkt hat `status: "available" | "coming-soon" | "free"`,
`priceCents` (Preis in Cent), `demo: true/false`. Demo-Produkte können **niemals** bezahlt werden –
die Checkout-API lehnt sie serverseitig ab. Später ersetzt eine Datenbank (Cloudflare D1) + Admin-Dashboard diese Datei.

## Was bereits funktioniert

- Responsive Design (Mobil bis Desktop), Mobilmenü, Mega-Dropdown „Marken“
- Sprachumschalter DE/ES/EN auf jeder Seite (bleibt auf der gleichen Unterseite), Sprache wird gemerkt
- Startseite mit allen Bereichen (Hero, Intro, Kategorien, Produkte, KI, Kurse, Marken, Vorteile, Newsletter, Kontakt)
- 4 Markenseiten, Kursbereich, FAQ (mit FAQ-Schema), Kontaktseite, Rechtsseiten, Cookie-Einstellungen
- Shop: Suche, Filter (Kategorie/Marke/Status), Sortierung, teilbare Filter-URLs, Produktdetailseiten
- Warenkorb (im Browser gespeichert), Kassen-Übersicht
- Formulare mit Validierung, Honeypot, Rate-Limit und Origin-Prüfung – melden ehrlich „noch nicht aktiviert“
- SEO: Metadaten je Sprache, `hreflang` inkl. `x-default`, Canonicals, Open Graph + Bild, Sitemap, robots.txt, JSON-LD
- Echte 404-Seiten (Status 404) in allen Sprachen
- Sicherheits-Header (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- Animationen ohne JavaScript (CSS Scroll-Timeline) und Rücksicht auf „reduzierte Bewegung“

## Was noch fehlt (bewusst nicht aktiviert)

| Thema | Benötigt |
|---|---|
| Echte Produkte, Bilder, Preise, Lizenzen | Deine Daten → `src/content/products.ts` bzw. später Datenbank |
| Zahlungen (PayPal) | PayPal-Business-Konto, `PAYPAL_CLIENT_ID`/`PAYPAL_CLIENT_SECRET` als Secrets, `PAYMENTS_ENABLED=true`, Capture-Route, Webhook-Prüfung, Bestellspeicherung (D1) |
| Downloads | Privater R2-Bucket, `DOWNLOAD_SIGNING_SECRET`, Auslieferung in `api/download/[token]` |
| Kontakt & Newsletter | E-Mail-/Newsletter-Anbieter + API-Key (`EMAIL_PROVIDER_API_KEY`, `CONTACT_RECIPIENT`), Double-Opt-in |
| Kundenkonto | Authentifizierung (z. B. Magic-Link), Sessions, Bestellhistorie |
| Admin-Dashboard | Cloudflare Access vor `/admin`, D1/R2-Anbindung, Formulare |
| Rechtstexte | Ausfüllen aller `{{Platzhalter}}` + **rechtliche Prüfung** (Impressum, Datenschutz, AGB, Widerruf) |
| Domain | `NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen |

## Sicherheit

- Alle Schlüssel nur serverseitig über Umgebungsvariablen/Cloudflare-Secrets – nie im Browser-Code.
- `/admin` und `/api/admin/*` liefern **404**, solange `ADMIN_USER`/`ADMIN_PASSWORD` (≥ 12 Zeichen) fehlen; danach Basic-Auth als Übergang. Für den Livebetrieb **Cloudflare Access** empfehlen.
- Preise werden beim Checkout **immer serverseitig** aus dem Katalog berechnet.
- Downloads nur über HMAC-signierte, zeitlich begrenzte Links; Dateien nie in `public/`.
- Rate-Limiting ist pro Instanz; für Cloudflare zusätzlich WAF-Rate-Limiting-Regeln aktivieren.
- Keine Source-Maps im Produktions-Build. Hinweis: Ausgeliefertes HTML/CSS/JS ist grundsätzlich einsehbar – Geschäftslogik gehört deshalb auf den Server.

## Deployment auf Cloudflare (erst wenn du bereit bist)

1. Cloudflare-Konto anlegen, `npx wrangler login`.
2. Name/Konfiguration in `wrangler.jsonc` prüfen.
3. Secrets setzen, z. B. `npx wrangler secret put PAYPAL_CLIENT_SECRET` (nur benötigte).
4. `NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen.
5. Lokal testen: `npm run cf:preview`.
6. Veröffentlichen: `npm run cf:deploy` – **erst nach rechtlicher Prüfung der Pflichtseiten**.
7. Domain in Cloudflare verbinden, Cloudflare Access für `/admin` einrichten, WAF-Rate-Limits setzen.

Die Seiten sind vorgerendert und werden aus den Workers Static Assets ausgeliefert
(`open-next.config.ts`) – das hält die laufenden Kosten sehr niedrig (Workers Free/Paid-Plan).
