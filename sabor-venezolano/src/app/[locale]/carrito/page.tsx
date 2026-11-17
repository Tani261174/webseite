import type { Metadata } from "next";
import { toDateRules } from "@/lib/ordering";
import { alternates, resolveLocale } from "@/lib/server/page";
import { getSettings } from "@/lib/server/repo";
import { formToken } from "@/lib/server/security";
import { SectionHeading } from "@/components/home/Sections";
import { CartView } from "@/components/shop/CartView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return { title: t.cart.title, alternates: alternates(locale, "/carrito"), robots: { index: false } };
}

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await resolveLocale(params);
  const settings = getSettings();
  return (
    <div className="bg-linen px-4 pb-24 pt-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Sabor Venezolano" title={t.cart.title} />
        <div className="mt-10">
          <CartView rules={toDateRules(settings)} whatsappNumber={settings.shop.whatsappNumber} token={formToken()} />
        </div>
      </div>
    </div>
  );
}
