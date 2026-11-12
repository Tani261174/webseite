import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/messages/de";
import { href } from "@/lib/site";
import { brands } from "@/content/brands";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Section";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const year = new Date().getFullYear();
  const col = "text-sm text-white/55 transition hover:text-gold-200";
  return (
    <footer className="bg-noir relative overflow-hidden text-white">
      <div className="gold-hairline" aria-hidden="true" />
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo id="ftr" />
            <p className="display mt-6 max-w-xs text-2xl leading-snug text-white/80">{t.footer.tagline}</p>
            <div className="mt-8">
              <LanguageSwitcher locale={locale} label={t.nav.language} variant="inline" />
            </div>
          </div>
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="eyebrow text-gold-300">{t.footer.explore}</h3>
              <ul className="mt-5 space-y-3">
                <li><Link className={col} href={href(locale, "/shop")}>{t.nav.shop}</Link></li>
                <li><Link className={col} href={href(locale, "/courses")}>{t.nav.courses}</Link></li>
                <li><Link className={col} href={href(locale, "/brands/nexuscreator-ai")}>{t.nav.ai}</Link></li>
                <li><Link className={col} href={href(locale, "/faq")}>{t.nav.faq}</Link></li>
                <li><Link className={col} href={href(locale, "/contact")}>{t.nav.contact}</Link></li>
                <li><Link className={col} href={href(locale, "/account")}>{t.nav.account}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="eyebrow text-gold-300">{t.footer.brands}</h3>
              <ul className="mt-5 space-y-3">
                {brands.map((b) => (
                  <li key={b.slug}><Link className={col} href={href(locale, `/brands/${b.slug}`)}>{b.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="eyebrow text-gold-300">{t.footer.legal}</h3>
              <ul className="mt-5 space-y-3">
                <li><Link className={col} href={href(locale, "/legal/imprint")}>{t.legalNav.imprint}</Link></li>
                <li><Link className={col} href={href(locale, "/legal/privacy")}>{t.legalNav.privacy}</Link></li>
                <li><Link className={col} href={href(locale, "/legal/terms")}>{t.legalNav.terms}</Link></li>
                <li><Link className={col} href={href(locale, "/legal/withdrawal")}>{t.legalNav.withdrawal}</Link></li>
                <li><Link className={col} href={href(locale, "/legal/cookies")}>{t.legalNav.cookies}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} NexusIA Digital. {t.footer.rights}</p>
          <p>{t.footer.madeWith}</p>
        </div>
      </Container>
    </footer>
  );
}
