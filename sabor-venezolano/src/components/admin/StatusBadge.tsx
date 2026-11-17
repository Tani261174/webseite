import type { AdminMessages } from "@/lib/i18n/admin";
import type { OrderStatus } from "@/lib/types";

const colors: Record<OrderStatus, string> = {
  nuevo: "bg-ink text-white",
  pendiente: "bg-paper text-ink",
  confirmado: "bg-ink text-white",
  preparacion: "bg-ink text-white",
  listo: "bg-paper text-ink ring-1 ring-ink/20",
  entregado: "bg-ink/10 text-ink",
  cancelado: "bg-danger/15 text-danger",
};

export function StatusBadge({ status, a }: { status: OrderStatus; a: AdminMessages }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${colors[status] || ""}`}>
      {a.status[status] || status}
    </span>
  );
}
