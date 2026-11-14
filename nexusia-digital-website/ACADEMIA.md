# Academia NexusIA Digital

**Aprende. Emprende. Crece. · Lerne. Gründe. Wachse. · Learn. Build. Grow.** – internationale Akademie für E-Commerce, digitales Marketing, KI und Online-Business.
Nicht auf ein Land ausgerichtet (geprüft: keine Venezuela- oder sonstigen Länderbezüge; nur neutrale Hinweise „Bedingungen variieren je nach Land“).

## Inhaltsprüfung (Stand dieser Version)

| # | Kurs | Module | Lektionen geplant | ausgearbeitet | Platzhalter („Próximamente“) | Videos | Dateien | Übung / Quiz | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Amazon Business Masterclass | 15 | 45 | 1 | 44 | 0 | 1 PDF-Arbeitsblatt (kein E-Book) | 1 / 1 | Próximamente, Gratis-Vorschau |
| 2–12 | Temu, SHEIN, TikTok Shop, Shopify, Etsy, eBay, AliExpress, Hotmart, Canva & IA, YouTube, Marketing Digital | je 5 | je 15 | 0 | je 15 | 0 | 0 | 0 / 0 | Próximamente |

Zusätzlich hat jeder Kurs eine automatisch erzeugte, öffentliche „Kursvorstellung“ (aus Lernzielen, Zielgruppe, Voraussetzungen und Modulen).
Live-Ansicht dieser Prüfung: `/admin/academia`.

## Plattform-Logos

Bei allen elf Plattformen erfordert die Logo-Nutzung eine schriftliche Freigabe oder ist ungeklärt → Status **„ausstehend“**.
Die Karten zeigen bis dahin eine neutrale Textkarte (Plattformname als reiner Text + „Curso independiente“), keine Logos, keine Markenfarben.
Nach Freigabe: Originaldatei nach `public/brands/` legen und im Kurs `brand.logo` auf `status: "approved", src: "/brands/…"` setzen –
das Logo wird dann unverändert (nicht verzerrt, nicht umgefärbt) auf weißer Fläche mit Goldrahmen angezeigt.
Marketing Digital nutzt ein eigenes NexusIA-Motiv.

Internationale Kursplattform innerhalb der NexusIA-Website. Erreichbar unter **`/academia`**
(ohne Sprachwahl startet sie auf **Spanisch** → `/es/academia`; DE und EN über den Sprachumschalter).

## Was funktioniert bereits (echt, ohne Demo-Trick)

| Bereich | Status |
|---|---|
| Startseite der Akademie, 12 Kurskarten, „Ver curso“-Buttons | ✅ fertig |
| 12 Kursdetailseiten (Lernziele, Module, Lektionen, Voraussetzungen, Preis, FAQ, Buttons) | ✅ fertig |
| Lernoberfläche mit Lehrplan-Seitenleiste, Videoplayer (YouTube/Vimeo/Datei), Downloads | ✅ fertig |
| Amazon-Musterlektion in ES, DE und EN: Erklärung, Praxisbeispiel, Übung, Quiz, Arbeitsblatt-PDF je Sprache | ✅ fertig |
| Kursvorstellung als kostenlose Vorschau für jeden Kurs | ✅ fertig |
| Quiz mit Auswertung, „Als erledigt markieren“, Fortschritt in „Mi aprendizaje“ | ✅ fertig (nur im Browser gespeichert) |
| NexusTutor AI (Glossar + Lektionsempfehlungen, 3 Sprachen) | ✅ fertig, kostenlos |
| Gemini-Anbindung für NexusTutor | ⚙️ vorbereitet – aktiv sobald `GEMINI_API_KEY` als Secret gesetzt ist |
| Bestellübersicht mit serverseitiger Preis- und Rabattcode-Berechnung | ✅ fertig (Testgutschein `BIENVENIDA10`) |
| Zahlungen PayPal / Stripe | ⛔ bewusst deaktiviert – kein Kauf möglich |
| Login / Registrierung / gekaufte Kurse / Zertifikate / Profil | ⛔ Oberfläche vorbereitet, braucht Datenbank |
| Admin `/admin/academia`: Kursliste, Kurs-Editor mit Live-Vorschau | ✅ Lesen + Prüfen · ⛔ Speichern braucht Datenbank |
| SEO (Metadaten, hreflang, Sitemap, JSON-LD „Course“), Smartphone-Layout | ✅ fertig |

## Was für den Produktivbetrieb fehlt

1. **Datenbank (Cloudflare D1)** – Schema liegt in `migrations/0001_academy.sql`.
   Danach `src/academy/repository.ts` auf D1 umstellen → im Admin angelegte, veröffentlichte Kurse erscheinen automatisch im Katalog.
2. **Sichere Anmeldung** – Konten, Passwort-Hashing (PBKDF2 über WebCrypto), HttpOnly-Session-Cookies, Rollen `student`/`admin`.
3. **Dateispeicher (Cloudflare R2)** – Kursbilder, Videos, E-Books (PDF/EPUB); private Dateien nur über signierte Links (`src/lib/server/signed-url.ts`).
4. **Zahlungen** – PayPal und Stripe zuerst im **Sandbox-/Testmodus**; Freischaltung nur per Webhook nach bestätigter Zahlung (Tabelle `enrollments`).
5. **Rechtstexte** für den Kursverkauf (AGB, Widerruf bei digitalen Inhalten, Datenschutz) prüfen lassen.
6. **Inhalte** – weitere Lektionen schreiben (jeweils in ES, DE und EN), Videos aufnehmen.

## Wo was liegt

```
src/academy/
  types.ts                 Datenmodell (Kurs, Modul, Lektion, Quiz, Downloads)
  courses/amazon.ts        Amazon Business Masterclass (15 Module)
  courses/amazon-sample-lesson*.ts  vollständige Musterlektion (ES, DE, EN)
  courses/catalog.ts       die weiteren 11 Kurse (Strukturen, Próximamente)
  repository.ts            EINZIGER Datenzugriff – hier später D1 anbinden
  pricing.ts               Preise & Gutscheine (nur serverseitig)
  glossary.ts              geprüfte Wissensbasis für NexusTutor
  tutor.ts                 NexusTutor-Logik + vorbereitete Gemini-Anbindung
  ui.ts                    Oberflächentexte ES / DE / EN
src/app/[locale]/academia/ Seiten (Start, Kurs, Lernen, Checkout, Mi aprendizaje, Acceso, Tutor)
src/app/admin/academia/    Admin-Bereich
src/app/api/academy/       tutor, quote
src/app/api/admin/courses  Admin-API
migrations/0001_academy.sql
scripts/make-worksheet.py  erzeugt das Arbeitsblatt-PDF
```

## Umgebungsvariablen / Secrets (nie im Frontend)

| Name | Zweck |
|---|---|
| `ADMIN_USER`, `ADMIN_PASSWORD` (≥ 12 Zeichen) | Zugang zu `/admin` (Übergang; später Cloudflare Access) |
| `GEMINI_API_KEY` | optional: NexusTutor formuliert Antworten mit Google Gemini (kostenpflichtig je nach Nutzung – erst nach Freigabe) |
| `GEMINI_MODEL` | optional, Standard `gemini-2.0-flash` |
