import Link from "next/link";
import { getAdminT } from "@/lib/server/admin-lang";
import { listOrders } from "@/lib/server/repo";
import { formatEuro } from "@/lib/money";
import { formatDate } from "@/lib/ordering";
import { ORDER_STATUSES } from "@/lib/types";
import { PageTitle } from "@/components/admin/Fields";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { lang, a } = await getAdminT();
  const sp = await searchParams;
  const status = sp.status && (sp.status === "open" || (ORDER_STATUSES as readonly string[]).includes(sp.status)) ? sp.status : undefined;
  const q = (sp.q || "").slice(0, 60);
  const orders = listOrders({ status, q });
  const filters = [
    { v: "", label: a.common.all },
    { v: "open", label: a.orders.open },
    ...ORDER_STATUSES.map((s) => ({ v: s, label: a.status[s] })),
  ];

  return (
    <div className="space-y-6">
      <PageTitle>{a.nav.orders}</PageTitle>
      <p className="rounded-md border border-line bg-paper p-4 text-sm text-ink">{a.dashboard.whatsappNote}</p>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <Link
            key={f.v}
            href={f.v ? `/admin/pedidos?status=${f.v}` : "/admin/pedidos"}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
              (status || "") === f.v ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>
      <form className="flex gap-2">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <input name="q" defaultValue={q} className="field" placeholder={`${a.orders.code} / ${a.orders.customer} / ${a.orders.phone}`} />
        <button className="btn btn-outline">{a.common.search}</button>
      </form>

      {orders.length === 0 ? (
        <p className="text-ink-muted">{a.common.none}</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/admin/pedidos/${o.id}`} className="block rounded-md border border-line bg-white p-4 hover:border-line">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-ink">{o.code}</span>
                  <StatusBadge status={o.status} a={a} />
                </div>
                <div className="mt-2 flex flex-wrap justify-between gap-2 text-sm">
                  <span>
                    <strong>{o.name}</strong> · {a.orders.date}: {formatDate(o.pickupDate, lang, true)}
                  </span>
                  <span className="font-semibold">{formatEuro(o.totalCents, lang)}</span>
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  {o.items.map((i) => `${i.qty}× ${i.name}${i.variant ? ` (${i.variant})` : ""}`).join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
