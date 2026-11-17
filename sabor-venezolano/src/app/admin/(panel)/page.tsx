import Link from "next/link";
import { getAdminT } from "@/lib/server/admin-lang";
import { countNewInquiries, getSettings, listOrders, listProducts, orderCounts } from "@/lib/server/repo";
import { REQUIRED_COMPANY_FIELDS } from "@/lib/settings";
import { formatEuro } from "@/lib/money";
import { formatDate } from "@/lib/ordering";
import { PageTitle } from "@/components/admin/Fields";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function Dashboard() {
  const { lang, a } = await getAdminT();
  const s = getSettings();
  const counts = orderCounts();
  const products = listProducts({ includeInactive: true });
  const open = Object.entries(counts)
    .filter(([k]) => k !== "entregado" && k !== "cancelado")
    .reduce((n, [, v]) => n + v, 0);
  const upcoming = listOrders({ status: "open" })
    .sort((x, y) => x.pickupDate.localeCompare(y.pickupDate))
    .slice(0, 8);

  const checks = [
    { ok: REQUIRED_COMPANY_FIELDS.every((k) => s.company[k]), label: a.dashboard.missingCompany, href: "/admin/empresa" },
    {
      ok: products.filter((p) => p.active).every((p) => p.allergensConfirmed),
      label: `${a.dashboard.missingAllergens} (${products.filter((p) => p.active && !p.allergensConfirmed).length})`,
      href: "/admin/productos",
    },
    {
      ok: products.filter((p) => p.active).every((p) => p.image),
      label: `${a.dashboard.missingImages} (${products.filter((p) => p.active && !p.image).length})`,
      href: "/admin/productos",
    },
    { ok: s.content.cooks.every((c) => c.image && !c.name.includes("(")), label: a.dashboard.missingCooks, href: "/admin/textos" },
    { ok: !!(s.legal.terms.es && s.legal.pickup.es && s.legal.food.es), label: a.dashboard.missingLegal, href: "/admin/empresa" },
  ];

  const stats = [
    { label: a.dashboard.newOrders, value: counts.nuevo || 0, href: "/admin/pedidos?status=nuevo" },
    { label: a.dashboard.openOrders, value: open, href: "/admin/pedidos?status=open" },
    { label: a.dashboard.newInquiries, value: countNewInquiries(), href: "/admin/mensajes" },
    { label: a.dashboard.activeProducts, value: products.filter((p) => p.active).length, href: "/admin/productos" },
  ];

  return (
    <div className="space-y-8">
      <PageTitle>{a.dashboard.hello}</PageTitle>
      <p className="rounded-2xl border border-rose bg-sage/60 p-4 text-sm text-ink">{a.dashboard.whatsappNote}</p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((st) => (
          <Link key={st.label} href={st.href} className="rounded-2xl border border-rose bg-vanilla p-5 hover:border-rose">
            <p className="font-display text-4xl text-ink">{st.value}</p>
            <p className="mt-1 text-sm text-ink-muted">{st.label}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-rose bg-vanilla p-5 sm:p-6">
        <h2 className="font-display text-xl text-ink">{a.nav.orders} · {a.orders.open}</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">{a.common.none}</p>
        ) : (
          <ul className="mt-4 divide-y divide-rose">
            {upcoming.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/pedidos/${o.id}`} className="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-sage/40">
                  <span>
                    <strong className="text-ink">{formatDate(o.pickupDate, lang, true)}</strong>
                    <span className="ml-2 text-ink-soft">{o.name}</span>
                    <span className="ml-2 text-xs text-ink-muted">{o.code}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-semibold">{formatEuro(o.totalCents, lang)}</span>
                    <StatusBadge status={o.status} a={a} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-rose bg-vanilla p-5 sm:p-6">
        <h2 className="font-display text-xl text-ink">{a.dashboard.checklist}</h2>
        <ul className="mt-4 space-y-2">
          {checks.map((c) => (
            <li key={c.label}>
              <Link href={c.href} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-vanilla">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${c.ok ? "bg-sage text-ink" : "bg-rose text-ink ring-1 ring-ink/25"}`}>
                  {c.ok ? "✓" : "!"}
                </span>
                <span className={c.ok ? "text-ink-muted line-through" : "font-semibold text-ink"}>{c.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
