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
    <footer className="bg-velvet text-cream">
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-16 sm:px-6 md:pb-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Logo />
            <p className="mt-5 max-w-xs font-display text-lg italic text-gold-light">“Un pedacito de Venezuela en tu mesa.”</p>
            <p className="mt-3 max-w-xs text-sm text-cream/70">{t.footer.tagline}</p>
          </div>

          <div className="text-center md:text-left">
            <h2 className="eyebrow text-gold">{t.footer.orderVia}</h2>
            <a
              href={waLink(whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-cream hover:text-gold-light"
            >
              <Icon name="whatsapp" className="h-6 w-6 text-[#4fd18b]" />
              {whatsappDisplay}
            </a>
            <ul className="mt-6 space-y-2 text-sm text-cream/75">
              <li><Link className="hover:text-gold-light" href={`/${locale}/productos`}>{t.nav.products}</Link></li>
              <li><Link className="hover:text-gold-light" href={`/${locale}/carrito`}>{t.nav.cart}</Link></li>
              <li><Link className="hover:text-gold-light" href={`/${locale}/contacto`}>{t.nav.contact}</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h2 className="eyebrow text-gold">{t.footer.legal}</h2>
            <ul className="mt-4 space-y-2 text-sm text-cream/75">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link className="hover:text-gold-light" href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Ornament className="mt-14" />
        <p className="mt-6 text-center text-xs text-cream/55">
          © {new Date().getFullYear()} {businessName || "Sabor Venezolano"} · {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
