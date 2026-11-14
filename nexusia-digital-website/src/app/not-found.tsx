import "./globals.css";
import { cookies } from "next/headers";
import { isLocale } from "@/lib/i18n/config";

const texts = {
  de: { title: "Seite nicht gefunden", home: "Zur Startseite" },
  es: { title: "Página no encontrada", home: "Ir al inicio" },
  en: { title: "Page not found", home: "Go to home page" },
};

// Globale 404 für Pfade außerhalb der Sprachbereiche – Sprache aus dem Cookie der zuletzt gewählten Sprache.
export default async function GlobalNotFound() {
  const c = (await cookies()).get("NEXT_LOCALE")?.value;
  const l = isLocale(c) ? c : "de";
  return (
    <html lang={l}>
      <body className="bg-noir grid min-h-dvh place-items-center text-center text-white">
        <div>
          <p className="display text-gold text-8xl">404</p>
          <p className="mt-4 text-white/70">{texts[l].title}</p>
          <a href={`/${l}`} className="btn btn-gold mt-8">{texts[l].home}</a>
        </div>
      </body>
    </html>
  );
}
