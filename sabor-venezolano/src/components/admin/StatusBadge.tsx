import type { AdminMessages } from "@/lib/i18n/admin";
import type { OrderStatus } from "@/lib/types";

const colors: Record<OrderStatus, string> = {
  nuevo: "bg-rose text-ink",
  pendiente: "bg-sage text-ink",
  confirmado: "bg-rose text-ink",
  preparacion: "bg-rose text-ink",
  listo: "bg-sage text-ink ring-1 ring-ink/20",
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
