import type { Metadata } from "next";
import Link from "next/link";
import { resolveLocale } from "@/lib/i18n/page";
import { href, pageMetadata } from "@/lib/site";
import { cartCatalog } from "@/lib/cart-catalog";
import { Container, Notice } from "@/components/ui/Section";
import { CartView } from "@/components/shop/CartView";
import { Icon } from "@/components/ui/Icon";

type P = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata({ locale, path: "/checkout", title: t.checkout.title, description: t.checkout.description, noindex: true });
}

export default async function CheckoutPage({ params }: P) {
  const { locale, t } = await resolveLocale(params);
  return (
    <section className="bg-pearl py-16 sm:py-24">
      <Container className="max-w-5xl">
        <h1 className="display text-5xl sm:text-6xl">{t.checkout.title}</h1>
        <ol className="mt-8 grid grid-cols-4 gap-2 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
          {t.checkout.steps.map((s, i) => (
            <li key={s} className={`border-t-2 pt-3 ${i <= 1 ? "border-gold-500 text-ink" : "border-mist text-smoke"}`}>{s}</li>
          ))}
        </ol>

        <div className="mt-10 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <CartView mode="summary" catalog={cartCatalog(locale)} labels={{ ...t.cart, demoPrice: t.shop.demoPrice, loading: t.common.loading, vatNotice: t.shop.vatNotice }}
              locale={locale} shopHref={href(locale, "/shop")} checkoutHref={href(locale, "/checkout")} />
          </div>
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-[1.5rem] bg-ink p-7 text-white">
              <p className="flex items-center gap-2 font-semibold text-gold-200"><Icon name="lock" className="h-5 w-5" /> {t.checkout.notActive}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{t.checkout.notActiveText}</p>
              <button type="button" disabled aria-disabled="true" className="btn btn-gold mt-6 w-full">{t.checkout.payWithPaypal}</button>
              <p className="mt-4 text-xs leading-relaxed text-white/45">{t.checkout.secure}</p>
            </div>
            <Notice>{t.checkout.withdrawalNote}</Notice>
            <p className="text-xs text-graphite">
              {t.checkout.termsNote}{" "}
              <Link href={href(locale, "/legal/terms")} className="underline underline-offset-4">{t.legalNav.terms}</Link> ·{" "}
              <Link href={href(locale, "/legal/withdrawal")} className="underline underline-offset-4">{t.legalNav.withdrawal}</Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
