import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminT } from "@/lib/server/admin-lang";
import { getOrder } from "@/lib/server/repo";
import { formatEuro } from "@/lib/money";
import { formatDate } from "@/lib/ordering";
import { ORDER_STATUSES } from "@/lib/types";
import { waLink } from "@/lib/whatsapp";
import { updateOrderAction } from "../../../actions";
import { Card, Notice, PageTitle } from "@/components/admin/Fields";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function OrderDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { lang, a } = await getAdminT();
  const { id } = await params;
  const sp = await searchParams;
  const o = getOrder(Number(id));
  if (!o) notFound();
  const phoneDigits = o.phone.replace(/\D/g, "");
  const replyNumber = phoneDigits.startsWith("00") ? phoneDigits.slice(2) : phoneDigits.startsWith("0") ? `49${phoneDigits.slice(1)}` : phoneDigits;

  return (
    <div className="space-y-6">
      <Link href="/admin/pedidos" className="text-sm font-semibold text-ink">← {a.common.back}</Link>
      <div className="flex flex-wrap items-center gap-3">
        <PageTitle>{o.code}</PageTitle>
        <StatusBadge status={o.status} a={a} />
      </div>
      <Notice saved={sp.saved} error={sp.error} a={a} />
      <p className="text-sm text-ink-muted">{a.orders.source}</p>

      <Card>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div><dt className="text-xs font-bold uppercase text-ink-muted">{a.orders.customer}</dt><dd className="font-semibold">{o.name}</dd></div>
          <div><dt className="text-xs font-bold uppercase text-ink-muted">{a.orders.phone}</dt><dd>{o.phone || "—"}</dd></div>
          <div><dt className="text-xs font-bold uppercase text-ink-muted">{a.orders.date}</dt><dd className="font-semibold text-ink">{formatDate(o.pickupDate, lang, true)}</dd></div>
          <div><dt className="text-xs font-bold uppercase text-ink-muted">{a.orders.created}</dt><dd>{o.createdAt} UTC</dd></div>
        </dl>
        <div>
          <h2 className="text-xs font-bold uppercase text-ink-muted">{a.orders.items}</h2>
          <table className="mt-2 w-full text-sm">
            <tbody>
              {o.items.map((i, k) => (
                <tr key={k} className="border-b border-rose">
                  <td className="py-2">{i.qty} ×</td>
                  <td className="py-2">{i.name}{i.variant ? ` (${i.variant})` : ""}</td>
                  <td className="py-2 text-right">{formatEuro(i.lineCents, lang)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} className="pt-3 font-bold">{a.orders.total}</td>
                <td className="pt-3 text-right font-display text-xl text-ink">{formatEuro(o.totalCents, lang)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {o.message ? (
          <div>
            <h2 className="text-xs font-bold uppercase text-ink-muted">{a.orders.message}</h2>
            <p className="mt-1 whitespace-pre-line">{o.message}</p>
          </div>
        ) : null}
        {replyNumber.length >= 8 ? (
          <a href={waLink(replyNumber)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {a.orders.replyWa}
          </a>
        ) : null}
      </Card>

      <form action={updateOrderAction}>
        <input type="hidden" name="id" value={o.id} />
        <Card title={a.orders.changeStatus}>
          <div className="grid gap-2 sm:grid-cols-2">
            {ORDER_STATUSES.map((s) => (
              <label key={s} className="flex cursor-pointer items-center gap-3 rounded-xl border border-rose px-4 py-3 has-[:checked]:border-rose has-[:checked]:bg-rose/40">
                <input type="radio" name="status" value={s} defaultChecked={o.status === s} className="h-5 w-5 accent-[#2e2e31]" />
                {a.status[s]}
              </label>
            ))}
          </div>
          <div>
            <label htmlFor="note" className="mb-1.5 block text-sm font-bold">{a.orders.note}</label>
            <textarea id="note" name="note" defaultValue={o.adminNote} rows={3} className="field" />
          </div>
          <button className="btn btn-primary">{a.common.save}</button>
        </Card>
      </form>
    </div>
  );
}
