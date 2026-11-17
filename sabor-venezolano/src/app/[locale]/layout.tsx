import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/500-italic.css";
import "@fontsource-variable/manrope";
import "../globals.css";

import type { Metadata, Viewport } from "next";
import { localeInfo, pick } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale, siteUrl } from "@/lib/server/page";
import { getSettings, listProducts, toCatalogItem } from "@/lib/server/repo";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCart } from "@/components/layout/StickyCart";

// Immer aktuell aus der Datenbank rendern (Preise, Verfügbarkeit, Spam-Schutz-Token).
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#4B0710",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(locale === "de" ? "de" : "es");
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: t.meta.title, template: "%s · Sabor Venezolano" },
    description: t.meta.description,
    applicationName: "Sabor Venezolano",
    openGraph: {
      type: "website",
      siteName: "Sabor Venezolano",
      locale: localeInfo[locale === "de" ? "de" : "es"].og,
      title: t.meta.title,
      description: t.meta.description,
    },
    icons: { icon: "/icon.svg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await resolveLocale(params);
  const settings = getSettings();
  const catalog = listProducts().map(toCatalogItem);

  return (
    <html lang={localeInfo[locale].htmlLang}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-bordeaux-deep"
        >
          {t.common.skip}
        </a>
        <I18nProvider locale={locale} t={t}>
          <CartProvider catalog={catalog}>
            {settings.content.announcementEnabled && pick(settings.content.announcement, locale) ? (
              <div className="bg-gold px-4 py-2 text-center text-sm font-semibold text-bordeaux-deep">
                {pick(settings.content.announcement, locale)}
              </div>
            ) : null}
            <Header christmas={settings.christmas.enabled} />
            <main id="main">{children}</main>
            <Footer
              locale={locale}
              t={t}
              whatsappNumber={settings.shop.whatsappNumber}
              whatsappDisplay={settings.shop.whatsappDisplay}
              businessName={settings.company.businessName}
            />
            <StickyCart whatsappNumber={settings.shop.whatsappNumber} />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
