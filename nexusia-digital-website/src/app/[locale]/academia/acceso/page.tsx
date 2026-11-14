import type { Metadata } from "next";
import Link from "next/link";
import { resolveLocale } from "@/lib/i18n/page";
import { href, pageMetadata } from "@/lib/site";
import { academyUi } from "@/academy/ui";
import { Container, Notice } from "@/components/ui/Section";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const ui = academyUi(locale);
  return pageMetadata({ locale, path: "/academia/acceso", title: ui.access.metaTitle, description: ui.access.notActiveText, noindex: true });
}

/** Login/Registrierung – Formulare vorbereitet, aber bewusst deaktiviert, bis Datenbank & sichere Sessions eingerichtet sind. */
export default async function AccessPage({ params }: P) {
  const { locale } = await resolveLocale(params);
  const ui = academyUi(locale);
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-graphite";
  return (
    <section className="bg-pearl py-14 sm:py-20">
      <Container className="max-w-4xl">
        <h1 className="display text-5xl">{ui.access.title}</h1>
        <div className="mt-6"><Notice><strong>{ui.access.notActiveTitle}.</strong> {ui.access.notActiveText}</Notice></div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <form className="rounded-3xl border border-mist bg-white p-7" aria-describedby="access-note">
            <fieldset disabled className="space-y-4">
              <legend className="display mb-2 text-3xl">{ui.access.login}</legend>
              <div><label htmlFor="li-email" className={label}>{ui.access.email}</label><input id="li-email" type="email" autoComplete="email" className="field" /></div>
              <div><label htmlFor="li-pass" className={label}>{ui.access.password}</label><input id="li-pass" type="password" autoComplete="current-password" className="field" /></div>
              <button type="submit" className="btn btn-dark w-full">{ui.access.login}</button>
            </fieldset>
          </form>
          <form className="rounded-3xl border border-mist bg-white p-7" aria-describedby="access-note">
            <fieldset disabled className="space-y-4">
              <legend className="display mb-2 text-3xl">{ui.access.register}</legend>
              <div><label htmlFor="re-name" className={label}>{ui.access.name}</label><input id="re-name" autoComplete="name" className="field" /></div>
              <div><label htmlFor="re-email" className={label}>{ui.access.email}</label><input id="re-email" type="email" autoComplete="email" className="field" /></div>
              <div><label htmlFor="re-pass" className={label}>{ui.access.password}</label><input id="re-pass" type="password" autoComplete="new-password" className="field" /></div>
              <button type="submit" className="btn btn-gold w-full">{ui.access.register}</button>
            </fieldset>
          </form>
        </div>
        <p id="access-note" className="mt-6 text-sm text-graphite">
          {ui.access.freeText} <Link href={href(locale, "/academia")} className="font-semibold underline underline-offset-4">{ui.nav.catalog}</Link>
        </p>
      </Container>
    </section>
  );
}
