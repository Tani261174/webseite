# Academia NexusIA Digital

Internationale Kursplattform innerhalb der NexusIA-Website. Erreichbar unter **`/academia`**
(ohne Sprachwahl startet sie auf **Spanisch** → `/es/academia`; DE und EN über den Sprachumschalter).

## Was funktioniert bereits (echt, ohne Demo-Trick)

| Bereich | Status |
|---|---|
| Startseite der Akademie, 12 Kurskarten, „Ver curso“-Buttons | ✅ fertig |
| 12 Kursdetailseiten (Lernziele, Module, Lektionen, Voraussetzungen, Preis, FAQ, Buttons) | ✅ fertig |
| Lernoberfläche mit Lehrplan-Seitenleiste, Videoplayer (YouTube/Vimeo/Datei), Downloads | ✅ fertig |
| Amazon-Musterlektion (Spanisch): Erklärung, Praxisbeispiel, Übung, Quiz, Arbeitsblatt-PDF | ✅ fertig |
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
6. **Inhalte** – weitere Lektionen schreiben, Videos aufnehmen, Übersetzungen DE/EN der Lektionen.

## Wo was liegt

```
src/academy/
  types.ts                 Datenmodell (Kurs, Modul, Lektion, Quiz, Downloads)
  courses/amazon.ts        Amazon Business Masterclass (15 Module)
  courses/amazon-sample-lesson.ts  vollständige Musterlektion (ES)
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
