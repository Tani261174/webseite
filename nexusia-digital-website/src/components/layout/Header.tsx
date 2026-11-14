import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/messages/de";
import { href } from "@/lib/site";
import { brands } from "@/content/brands";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { CartCount } from "@/components/shop/CartCount";

export function Header({ locale, t }: { locale: Locale; t: Dictionary }) {
  const nav = [
    { href: href(locale, "/shop"), label: t.nav.shop },
    { href: href(locale, "/academia"), label: t.nav.academy },
    { href: href(locale, "/brands/nexuscreator-ai"), label: t.nav.ai },
    { href: href(locale, "/faq"), label: t.nav.faq },
    { href: href(locale, "/contact"), label: t.nav.contact },
  ];
  const mobileItems = [
    { href: href(locale), label: t.nav.home },
    { href: href(locale, "/brands"), label: t.nav.brands },
    ...nav,
    { href: href(locale, "/courses"), label: t.nav.courses },
    { href: href(locale, "/account"), label: t.nav.account },
  ];
  const link = "relative py-2 text-[0.8rem] font-medium tracking-[0.08em] text-white/80 transition hover:text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold-300 after:transition after:duration-500 hover:after:scale-x-100";

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#070707]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink">
        {t.common.skipToContent}
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href={href(locale)} aria-label="NexusIA Digital – Start" className="shrink-0">
          <Logo id="hdr" />
        </Link>

        <nav aria-label={t.nav.mainNav} className="hidden items-center gap-8 lg:flex">
          <div className="group relative">
            <Link href={href(locale, "/brands")} className={`${link} inline-flex items-center gap-1`}>
              {t.nav.brands} <Icon name="chevron" className="h-3.5 w-3.5 opacity-60 transition group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-1/2 top-full w-[21rem] -translate-x-1/2 pt-4 opacity-0 transition duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul className="rounded-2xl border border-white/10 bg-ink-soft/95 p-2 shadow-2xl backdrop-blur-xl">
                {brands.map((b) => (
                  <li key={b.slug}>
                    <Link href={href(locale, `/brands/${b.slug}`)} className="block rounded-xl px-4 py-3 transition hover:bg-white/5">
                      <span className="display block text-xl text-white">{b.name}</span>
                      <span className="block text-xs text-white/50">{b.tagline[locale]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={link}>{n.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href={`${href(locale, "/shop")}#search`} aria-label={t.shop.search} className="hidden h-10 w-10 place-items-center rounded-full text-white/80 transition hover:text-gold-200 sm:grid">
            <Icon name="search" />
          </Link>
          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} label={t.nav.language} />
          </div>
          <Link href={href(locale, "/account")} aria-label={t.nav.account} className="hidden h-10 w-10 place-items-center rounded-full text-white/80 transition hover:text-gold-200 sm:grid">
            <Icon name="user" />
          </Link>
          <Link href={href(locale, "/cart")} aria-label={t.nav.cart} className="relative grid h-10 w-10 place-items-center rounded-full text-white/80 transition hover:text-gold-200">
            <Icon name="cart" />
            <CartCount />
          </Link>
          <MobileMenu locale={locale} items={mobileItems} labels={{ open: t.nav.openMenu, close: t.nav.closeMenu, language: t.nav.language }} />
        </div>
      </div>
    </header>
  );
}
