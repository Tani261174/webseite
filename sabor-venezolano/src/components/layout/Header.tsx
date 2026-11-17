"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "../brand/Brand";
import { Icon } from "../ui/Icon";
import { useCart } from "../providers/CartProvider";
import { useI18n } from "../providers/I18nProvider";

export function Header({ christmas }: { christmas: boolean }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, ready, lastAdded } = useCart();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const other = locale === "es" ? "de" : "es";
  const switchHref = pathname.replace(/^\/(es|de)(?=\/|$)/, `/${other}`);

  const links = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/productos`, label: t.nav.products },
    ...(christmas ? [{ href: `/${locale}/navidad`, label: t.nav.christmas }] : []),
    { href: `/${locale}/contacto`, label: t.nav.contact },
  ];
  const isActive = (href: string) => (href === `/${locale}` ? pathname === href : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? "bg-sage/95 shadow-[0_12px_30px_-22px_rgba(46,46,49,0.45)] backdrop-blur" : "bg-sage"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <button
          type="button"
          className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink md:hidden"
          aria-label={open ? t.common.close : t.common.menu}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
        </button>

        <Link href={`/${locale}`} className="shrink-0" aria-label="Sabor Venezolano – Inicio">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive(l.href) ? "bg-vanilla text-ink shadow-[0_6px_16px_-10px_rgba(46,46,49,0.4)]" : "text-ink-soft hover:bg-vanilla/60 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href={switchHref}
            hrefLang={other}
            lang={other}
            className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-xs font-bold tracking-wider text-ink-soft hover:text-ink"
            aria-label={t.common.switchTo}
            title={t.common.switchTo}
          >
            <span aria-hidden="true">{other === "de" ? "🇩🇪" : "🇻🇪"}</span>
            {other.toUpperCase()}
          </Link>
          <Link
            href={`/${locale}/carrito`}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-rose text-ink shadow-[inset_0_0_0_1px_rgba(46,46,49,0.08)] transition-transform hover:scale-105"
            aria-label={`${t.nav.cart}${ready && count ? ` (${count})` : ""}`}
          >
            <Icon name="bag" className="h-5 w-5" />
            {ready && count > 0 ? (
              <span
                key={lastAdded}
                className="animate-pop absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-vanilla px-1 text-[0.7rem] font-extrabold text-ink ring-1 ring-ink/15"
              >
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-vanilla px-6 pb-10 pt-6 md:hidden"
      >
        <nav aria-label="Móvil" className="flex flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`border-b border-ink/10 py-4 font-display text-2xl ${isActive(l.href) ? "italic text-ink" : "text-ink-soft"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href={`/${locale}/productos`} className="btn btn-primary mt-8 w-full">
          {t.common.orderNow}
        </Link>
      </div>
    </header>
  );
}
