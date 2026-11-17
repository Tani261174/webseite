import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { waLink } from "@/lib/whatsapp";
import { Logo, Ornament } from "../brand/Brand";
import { Icon } from "../ui/Icon";

export function Footer({
  locale,
  t,
  whatsappNumber,
  whatsappDisplay,
  businessName,
}: {
  locale: Locale;
  t: Messages;
  whatsappNumber: string;
  whatsappDisplay: string;
  businessName: string;
}) {
  const legal = [
    { href: `/${locale}/legal/impressum`, label: t.legal.impressum },
    { href: `/${locale}/legal/privacidad`, label: t.legal.privacy },
    { href: `/${locale}/legal/alimentos`, label: t.legal.food },
    { href: `/${locale}/legal/condiciones`, label: t.legal.terms },
    { href: `/${locale}/legal/recogida`, label: t.legal.pickup },
  ];
  return (
    <footer className="bg-sage text-ink">
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-16 sm:px-6 md:pb-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Logo />
            <p className="mt-5 max-w-xs font-display text-lg italic text-ink">“Un pedacito de Venezuela en tu mesa.”</p>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">{t.footer.tagline}</p>
          </div>

          <div className="text-center md:text-left">
            <h2 className="eyebrow text-ink-muted">{t.footer.orderVia}</h2>
            <a
              href={waLink(whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-ink hover:text-ink"
            >
              <Icon name="whatsapp" className="h-6 w-6 text-ink" />
              {whatsappDisplay}
            </a>
            <ul className="mt-6 space-y-2 text-sm text-ink-soft">
              <li><Link className="hover:text-ink" href={`/${locale}/productos`}>{t.nav.products}</Link></li>
              <li><Link className="hover:text-ink" href={`/${locale}/carrito`}>{t.nav.cart}</Link></li>
              <li><Link className="hover:text-ink" href={`/${locale}/contacto`}>{t.nav.contact}</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h2 className="eyebrow text-ink-muted">{t.footer.legal}</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link className="hover:text-ink" href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Ornament className="mt-14" />
        <p className="mt-6 text-center text-xs text-ink-muted">
          © {new Date().getFullYear()} {businessName || "Sabor Venezolano"} · {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
