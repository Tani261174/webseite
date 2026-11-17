# SABOR VENEZOLANO 🇻🇪

*„Un pedacito de Venezuela en tu mesa.“*

Online-Shop für venezolanische Spezialitäten: zweisprachig (Spanisch/Deutsch), Bestellung per WhatsApp, Vorbestellsystem und Adminbereich.

> **Status:** funktionsfähige erste Version. **Noch nicht veröffentlichen**, bevor die Checkliste unten erledigt ist.
> Es gibt **keine** Online-Zahlung, Bestellungen werden manuell per WhatsApp bestätigt.

---

## 1. Vorschau lokal starten

Voraussetzung: **Node.js 22.13 oder neuer** (https://nodejs.org)

```bash
cd sabor-venezolano
npm install
cp .env.example .env.local
npm run admin:hash            # Passwort eingeben → ausgegebene Zeile in .env.local eintragen
# SESSION_SECRET in .env.local setzen (Befehl steht in der Datei)
npm run dev
```

Dann im Browser öffnen:

| Seite | Adresse |
|---|---|
| Shop (Spanisch) | http://localhost:3000/es |
| Shop (Deutsch) | http://localhost:3000/de |
| Adminbereich | http://localhost:3000/admin |

Am Handy testen: Handy und Computer im selben WLAN, dann `npm run dev -- -H 0.0.0.0` starten und am Handy `http://<IP-des-Computers>:3000` öffnen.

## 2. Was die Website kann

**Für Kundinnen und Kunden**
- Startseite mit den beiden Köchinnen, Spezialitäten, Weihnachtsbereich, „So funktioniert's“, WhatsApp-Kontakt
- Katalog mit Sorten (z. B. Empanadas: Carne mechada / Pollo / Queso), Allergenen, Verfügbarkeit
- Warenkorb (bleibt im Browser gespeichert), Mengen ändern, entfernen, Gesamtpreis
- Wunschtermin mit Prüfung (Vorlaufzeit, Ruhetage, gesperrte Tage, Bestellschluss Weihnachten)
- **„📲 Enviar pedido por WhatsApp“**: öffnet WhatsApp mit fertig formulierter Nachricht inkl. Bestellnummer, aller Produkte und Gesamtbetrag
- Deutlicher Hinweis: *„Tu pedido estará confirmado cuando recibas nuestra respuesta.“*
- Kontaktformular mit Spamschutz, FAQ
- Impressum, Datenschutz, Lebensmittelinfos, Bestellbedingungen, Abholung/Lieferung
- Sprache jederzeit umschaltbar (🇻🇪/🇩🇪 oben rechts)

**Adminbereich** (`/admin`, zweisprachig)
- Übersicht mit offenen Bestellungen und **Checkliste vor Veröffentlichung**
- Bestellungen ansehen, Status ändern (Nuevo → … → Entregado / Cancelado), interne Notiz, Antwort per WhatsApp
- Produkte anlegen, Fotos hochladen, Preise ändern, Sorten, Allergene, ausblenden, „ausverkauft“
- Begrenzte Mengen: werden bei jeder Bestellung abgezogen, bei Stornierung zurückgebucht
- Vorbestellung: Mindestvorlauf, max. Vorlauf, Ruhetage, gesperrte Tage, Bestellannahme pausieren
- Weihnachten: Bereich ein/aus, Bestellschluss, Zeitraum, Text, Foto
- Texte & Bilder der Startseite, Köchinnen, Hinweisleiste, WhatsApp-Nummer
- Kontaktanfragen bearbeiten, echte Bewertungen eintragen und freigeben
- Rechtliche Angaben (Pflichtfelder sind markiert) und Rechtstexte

### Wichtig zu WhatsApp
Beim Klick auf den WhatsApp-Button wird die Bestellanfrage **zusätzlich auf der Website gespeichert** (Status „Nuevo“) und erscheint im Adminbereich.
Ob die Kundin die Nachricht in WhatsApp **wirklich abschickt**, kann die Website nicht wissen. Eine Nachricht, die jemand direkt per WhatsApp schreibt, erscheint **nicht** im Adminbereich. Dafür wäre eine eigene WhatsApp-Business-API-Anbindung nötig.

## 3. Checkliste vor der Veröffentlichung

Der Adminbereich zeigt diese Punkte auch auf der Übersichtsseite an.

- [ ] **Rechtliche Angaben** vollständig (Admin → Datos legales)
- [ ] **Impressum, Datenschutz, Bestellbedingungen, Abholung** fachkundig prüfen lassen (die Texte sind Entwürfe)
- [ ] **Allergene und Lebensmittelinformationen** für jedes Produkt eintragen und bestätigen
- [ ] Produktbeschreibungen prüfen (sie sind Vorschläge)
- [ ] **Echte Fotos** hochladen: großes Hauptfoto der beiden Köchinnen (Admin → Textos e imágenes), Produkte, Einzelporträts, Weihnachtsfoto – Gesichter nicht bearbeiten
- [ ] Namen und Vorstellungstexte der Köchinnen eintragen
- [ ] Vorlaufzeit, Ruhetage und Weihnachts-Bestellschluss einstellen
- [ ] Ggf. Lebensmittelrechtliche Registrierung beim zuständigen Amt klären

## 4. Technik

| Bereich | Lösung |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Design | Tailwind CSS 4, Designsystem „Gourmet Minimal“ in `src/app/globals.css`: Weiß `#FFFFFF` und Schwarz `#171717`; Flaggenfarben Gelb `#F4C430`, Blau `#174A9C`, Rot `#C83232` nur als feine Deko (Linie unter der Navigation, Akzente unter Überschriften) |
| Schriften | Playfair Display + Manrope, **selbst gehostet** (keine Google-Verbindung) |
| Datenbank | SQLite (in Node.js eingebaut) → Datei `data/sabor.db` |
| Bilder | Upload im Admin, automatische Verkleinerung + WebP (sharp), Ablage in `data/uploads` |
| Sicherheit | scrypt-Passwort-Hash, HttpOnly-Session, Rate-Limits, Honeypot + Zeit-Token gegen Spam, serverseitige Prüfung aller Preise/Termine, CSP-Header, keine API-Schlüssel im Frontend |

### Projektstruktur
```
src/
  app/[locale]/        Öffentliche Seiten (/es, /de)
  app/admin/           Adminbereich + Server-Aktionen (actions.ts)
  app/api/             Bestellung (orders) und Kontakt (contact)
  app/media/           Auslieferung hochgeladener Bilder
  components/          Wiederverwendbare Bausteine
  lib/                 Logik: Termine (ordering.ts), WhatsApp-Text (whatsapp.ts), Einstellungen
  lib/server/          Datenbank, Login, Sicherheit, Upload
  messages/            Alle Website-Texte (es.ts, de.ts)
scripts/               Passwort-Hash, automatische Tests, Screenshots
```

### Tests
```bash
npm run build && npm start                     # in einem Terminal
node scripts/smoke-test.mjs                    # Bestellablauf (braucht Playwright)
ADMIN_PASSWORD=... node scripts/admin-test.mjs # Adminbereich
```

## 5. Veröffentlichen (eigene Domain)

Die App braucht einen **Node.js-Server mit dauerhaftem Speicher** (für `data/`), z. B.:
- einen kleinen VPS (Hetzner, Netcup, IONOS …) mit Node 22 + Nginx/Caddy für HTTPS
- oder einen Container-Dienst mit Volume (Railway, Render, Fly.io)

Rein statisches Hosting oder Vercel ohne Zusatzdatenbank **passen nicht** (dort gehen Datenbank und Fotos verloren).

```bash
npm ci
npm run build
# Umgebungsvariablen setzen: SITE_URL=https://deine-domain.de, DATA_DIR, ADMIN_USER, ADMIN_PASSWORD_HASH, SESSION_SECRET
npm start            # Port 3000, davor HTTPS-Proxy (Caddy/Nginx)
```

Sobald `SITE_URL` mit `https://` beginnt, werden HSTS, sichere Cookies und HTTPS-Upgrade automatisch aktiviert.
**Backup:** den Ordner `DATA_DIR` regelmäßig sichern (Datenbank + Fotos).

## 6. Später: Online-Zahlung

Online-Zahlung ist bewusst **nicht** eingebaut und wird nirgends simuliert. Vorbereitet ist:
- Jede Bestellung hat eine feste Nummer, gespeicherte Positionen und serverseitig berechnete Summe → Grundlage für PayPal/Stripe
- Platz für Schlüssel in `.env.example` (nur serverseitig)
- Nächster Schritt: Route `api/checkout/<anbieter>` + Webhook, der den Bestellstatus setzt
