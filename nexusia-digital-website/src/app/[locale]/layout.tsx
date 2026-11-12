import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource-variable/manrope/wght.css";
import "../globals.css";

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, localeNames } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { siteUrl, siteName, pageMetadata } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/shop/CartProvider";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#0a0a0a", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    ...pageMetadata({ locale, path: "", title: t.meta.homeTitle, description: t.meta.homeDescription }),
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.homeTitle, template: `%s · ${siteName}` },
    applicationName: siteName,
    icons: { icon: "/icon.svg" },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    brand: ["NexusCreator AI", "NexusStock", "NeuesIchMitTani", "MundoResinaMagica"].map((name) => ({ "@type": "Brand", name })),
  };

  return (
    <html lang={localeNames[locale].htmlLang}>
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <CartProvider>
          <Header locale={locale} t={t} />
          <main id="main">{children}</main>
          <Footer locale={locale} t={t} />
        </CartProvider>
      </body>
    </html>
  );
}
