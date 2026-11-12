"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { Icon } from "@/components/ui/Icon";
import type { ProductStatus } from "@/content/products";

interface Labels {
  addToCart: string;
  added: string;
  inCart: string;
  notifyMe: string;
  getFree: string;
}

export function ProductAction({
  slug, status, labels, newsletterHref, cartHref, size = "md",
}: {
  slug: string;
  status: ProductStatus;
  labels: Labels;
  newsletterHref: string;
  cartHref: string;
  size?: "md" | "lg";
}) {
  const { has, add, ready } = useCart();
  const cls = size === "lg" ? "btn w-full sm:w-auto" : "btn min-h-10 px-4 text-[0.7rem]";

  if (status === "coming-soon") {
    return (
      <Link href={newsletterHref} className={`${cls} btn-outline`}>
        <Icon name="mail" className="h-4 w-4" /> {labels.notifyMe}
      </Link>
    );
  }
  if (status === "free") {
    // Kostenlose Downloads benötigen das (noch nicht aktive) Kundenkonto
    return (
      <button type="button" className={`${cls} btn-outline`} aria-disabled="true" disabled>
        <Icon name="download" className="h-4 w-4" /> {labels.getFree}
      </button>
    );
  }
  const inCart = ready && has(slug);
  if (inCart) {
    return (
      <Link href={cartHref} className={`${cls} btn-dark`}>
        <Icon name="check" className="h-4 w-4" /> {labels.inCart}
      </Link>
    );
  }
  return (
    <button type="button" onClick={() => add(slug)} className={`${cls} btn-gold`} disabled={!ready}>
      <Icon name="cart" className="h-4 w-4" /> {labels.addToCart}
    </button>
  );
}
