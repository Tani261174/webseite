import "server-only";
import { randomInt } from "node:crypto";
import { db, tx } from "./db";
import { defaultSettings, mergeSettings, type Settings } from "../settings";
import {
  ALLERGENS,
  type Allergen,
  type CatalogItem,
  type Inquiry,
  type Order,
  type OrderLine,
  type OrderStatus,
  type Product,
  type Review,
  type Variant,
} from "../types";

type Row = Record<string, unknown>;
const s = (v: unknown) => (v == null ? "" : String(v));
const n = (v: unknown) => Number(v);
const b = (v: unknown) => Number(v) === 1;

/* ------------------------------------------------------------------ */
/* Einstellungen                                                       */
/* ------------------------------------------------------------------ */

export function getSettings(): Settings {
  const rows = db().prepare("SELECT key, value FROM settings").all() as Row[];
  const stored: Record<string, unknown> = {};
  for (const r of rows) {
    try {
      stored[s(r.key)] = JSON.parse(s(r.value));
    } catch {
      /* beschädigter Eintrag → Standardwert */
    }
  }
  return mergeSettings(defaultSettings, stored);
}

export function saveSettingsSection<K extends keyof Settings>(key: K, value: Settings[K]) {
  db()
    .prepare(
      "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
    )
    .run(key, JSON.stringify(value));
}

/* ------------------------------------------------------------------ */
/* Produkte                                                            */
/* ------------------------------------------------------------------ */

function toVariant(r: Row): Variant {
  return {
    id: n(r.id),
    name: { es: s(r.name_es), de: s(r.name_de) },
    priceCents: r.price_cents == null ? null : n(r.price_cents),
    active: b(r.active),
  };
}

function toProduct(r: Row, variants: Variant[]): Product {
  let allergens: Allergen[] = [];
  try {
    allergens = (JSON.parse(s(r.allergens)) as string[]).filter((a): a is Allergen =>
      (ALLERGENS as readonly string[]).includes(a),
    );
  } catch {
    allergens = [];
  }
  return {
    id: n(r.id),
    slug: s(r.slug),
    name: { es: s(r.name_es), de: s(r.name_de) },
    description: { es: s(r.desc_es), de: s(r.desc_de) },
    unit: { es: s(r.unit_es), de: s(r.unit_de) },
    priceCents: n(r.price_cents),
    image: r.image ? s(r.image) : null,
    allergens,
    allergensConfirmed: b(r.allergens_confirmed),
    ingredients: { es: s(r.ingredients_es), de: s(r.ingredients_de) },
    foodInfo: { es: s(r.foodinfo_es), de: s(r.foodinfo_de) },
    active: b(r.active),
    soldOut: b(r.sold_out),
    stock: r.stock == null ? null : n(r.stock),
    maxPerOrder: n(r.max_per_order),
    leadDays: r.lead_days == null ? null : n(r.lead_days),
    christmas: b(r.christmas),
    seasonal: b(r.seasonal),
    featured: b(r.featured),
    sort: n(r.sort),
    variants,
  };
}

export function listProducts(opts: { includeInactive?: boolean } = {}): Product[] {
  const c = db();
  const rows = c
    .prepare(`SELECT * FROM products ${opts.includeInactive ? "" : "WHERE active = 1"} ORDER BY sort, id`)
    .all() as Row[];
  const vrows = c.prepare("SELECT * FROM variants ORDER BY sort, id").all() as Row[];
  return rows.map((r) =>
    toProduct(
      r,
      vrows.filter((v) => n(v.product_id) === n(r.id)).map(toVariant),
    ),
  );
}

export function getProductBySlug(slug: string, includeInactive = false) {
  return listProducts({ includeInactive }).find((p) => p.slug === slug) ?? null;
}

export function getProductById(id: number) {
  return listProducts({ includeInactive: true }).find((p) => p.id === id) ?? null;
}

export function isAvailable(p: Product) {
  return p.active && !p.soldOut && (p.stock == null || p.stock > 0);
}

