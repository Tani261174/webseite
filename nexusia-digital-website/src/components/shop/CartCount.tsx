"use client";
import { useCart } from "./CartProvider";

export function CartCount() {
  const { items, ready } = useCart();
  if (!ready || items.length === 0) return null;
  return (
    <span className="bg-gold absolute -right-1.5 -top-1.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full px-1 text-[0.62rem] font-bold text-ink" aria-live="polite">
      {items.length}
    </span>
  );
}
