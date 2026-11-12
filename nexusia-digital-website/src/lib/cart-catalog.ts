import type { Locale } from "@/lib/i18n/config";
import { products } from "@/content/products";
import { getBrand } from "@/content/brands";
import type { CartCatalogItem } from "@/components/shop/CartView";

/** Kleine, öffentliche Katalog-Teilmenge für Warenkorb & Kasse (nur kaufbare Produkte). */
export function cartCatalog(locale: Locale): CartCatalogItem[] {
  return products
    .filter((p) => p.status === "available")
    .map((p) => ({ slug: p.slug, title: p.title[locale], brand: getBrand(p.brand)?.name ?? "", priceCents: p.priceCents ?? null, status: p.status, art: p.art, demo: p.demo }));
}