/** Öffentliche, schlanke Daten für den Warenkorb im Browser. */
export function toCatalogItem(p: Product): CatalogItem {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    unit: p.unit,
    priceCents: p.priceCents,
    image: p.image,
    maxPerOrder: p.maxPerOrder,
    seasonal: p.seasonal,
    available: isAvailable(p),
    remaining: p.stock,
    leadDays: p.leadDays,
    variants: p.variants.filter((v) => v.active).map((v) => ({ id: v.id, name: v.name, priceCents: v.priceCents })),
  };
}

export type ProductInput = Omit<Product, "id" | "variants" | "image"> & {
  image?: string | null;
  variants: { id?: number; name: { es: string; de: string }; priceCents: number | null; active: boolean }[];
};

export function saveProduct(id: number | null, p: ProductInput): number {
  return tx((c) => {
    const values = [
      p.slug, p.name.es, p.name.de, p.description.es, p.description.de, p.unit.es, p.unit.de,
      p.priceCents, JSON.stringify(p.allergens), p.allergensConfirmed ? 1 : 0,
      p.ingredients.es, p.ingredients.de, p.foodInfo.es, p.foodInfo.de,
      p.active ? 1 : 0, p.soldOut ? 1 : 0, p.stock, p.maxPerOrder, p.leadDays,
      p.christmas ? 1 : 0, p.seasonal ? 1 : 0, p.featured ? 1 : 0, p.sort,
    ] as const;
    let pid = id;
    if (pid == null) {
      const r = c
        .prepare(
          `INSERT INTO products (slug, name_es, name_de, desc_es, desc_de, unit_es, unit_de, price_cents, allergens, allergens_confirmed,
            ingredients_es, ingredients_de, foodinfo_es, foodinfo_de, active, sold_out, stock, max_per_order, lead_days,
            christmas, seasonal, featured, sort, image)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        )
        .run(...values, p.image ?? null);
      pid = Number(r.lastInsertRowid);
    } else {
      c.prepare(
        `UPDATE products SET slug=?, name_es=?, name_de=?, desc_es=?, desc_de=?, unit_es=?, unit_de=?, price_cents=?, allergens=?,
          allergens_confirmed=?, ingredients_es=?, ingredients_de=?, foodinfo_es=?, foodinfo_de=?, active=?, sold_out=?, stock=?,
          max_per_order=?, lead_days=?, christmas=?, seasonal=?, featured=?, sort=?, updated_at=datetime('now') WHERE id=?`,
      ).run(...values, pid);
      if (p.image !== undefined) c.prepare("UPDATE products SET image=? WHERE id=?").run(p.image, pid);
    }

    // Varianten abgleichen: vorhandene aktualisieren, neue anlegen, entfernte deaktivieren
    // (nicht löschen, damit alte Bestellungen nachvollziehbar bleiben).
    const existing = (c.prepare("SELECT id FROM variants WHERE product_id=?").all(pid) as Row[]).map((r) => n(r.id));
    const kept = new Set<number>();
    p.variants.forEach((v, i) => {
      if (v.id && existing.includes(v.id)) {
        kept.add(v.id);
        c.prepare("UPDATE variants SET name_es=?, name_de=?, price_cents=?, active=?, sort=? WHERE id=?").run(
          v.name.es, v.name.de, v.priceCents, v.active ? 1 : 0, i, v.id,
        );
      } else if (v.name.es.trim()) {
        c.prepare("INSERT INTO variants (product_id, name_es, name_de, price_cents, active, sort) VALUES (?,?,?,?,?,?)").run(
          pid, v.name.es, v.name.de, v.priceCents, v.active ? 1 : 0, i,
        );
      }
    });
    for (const vid of existing) {
      if (!kept.has(vid)) c.prepare("UPDATE variants SET active=0 WHERE id=?").run(vid);
    }
    return pid!;
  });
}

export function setProductImage(id: number, image: string | null) {
  db().prepare("UPDATE products SET image=?, updated_at=datetime('now') WHERE id=?").run(image, id);
}

export function setProductFlag(id: number, field: "active" | "sold_out", value: boolean) {
  db().prepare(`UPDATE products SET ${field === "active" ? "active" : "sold_out"}=?, updated_at=datetime('now') WHERE id=?`).run(value ? 1 : 0, id);
}

export function slugExists(slug: string, exceptId: number | null) {
  const r = db().prepare("SELECT id FROM products WHERE slug=?").get(slug) as Row | undefined;
  return !!r && n(r.id) !== exceptId;
}

/* ------------------------------------------------------------------ */
/* Bestellungen                                                        */
/* ------------------------------------------------------------------ */

function toOrder(r: Row): Order {
  let items: OrderLine[] = [];
  try {
    items = JSON.parse(s(r.items));
  } catch {
    items = [];
  }
  return {
    id: n(r.id),
    code: s(r.code),
    name: s(r.name),
    phone: s(r.phone),
    pickupDate: s(r.pickup_date),
    message: s(r.message),
    items,
    totalCents: n(r.total_cents),
    status: s(r.status) as OrderStatus,
    locale: s(r.locale),
    adminNote: s(r.admin_note),
    createdAt: s(r.created_at),
    updatedAt: s(r.updated_at),
  };
}

function newCode(c: ReturnType<typeof db>) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (;;) {
    let code = "SV-";
    for (let i = 0; i < 5; i++) code += alphabet[randomInt(alphabet.length)];
    if (!c.prepare("SELECT 1 FROM orders WHERE code=?").get(code)) return code;
  }
}

export class StockError extends Error {
  constructor(public productName: string) {
    super("stock");
  }
}

/**
 * Bestellanfrage speichern und begrenzte Mengen reservieren – alles in einer Transaktion,
 * damit nicht zwei Kunden gleichzeitig das letzte Stück bekommen.
 */
export function createOrder(o: {
  name: string;
  phone: string;
  pickupDate: string;
  message: string;
  items: OrderLine[];
  totalCents: number;
  locale: string;
}) {
  return tx((c) => {
    const need = new Map<number, number>();
    for (const l of o.items) need.set(l.productId, (need.get(l.productId) || 0) + l.qty);
    for (const [pid, qty] of need) {
      const r = c.prepare("SELECT stock, name_es FROM products WHERE id=?").get(pid) as Row | undefined;
      if (!r) throw new StockError(String(pid));
      if (r.stock != null) {
        if (n(r.stock) < qty) throw new StockError(s(r.name_es));
        c.prepare("UPDATE products SET stock = stock - ? WHERE id=?").run(qty, pid);
      }
    }
    const code = newCode(c);
    c.prepare(
      `INSERT INTO orders (code, name, phone, pickup_date, message, items, total_cents, status, locale)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'nuevo', ?)`,
    ).run(code, o.name, o.phone, o.pickupDate, o.message, JSON.stringify(o.items), o.totalCents, o.locale);
    return code;
  });
}

export function listOrders(filter: { status?: string; q?: string } = {}) {
  const where: string[] = [];
  const params: string[] = [];
  if (filter.status) {
    if (filter.status === "open") where.push("status NOT IN ('entregado','cancelado')");
    else {
      where.push("status = ?");
      params.push(filter.status);
    }
  }
  if (filter.q) {
    where.push("(code LIKE ? OR name LIKE ? OR phone LIKE ?)");
    const like = `%${filter.q}%`;
    params.push(like, like, like);
  }
  const rows = db()
    .prepare(`SELECT * FROM orders ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY created_at DESC LIMIT 500`)
    .all(...params) as Row[];
  return rows.map(toOrder);
}

export function getOrder(id: number) {
  const r = db().prepare("SELECT * FROM orders WHERE id=?").get(id) as Row | undefined;
  return r ? toOrder(r) : null;
}

/** Status ändern. Bei Stornierung werden reservierte Mengen wieder freigegeben (und umgekehrt). */
export function updateOrderStatus(id: number, status: OrderStatus, adminNote?: string) {
  tx((c) => {
    const r = c.prepare("SELECT * FROM orders WHERE id=?").get(id) as Row | undefined;
    if (!r) return;
    const order = toOrder(r);
    const reserved = b(r.stock_reserved);
    let nowReserved = reserved;
    if (status === "cancelado" && reserved) {
      for (const l of order.items) c.prepare("UPDATE products SET stock = stock + ? WHERE id=? AND stock IS NOT NULL").run(l.qty, l.productId);
      nowReserved = false;
    } else if (status !== "cancelado" && !reserved) {
      for (const l of order.items)
        c.prepare("UPDATE products SET stock = MAX(0, stock - ?) WHERE id=? AND stock IS NOT NULL").run(l.qty, l.productId);
      nowReserved = true;
    }
    c.prepare("UPDATE orders SET status=?, stock_reserved=?, admin_note=COALESCE(?, admin_note), updated_at=datetime('now') WHERE id=?").run(
      status, nowReserved ? 1 : 0, adminNote ?? null, id,
    );
  });
}

export function orderCounts() {
  const rows = db().prepare("SELECT status, COUNT(*) AS c FROM orders GROUP BY status").all() as Row[];
  const out: Record<string, number> = {};
  for (const r of rows) out[s(r.status)] = n(r.c);
  return out;
}

/* ------------------------------------------------------------------ */
/* Kundenanfragen                                                      */
/* ------------------------------------------------------------------ */

export function createInquiry(i: { name: string; contact: string; message: string; locale: string }) {
  db().prepare("INSERT INTO inquiries (name, contact, message, locale) VALUES (?,?,?,?)").run(i.name, i.contact, i.message, i.locale);
}

export function listInquiries(status?: string): Inquiry[] {
  const rows = db()
    .prepare(`SELECT * FROM inquiries ${status ? "WHERE status=?" : ""} ORDER BY created_at DESC LIMIT 500`)
    .all(...(status ? [status] : [])) as Row[];
  return rows.map((r) => ({
    id: n(r.id),
    name: s(r.name),
    contact: s(r.contact),
    message: s(r.message),
    status: s(r.status) as Inquiry["status"],
    locale: s(r.locale),
    createdAt: s(r.created_at),
  }));
}

export function setInquiryStatus(id: number, status: Inquiry["status"]) {
  db().prepare("UPDATE inquiries SET status=? WHERE id=?").run(status, id);
}

export function deleteInquiry(id: number) {
  db().prepare("DELETE FROM inquiries WHERE id=?").run(id);
}

export function countNewInquiries() {
  return n((db().prepare("SELECT COUNT(*) AS c FROM inquiries WHERE status='nuevo'").get() as Row).c);
}

/* ------------------------------------------------------------------ */
/* Bewertungen (nur echte, vom Admin eingetragene und freigegebene)    */
/* ------------------------------------------------------------------ */

export function listReviews(onlyPublished = true): Review[] {
  const rows = db()
    .prepare(`SELECT * FROM reviews ${onlyPublished ? "WHERE published=1" : ""} ORDER BY created_at DESC`)
    .all() as Row[];
  return rows.map((r) => ({
    id: n(r.id),
    name: s(r.name),
    text: s(r.text),
    rating: n(r.rating),
    published: b(r.published),
    createdAt: s(r.created_at),
  }));
}

export function addReview(r: { name: string; text: string; rating: number; published: boolean }) {
  db().prepare("INSERT INTO reviews (name, text, rating, published) VALUES (?,?,?,?)").run(r.name, r.text, r.rating, r.published ? 1 : 0);
}

export function setReviewPublished(id: number, published: boolean) {
  db().prepare("UPDATE reviews SET published=? WHERE id=?").run(published ? 1 : 0, id);
}

export function deleteReview(id: number) {
  db().prepare("DELETE FROM reviews WHERE id=?").run(id);
}
