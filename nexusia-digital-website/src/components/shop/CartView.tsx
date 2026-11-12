"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { Artwork, type ArtVariant } from "@/components/art/Artwork";
import { Icon } from "@/components/ui/Icon";

export interface CartCatalogItem { slug: string; title: string; brand: string; priceCents: number | null; status: string; art: ArtVariant; demo: boolean }

interface Labels {
  empty: string; continue: string; remove: string; subtotal: string; total: string; checkout: string; digitalNote: string; summary: string; demoPrice: string; loading: string; vatNotice: string;
}

export function useCartLines(catalog: CartCatalogItem[]) {
  const { items, ready } = useCart();
  const lines = items.map((s) => catalog.find((c) => c.slug === s)).filter((x): x is CartCatalogItem => !!x && x.status === "available");
  const total = lines.reduce((sum, l) => sum + (l.priceCents || 0), 0);
  return { lines, total, ready };
}

export function CartView({ catalog, labels, locale, shopHref, checkoutHref, mode = "cart" }: {
  catalog: CartCatalogItem[];
  labels: Labels;
  locale: string;
  shopHref: string;
  checkoutHref: string;
  mode?: "cart" | "summary";
}) {
  const { remove } = useCart();
  const { lines, total, ready } = useCartLines(catalog);
  const fmt = (c: number) => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(c / 100);

  if (!ready) return <p className="py-10 text-graphite" role="status">{labels.loading}</p>;
  if (!lines.length) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-mist p-12 text-center">
        <Icon name="cart" className="mx-auto h-10 w-10 text-gold-500" />
        <p className="display mt-4 text-3xl">{labels.empty}</p>
        <Link href={shopHref} className="btn btn-gold mt-8">{labels.continue}</Link>
      </div>
    );
  }

  return (
    <div className={mode === "cart" ? "grid items-start gap-10 lg:grid-cols-3" : ""}>
      <ul className={`divide-y divide-mist rounded-[1.5rem] border border-mist bg-white ${mode === "cart" ? "lg:col-span-2" : ""}`}>
        {lines.map((l) => (
          <li key={l.slug} className="flex items-center gap-5 p-5">
            <Artwork variant={l.art} id={`cv-${mode}-${l.slug}`} className="h-20 w-24 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-[0.6rem] text-gold-600">{l.brand}</p>
              <p className="display truncate text-2xl">{l.title}</p>
              {l.demo ? <p className="text-[0.65rem] uppercase tracking-[0.14em] text-smoke">{labels.demoPrice}</p> : null}
            </div>
            <div className="text-right">
              <p className="font-semibold">{fmt(l.priceCents || 0)}</p>
              {mode === "cart" ? (
                <button type="button" onClick={() => remove(l.slug)} className="mt-1 text-xs text-graphite underline underline-offset-4 hover:text-ink">{labels.remove}</button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      {mode === "cart" ? (
        <aside className="h-fit rounded-[1.5rem] bg-ink p-7 text-white lg:sticky lg:top-28">
          <h2 className="eyebrow text-gold-300">{labels.summary}</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-white/70"><dt>{labels.subtotal}</dt><dd>{fmt(total)}</dd></div>
            <div className="flex justify-between border-t border-white/10 pt-3 text-lg"><dt>{labels.total}</dt><dd className="display text-gold text-3xl">{fmt(total)}</dd></div>
          </dl>
          <p className="mt-3 text-xs text-white/45">{labels.digitalNote} {labels.vatNotice}</p>
          <Link href={checkoutHref} className="btn btn-gold mt-6 w-full">{labels.checkout} <Icon name="lock" className="h-4 w-4" /></Link>
          <Link href={shopHref} className="mt-4 block text-center text-xs text-white/60 underline underline-offset-4 hover:text-gold-200">{labels.continue}</Link>
        </aside>
      ) : (
        <p className="mt-4 flex justify-between px-2 text-lg"><span>{labels.total}</span><span className="display text-3xl">{fmt(total)}</span></p>
      )}
    </div>
  );
}
