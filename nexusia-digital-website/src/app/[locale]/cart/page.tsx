import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n/page";
import { href, pageMetadata } from "@/lib/site";
import { cartCatalog } from "@/lib/cart-catalog";
import { Container } from "@/components/ui/Section";
import { CartView } from "@/components/shop/CartView";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/cart", title: t.cart.title, description: t.cart.description, noindex: true });
}

export default async function CartPage({ params }: P) {
  const { locale, t } = await resolveLocale(params);
  return (
    <section className="bg-pearl py-16 sm:py-24">
      <Container>
        <h1 className="display text-5xl sm:text-6xl">{t.cart.title}</h1>
        <div className="mt-10">
          <CartView catalog={cartCatalog(locale)} labels={{ ...t.cart, demoPrice: t.shop.demoPrice, loading: t.common.loading, vatNotice: t.shop.vatNotice }}
            locale={locale} shopHref={href(locale, "/shop")} checkoutHref={href(locale, "/checkout")} />
        </div>
      </Container>
    </section>
  );
}
