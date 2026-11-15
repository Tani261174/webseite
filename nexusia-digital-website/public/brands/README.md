# Plattform-Logos

Hier liegen NUR Logo-Dateien, für die eine schriftliche Nutzungsfreigabe der jeweiligen Marke vorliegt.

So wird ein Logo eingebunden:
1. Freigegebene Originaldatei (SVG bevorzugt, sonst PNG ≥ 800 px breit) hier ablegen, z. B. `shopify.svg`.
2. In `src/academy/courses/catalog.ts` (bzw. `amazon.ts`) beim Kurs setzen:
   `logo: { status: "approved", src: "/brands/shopify.svg", ... }`
3. Die Kurskarte zeigt das Logo dann unverändert (object-fit: contain, Originalfarben) auf weißer Fläche mit Goldrahmen.

Ohne Freigabe bleibt `status: "pending"` – die Karte zeigt den Markennamen als Text.
