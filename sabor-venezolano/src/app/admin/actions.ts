"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminConfigured, createSession, destroySession, requireAdmin, verifyPassword } from "@/lib/server/auth";
import {
  addReview,
  deleteInquiry,
  deleteReview,
  getProductById,
  getSettings,
  saveProduct,
  saveSettingsSection,
  setInquiryStatus,
  setProductFlag,
  setProductImage,
  setReviewPublished,
  slugExists,
  updateOrderStatus,
  type ProductInput,
} from "@/lib/server/repo";
import { clientKey, rateLimit } from "@/lib/server/security";
import { saveImage, UploadError } from "@/lib/server/upload";
import { parseEuro } from "@/lib/money";
import { isIsoDate } from "@/lib/ordering";
import { ALLERGENS, ORDER_STATUSES, type Allergen, type OrderStatus } from "@/lib/types";
import type { Bi } from "@/lib/i18n/config";
import type { Settings } from "@/lib/settings";

/* ---------- Hilfsfunktionen ---------- */

const str = (f: FormData, k: string, max = 5000) => String(f.get(k) ?? "").trim().slice(0, max);
const bi = (f: FormData, k: string, max = 5000): Bi => ({ es: str(f, `${k}_es`, max), de: str(f, `${k}_de`, max) });
const bool = (f: FormData, k: string) => f.get(k) === "on";
function int(f: FormData, k: string, min: number, max: number, fallback: number | null) {
  const raw = str(f, k);
  if (raw === "") return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function refresh() {
  revalidatePath("/", "layout");
}

function done(path: string, ok = true, err?: string): never {
  refresh();
  redirect(`${path}${path.includes("?") ? "&" : "?"}${ok ? "saved=1" : `error=${err || "1"}`}`);
}

/* ---------- Anmeldung ---------- */

export async function loginAction(_: unknown, form: FormData) {
  const user = str(form, "user", 100);
  if (!adminConfigured()) return { error: "notConfigured", user };
  const key = clientKey(await headers());
  if (!rateLimit("login", key, 8, 15 * 60 * 1000)) return { error: "limited", user };
  const ok = verifyPassword(user, String(form.get("password") ?? "").slice(0, 200));
  if (!ok) return { error: "wrong", user };
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function setAdminLangAction(form: FormData) {
  const lang = form.get("lang") === "de" ? "de" : "es";
  (await cookies()).set("sv_admin_lang", lang, { path: "/admin", sameSite: "strict", maxAge: 31536000 });
  const back = str(form, "back", 200);
  redirect(back.startsWith("/admin") ? back : "/admin");
}

/* ---------- Bestellungen ---------- */

export async function updateOrderAction(form: FormData) {
  await requireAdmin();
  const id = int(form, "id", 1, 1e9, null);
  const status = str(form, "status") as OrderStatus;
  if (!id || !(ORDER_STATUSES as readonly string[]).includes(status)) done("/admin/pedidos", false);
  updateOrderStatus(id!, status, str(form, "note", 2000));
  done(`/admin/pedidos/${id}`);
}

/* ---------- Produkte ---------- */

export async function saveProductAction(form: FormData) {
  await requireAdmin();
  const idRaw = str(form, "id");
  const id = idRaw ? Number(idRaw) : null;
  const back = id ? `/admin/productos/${id}` : "/admin/productos/nuevo";

  const slug = str(form, "slug", 60).toLowerCase();
  const price = parseEuro(str(form, "price"));
  const name = bi(form, "name", 120);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || price == null || !name.es) done(back, false);
  if (slugExists(slug, id)) done(back, false, "slug");

  const allergens = ALLERGENS.filter((a) => bool(form, `allergen_${a}`)) as Allergen[];
  const variantCount = int(form, "variant_count", 0, 50, 0)!;
  const variants: ProductInput["variants"] = [];
  for (let i = 0; i < variantCount; i++) {
    const vname = bi(form, `v${i}_name`, 80);
    const vid = int(form, `v${i}_id`, 1, 1e9, null);
    if (!vname.es && !vid) continue;
    const vpriceRaw = str(form, `v${i}_price`);
    variants.push({
      id: vid ?? undefined,
      name: vname.es ? vname : { es: "—", de: vname.de },
      priceCents: vpriceRaw ? parseEuro(vpriceRaw) : null,
      active: bool(form, `v${i}_active`) && !!vname.es,
    });
  }

  let image: string | null | undefined = undefined;
  try {
    const uploaded = await saveImage(form.get("image") as File | null);
    if (uploaded) image = uploaded;
    else if (bool(form, "image_remove")) image = null;
  } catch (e) {
    if (e instanceof UploadError) done(back, false, "upload");
    throw e;
  }

  const existing = id ? getProductById(id) : null;
  if (id && !existing) done("/admin/productos", false);

  const newId = saveProduct(id, {
    slug,
    name,
    description: bi(form, "desc", 3000),
    unit: bi(form, "unit", 60),
    priceCents: price!,
    image,
    allergens,
    allergensConfirmed: bool(form, "allergens_confirmed"),
    ingredients: bi(form, "ingredients", 3000),
    foodInfo: bi(form, "foodinfo", 3000),
    active: bool(form, "active"),
    soldOut: bool(form, "sold_out"),
    stock: int(form, "stock", 0, 100000, null),
    maxPerOrder: int(form, "max_per_order", 1, 1000, 50)!,
    leadDays: int(form, "lead_days", 0, 60, null),
    christmas: bool(form, "christmas"),
    seasonal: bool(form, "seasonal"),
    featured: bool(form, "featured"),
    sort: int(form, "sort", 0, 9999, 0)!,
    variants,
  });
  done(`/admin/productos/${newId}`);
}

export async function toggleProductAction(form: FormData) {
  await requireAdmin();
  const id = int(form, "id", 1, 1e9, null);
  const field = str(form, "field") === "sold_out" ? "sold_out" : "active";
  if (id) setProductFlag(id, field, str(form, "value") === "1");
  done("/admin/productos");
}

export async function removeProductImageAction(form: FormData) {
  await requireAdmin();
  const id = int(form, "id", 1, 1e9, null);
  if (id) setProductImage(id, null);
  done(`/admin/productos/${id}`);
}

/* ---------- Vorbestellung & Termine ---------- */

export async function saveAvailabilityAction(form: FormData) {
  await requireAdmin();
  const s = getSettings();
  const blocked: Settings["ordering"]["blockedDates"] = [];
  const count = int(form, "blocked_count", 0, 400, 0)!;
  for (let i = 0; i < count; i++) {
    const date = str(form, `b${i}_date`, 10);
    if (isIsoDate(date) && !bool(form, `b${i}_remove`)) blocked.push({ date, note: str(form, `b${i}_note`, 120) });
  }
  const add = str(form, "new_date", 10);
  if (isIsoDate(add) && !blocked.some((b) => b.date === add)) blocked.push({ date: add, note: str(form, "new_note", 120) });
  blocked.sort((a, b) => a.date.localeCompare(b.date));

  saveSettingsSection("ordering", {
    accepting: bool(form, "accepting"),
    minLeadDays: int(form, "min_lead", 0, 60, s.ordering.minLeadDays)!,
    maxAdvanceDays: int(form, "max_advance", 1, 365, s.ordering.maxAdvanceDays)!,
    closedWeekdays: [0, 1, 2, 3, 4, 5, 6].filter((d) => bool(form, `wd_${d}`)),
    blockedDates: blocked,
  });
  done("/admin/disponibilidad");
}

/* ---------- Texte & Bilder ---------- */

async function imageField(form: FormData, field: string, current: string | null, back: string) {
  try {
    const up = await saveImage(form.get(field) as File | null);
    if (up) return up;
  } catch (e) {
    if (e instanceof UploadError) done(back, false, "upload");
    throw e;
  }
  return bool(form, `${field}_remove`) ? null : current;
}

export async function saveTextsAction(form: FormData) {
  await requireAdmin();
  const s = getSettings();
  const back = "/admin/textos";
  const cooks = [] as unknown as Settings["content"]["cooks"];
  for (const i of [0, 1] as const) {
    cooks[i] = {
      name: str(form, `cook${i}_name`, 80),
      role: bi(form, `cook${i}_role`, 80),
      text: bi(form, `cook${i}_text`, 1200),
      specialties: bi(form, `cook${i}_spec`, 200),
      image: await imageField(form, `cook${i}_image`, s.content.cooks[i].image, back),
    };
  }
  saveSettingsSection("content", {
    heroTitle: bi(form, "heroTitle", 160),
    heroSubtitle: bi(form, "heroSubtitle", 400),
    heroCta: bi(form, "heroCta", 40),
    welcomeTitle: bi(form, "welcomeTitle", 160),
    welcomeText: bi(form, "welcomeText", 2000),
    announcementEnabled: bool(form, "announcementEnabled"),
    announcement: bi(form, "announcement", 200),
    cooks,
  });
  const number = str(form, "wa_number", 20).replace(/\D/g, "");
  if (number.length >= 8) {
    saveSettingsSection("shop", { whatsappNumber: number, whatsappDisplay: str(form, "wa_display", 30) || `+${number}` });
  }
  done(back);
}

export async function saveChristmasAction(form: FormData) {
  await requireAdmin();
  const s = getSettings();
  const back = "/admin/navidad";
  const d = (k: string) => (isIsoDate(str(form, k, 10)) ? str(form, k, 10) : "");
  saveSettingsSection("christmas", {
    enabled: bool(form, "enabled"),
    orderDeadline: d("deadline"),
    periodStart: d("periodStart"),
    periodEnd: d("periodEnd"),
    text: bi(form, "text", 1500),
    image: await imageField(form, "image", s.christmas.image, back),
  });
  done(back);
}

/* ---------- Rechtliches ---------- */

export async function saveCompanyAction(form: FormData) {
  await requireAdmin();
  const s = getSettings();
  const company = { ...s.company };
  for (const k of Object.keys(company) as (keyof Settings["company"])[]) company[k] = str(form, `c_${k}`, 200);
  saveSettingsSection("company", company);
  saveSettingsSection("legal", {
    privacyExtra: bi(form, "privacyExtra", 20000),
    terms: bi(form, "terms", 20000),
    food: bi(form, "food", 20000),
    pickup: bi(form, "pickup", 20000),
  });
  done("/admin/empresa");
}

/* ---------- Nachrichten ---------- */

export async function inquiryAction(form: FormData) {
  await requireAdmin();
  const id = int(form, "id", 1, 1e9, null);
  const op = str(form, "op");
  if (id) {
    if (op === "delete") deleteInquiry(id);
    else if (op === "respondido" || op === "archivado" || op === "nuevo") setInquiryStatus(id, op);
  }
  done("/admin/mensajes");
}

/* ---------- Bewertungen ---------- */

export async function addReviewAction(form: FormData) {
  await requireAdmin();
  const name = str(form, "name", 80);
  const text = str(form, "text", 800);
  if (!name || !text) done("/admin/resenas", false);
  addReview({ name, text, rating: int(form, "rating", 1, 5, 5)!, published: bool(form, "published") });
  done("/admin/resenas");
}

export async function reviewAction(form: FormData) {
  await requireAdmin();
  const id = int(form, "id", 1, 1e9, null);
  const op = str(form, "op");
  if (id) {
    if (op === "delete") deleteReview(id);
    else setReviewPublished(id, op === "publish");
  }
  done("/admin/resenas");
}
