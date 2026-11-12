"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Bewusst synchron & klein: so liefert der Server für unbekannte Seiten korrekt HTTP 404.
const texts = {
  de: { title: "Seite nicht gefunden", text: "Diese Seite gibt es nicht (mehr). Vielleicht findest du über die Startseite, was du suchst.", home: "Zur Startseite" },
  es: { title: "Página no encontrada", text: "Esta página no existe (o ya no existe). Quizá encuentres lo que buscas desde la página de inicio.", home: "Ir al inicio" },
  en: { title: "Page not found", text: "This page doesn't exist (anymore). You may find what you're looking for from the home page.", home: "Go to home page" },
};

export default function NotFound() {
  const seg = (usePathname() || "/de").split("/")[1] as keyof typeof texts;
  const locale = seg in texts ? seg : "de";
  const t = texts[locale];
  return (
    <section className="bg-noir grain flex min-h-[70vh] items-center text-white">
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="display text-gold text-[7rem] leading-none">404</p>
        <h1 className="display mt-4 text-5xl">{t.title}</h1>
        <p className="mt-4 text-white/60">{t.text}</p>
        <Link href={`/${locale}`} className="btn btn-gold mt-10">{t.home}</Link>
      </div>
    </section>
  );
}
