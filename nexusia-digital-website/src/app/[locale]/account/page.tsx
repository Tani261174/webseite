import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n/page";
import { pageMetadata } from "@/lib/site";
import { Container, Notice } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/account", title: t.account.title, description: t.account.description, noindex: true });
}

/**
 * Kundenkonto – Architektur-Platzhalter.
 * Geplant: Authentifizierung serverseitig (z. B. Magic-Link per E-Mail oder Auth-Anbieter),
 * Sessions als HttpOnly-Cookies, Bestellungen & Download-Rechte in Cloudflare D1.
 */
export default async function AccountPage({ params }: P) {
  const { t } = await resolveLocale(params);
  return (
    <section className="bg-pearl py-16 sm:py-24">
      <Container className="grid max-w-6xl gap-10 lg:grid-cols-2">
        <div>
          <h1 className="display text-5xl sm:text-6xl">{t.account.title}</h1>
          <p className="mt-5 text-lg text-graphite">{t.account.intro}</p>
          <h2 className="eyebrow mt-10 text-gold-600">{t.account.planned}</h2>
          <ul className="mt-5 space-y-3">
            {t.account.features.map((f) => (
              <li key={f} className="flex items-center gap-3"><Icon name="check" className="h-5 w-5 text-gold-600" /> {f}</li>
            ))}
          </ul>
          <h2 className="eyebrow mt-10 text-gold-600">{t.account.orders}</h2>
          <p className="mt-3 text-sm text-graphite">{t.account.noOrders}</p>
        </div>
        <form className="h-fit rounded-[1.5rem] border border-mist bg-white p-7 shadow-[var(--shadow-lux)] sm:p-10" aria-describedby="login-disabled">
          <h2 className="display text-3xl">{t.account.login}</h2>
          <fieldset disabled className="mt-6 space-y-5">
            <div>
              <label htmlFor="acc-email" className="mb-2 block text-sm font-medium">{t.account.email}</label>
              <input id="acc-email" type="email" autoComplete="email" className="field" />
            </div>
            <div>
              <label htmlFor="acc-pass" className="mb-2 block text-sm font-medium">{t.account.password}</label>
              <input id="acc-pass" type="password" autoComplete="current-password" className="field" />
            </div>
            <button type="submit" className="btn btn-dark w-full">{t.account.login}</button>
          </fieldset>
          <div id="login-disabled" className="mt-5"><Notice>{t.account.disabled}</Notice></div>
        </form>
      </Container>
    </section>
  );
}
