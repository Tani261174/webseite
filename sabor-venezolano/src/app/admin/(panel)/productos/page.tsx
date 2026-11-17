import Link from "next/link";
import { getAdminT } from "@/lib/server/admin-lang";
import { listProducts } from "@/lib/server/repo";
import { formatEuro } from "@/lib/money";
import { toggleProductAction } from "../../actions";
import { Notice, PageTitle } from "@/components/admin/Fields";

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { lang, a } = await getAdminT();
  const sp = await searchParams;
  const products = listProducts({ includeInactive: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageTitle>{a.nav.products}</PageTitle>
        <Link href="/admin/productos/nuevo" className="btn btn-gold">+ {a.products.new}</Link>
      </div>
      <Notice saved={sp.saved} error={sp.error} a={a} />
      <ul className="space-y-3">
        {products.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-gold/30 bg-ivory p-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-deep">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/admin/productos/${p.id}`} className="font-display text-lg text-bordeaux hover:underline">
                {p.name[lang] || p.name.es}
              </Link>
              <p className="text-sm text-cocoa-soft">
                {formatEuro(p.priceCents, lang)} · {p.unit[lang] || p.unit.es} · {a.products.stock}:{" "}
                {p.stock == null ? a.products.unlimited : p.stock}
              </p>
              <p className="mt-1 flex flex-wrap gap-1.5 text-xs">
                {!p.allergensConfirmed ? <span className="rounded-full bg-danger/10 px-2 py-0.5 text-danger">{a.products.allergens} !</span> : null}
                {!p.image ? <span className="rounded-full bg-gold/20 px-2 py-0.5">{a.common.image} —</span> : null}
                {p.christmas ? <span className="rounded-full bg-bordeaux/10 px-2 py-0.5 text-bordeaux">✦ {a.nav.christmas}</span> : null}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <form action={toggleProductAction}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="field" value="active" />
                <input type="hidden" name="value" value={p.active ? "0" : "1"} />
                <button className={`rounded-full px-3 py-2 text-xs font-bold ${p.active ? "bg-success/15 text-success" : "bg-cocoa/10 text-cocoa-muted"}`}>
                  {p.active ? a.products.visible : a.products.hidden}
                </button>
              </form>
              <form action={toggleProductAction}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="field" value="sold_out" />
                <input type="hidden" name="value" value={p.soldOut ? "0" : "1"} />
                <button className={`rounded-full px-3 py-2 text-xs font-bold ${p.soldOut ? "bg-danger/15 text-danger" : "bg-ivory text-cocoa ring-1 ring-gold/40"}`}>
                  {a.products.soldOut}: {p.soldOut ? a.common.yes : a.common.no}
                </button>
              </form>
              <Link href={`/admin/productos/${p.id}`} className="rounded-full bg-bordeaux px-4 py-2 text-xs font-bold text-cream">
                {a.common.edit}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
