import type { AdminMessages } from "@/lib/i18n/admin";
import type { OrderStatus } from "@/lib/types";

const colors: Record<OrderStatus, string> = {
  nuevo: "bg-gold text-bordeaux-deep",
  pendiente: "bg-gold-pale text-cocoa",
  confirmado: "bg-bordeaux text-cream",
  preparacion: "bg-wine text-cream",
  listo: "bg-success text-white",
  entregado: "bg-cocoa/15 text-cocoa",
  cancelado: "bg-danger/15 text-danger",
};

export function StatusBadge({ status, a }: { status: OrderStatus; a: AdminMessages }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${colors[status] || ""}`}>
      {a.status[status] || status}
    </span>
  );
}
