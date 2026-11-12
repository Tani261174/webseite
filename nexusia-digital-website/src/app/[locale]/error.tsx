"use client";

import { useParams } from "next/navigation";

const texts = {
  de: { title: "Etwas ist schiefgelaufen", text: "Bitte lade die Seite neu oder versuche es später noch einmal.", retry: "Erneut versuchen" },
  es: { title: "Algo ha salido mal", text: "Recarga la página o inténtalo de nuevo más tarde.", retry: "Reintentar" },
  en: { title: "Something went wrong", text: "Please reload the page or try again later.", retry: "Try again" },
};

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const { locale } = useParams<{ locale: string }>();
  const t = texts[(locale as keyof typeof texts) in texts ? (locale as keyof typeof texts) : "de"];
  return (
    <section className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="display text-5xl">{t.title}</h1>
      <p className="mt-4 text-graphite">{t.text}</p>
      <button type="button" onClick={reset} className="btn btn-dark mt-8">{t.retry}</button>
    </section>
  );
}
