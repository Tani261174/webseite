import type { Bi } from "./i18n/config";

export const ALLERGENS = [
  "gluten", "crustaceans", "eggs", "fish", "peanuts", "soy", "milk",
  "nuts", "celery", "mustard", "sesame", "sulphites", "lupin", "molluscs",
] as const;
export type Allergen = (typeof ALLERGENS)[number];

export type Variant = {
  id: number;
  name: Bi;
  priceCents: number | null; // null = Produktpreis
  active: boolean;
};

export type Product = {
  id: number;
  slug: string;
  name: Bi;
  description: Bi;
  unit: Bi; // z. B. "por unidad" / "pro Stück"
  priceCents: number;
  image: string | null;
  allergens: Allergen[];
  allergensConfirmed: boolean; // Admin hat Allergene geprüft
  ingredients: Bi;
  foodInfo: Bi;
  active: boolean; // sichtbar im Shop
  soldOut: boolean; // manuell ausverkauft
  stock: number | null; // null = unbegrenzt
  maxPerOrder: number;
  leadDays: number | null; // null = globale Vorlaufzeit
  christmas: boolean; // im Weihnachtsmenü
  seasonal: boolean; // nur für Abholung in der Weihnachtszeit
  featured: boolean; // auf der Startseite
  sort: number;
  variants: Variant[];
};

/** Für den Browser: nur was der Warenkorb braucht. */
export type CatalogItem = Pick<
  Product,
  "id" | "slug" | "name" | "unit" | "priceCents" | "image" | "maxPerOrder" | "seasonal"
> & {
  available: boolean;
  remaining: number | null;
  leadDays: number | null;
  variants: { id: number; name: Bi; priceCents: number | null }[];
};

export const ORDER_STATUSES = [
  "nuevo", "pendiente", "confirmado", "preparacion", "listo", "entregado", "cancelado",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderLine = {
  productId: number;
  variantId: number | null;
  name: string;
  variant: string | null;
  qty: number;
  unitCents: number;
  lineCents: number;
};

export type Order = {
  id: number;
  code: string;
  name: string;
  phone: string;
  pickupDate: string;
  message: string;
  items: OrderLine[];
  totalCents: number;
  status: OrderStatus;
  locale: string;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
};

export type Inquiry = {
  id: number;
  name: string;
  contact: string;
  message: string;
  status: "nuevo" | "respondido" | "archivado";
  locale: string;
  createdAt: string;
};

export type Review = {
  id: number;
  name: string;
  text: string;
  rating: number;
  published: boolean;
  createdAt: string;
};
