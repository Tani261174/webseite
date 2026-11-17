import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminT } from "@/lib/server/admin-lang";
import { getProductById } from "@/lib/server/repo";
import { centsToInput } from "@/lib/money";
import { getMessages } from "@/lib/i18n/messages";
import { ALLERGENS, type Product } from "@/lib/types";
import { saveProductAction } from "../../../actions";
import { BiField, Card, Check, Field, ImageInput, Notice, PageTitle, SaveBar } from "@/components/admin/Fields";

const empty: Product = {
  id: 0,
  slug: "",
  name: { es: "", de: "" },
  description: { es: "", de: "" },
  unit: { es: "por unidad", de: "pro Stück" },
  priceCents: 0,
  image: null,
  allergens: [],
  allergensConfirmed: false,
  ingredients: { es: "", de: "" },
  foodInfo: { es: "", de: "" },
  active: true,
  soldOut: false,
  stock: null,
  maxPerOrder: 50,
  leadDays: null,
  christmas: false,
  seasonal: false,
  featured: true,
  sort: 10,
  variants: [],
};

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { lang, a } = await getAdminT();
  const { id } = await params;
  const sp = await searchParams;
  const isNew = id === "nuevo";
  const p = isNew ? empty : getProductById(Number(id));
  if (!p) notFound();
  const allergenNames = getMessages(lang).allergens;
  const rows = [...p.variants, ...Array.from({ length: 2 }, () => null)];

  return (
    <form action={saveProductAction} className="space-y-6">
      <Link href="/admin/productos" className="text-sm font-semibold text-ink">← {a.common.back}</Link>
      <PageTitle>{isNew ? a.products.new : p.name[lang] || p.name.es}</PageTitle>
      <Notice saved={sp.saved} error={sp.error} a={a} />
      {!isNew ? <input type="hidden" name="id" value={p.id} /> : null}

      <Card>
        <BiField label={a.products.name} name="name" value={p.name} a={a} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={a.products.slug} name="slug" defaultValue={p.slug} hint={a.products.slugHint} required pattern="[a-z0-9]+(-[a-z0-9]+)*" />
          <Field label={a.products.price} name="price" defaultValue={centsToInput(p.priceCents)} inputMode="decimal" required />
        </div>
        <BiField label={a.products.unit} name="unit" value={p.unit} a={a} hint={a.products.unitHint} />
        <BiField label={a.products.description} name="desc" value={p.description} a={a} textarea rows={4} />
        <ImageInput name="image" current={p.image} a={a} />
      </Card>

      <Card title={a.products.variants} hint={a.products.variantsHint}>
        <input type="hidden" name="variant_count" value={rows.length} />
        {rows.map((v, i) => (
          <div key={i} className="grid gap-3 rounded-xl border border-rose p-3 sm:grid-cols-[1fr_1fr_8rem_auto] sm:items-end">
            {v ? <input type="hidden" name={`v${i}_id`} value={v.id} /> : null}
            <label className="block text-xs font-semibold text-ink-muted">
              🇻🇪 {a.common.es}
              <input name={`v${i}_name_es`} defaultValue={v?.name.es ?? ""} className="field mt-1" placeholder={v ? "" : `+ ${a.products.addVariant}`} />
            </label>
            <label className="block text-xs font-semibold text-ink-muted">
              🇩🇪 {a.common.de}
              <input name={`v${i}_name_de`} defaultValue={v?.name.de ?? ""} className="field mt-1" />
            </label>
            <label className="block text-xs font-semibold text-ink-muted">
              €
              <input name={`v${i}_price`} defaultValue={centsToInput(v?.priceCents)} className="field mt-1" inputMode="decimal" />
            </label>
            <label className="flex items-center gap-2 pb-3 text-sm">
              <input type="checkbox" name={`v${i}_active`} defaultChecked={v ? v.active : true} className="h-5 w-5 accent-[#2e2e31]" />
              {a.products.variantActive}
            </label>
          </div>
        ))}
      </Card>

      <Card title={a.products.allergens}>
        <div className="grid gap-2 sm:grid-cols-2">
          {ALLERGENS.map((al) => (
            <Check key={al} name={`allergen_${al}`} label={allergenNames[al]} checked={p.allergens.includes(al)} />
          ))}
        </div>
        <div className="rounded-xl bg-sage/60 p-4">
          <Check name="allergens_confirmed" label={a.products.allergensConfirmed} checked={p.allergensConfirmed} />
        </div>
        <BiField label={a.products.ingredients} name="ingredients" value={p.ingredients} a={a} textarea />
        <BiField label={a.products.foodInfo} name="foodinfo" value={p.foodInfo} a={a} textarea />
      </Card>

      <Card title={a.nav.availability}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Check name="active" label={a.products.active} checked={p.active} />
          <Check name="sold_out" label={a.products.soldOut} checked={p.soldOut} />
          <Check name="featured" label={a.products.featured} checked={p.featured} />
          <Check name="christmas" label={a.products.christmas} checked={p.christmas} />
          <Check name="seasonal" label={a.products.seasonal} checked={p.seasonal} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={a.products.stock} name="stock" type="number" min={0} defaultValue={p.stock} hint={a.products.stockHint} />
          <Field label={a.products.maxPerOrder} name="max_per_order" type="number" min={1} defaultValue={p.maxPerOrder} />
          <Field label={a.products.leadDays} name="lead_days" type="number" min={0} defaultValue={p.leadDays} hint={a.products.leadDaysHint} />
          <Field label={a.products.sort} name="sort" type="number" min={0} defaultValue={p.sort} />
        </div>
      </Card>

      <SaveBar a={a} />
    </form>
  );
}
