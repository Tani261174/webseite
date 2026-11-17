"use client";

import { useEffect, useState } from "react";
import { pick } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/messages";
import { formatEuro } from "@/lib/money";
import type { CatalogItem } from "@/lib/types";
import { Icon } from "../ui/Icon";
import { useCart } from "../providers/CartProvider";
import { useI18n } from "../providers/I18nProvider";

export function QtyStepper({
  value,
  onChange,
  max,
  label,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  max: number;
  label: string;
  size?: "sm" | "md";
}) {
  const { t } = useI18n();
  const h = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  return (
    <div className="inline-flex items-center rounded-[4px] border border-line bg-white" role="group" aria-label={label}>
      <button
        type="button"
        className={`${h} inline-flex items-center justify-center rounded-full text-ink disabled:opacity-35`}
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value <= (size === "sm" ? 0 : 1)}
        aria-label={t.common.decrease}
      >
        <Icon name="minus" className="h-4 w-4" />
      </button>
      <output className="min-w-8 text-center text-base font-bold tabular-nums" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={`${h} inline-flex items-center justify-center rounded-full text-ink disabled:opacity-35`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={t.common.increase}
      >
        <Icon name="plus" className="h-4 w-4" />
      </button>
    </div>
  );
}

export function AddToCart({ item, layout = "card" }: { item: CatalogItem; layout?: "card" | "detail" }) {
  const { locale, t } = useI18n();
  const { add } = useCart();
  const [variantId, setVariantId] = useState<number | null>(item.variants[0]?.id ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const max = Math.max(1, Math.min(item.maxPerOrder, item.remaining ?? Infinity));

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(id);
  }, [added]);

  if (!item.available) {
    return (
      <p className="inline-flex min-h-12 w-full items-center justify-center rounded-[4px] bg-paper px-5 text-sm font-bold uppercase tracking-wider text-ink-muted">
        {item.remaining === 0 ? t.common.soldOut : t.common.notAvailable}
      </p>
    );
  }

  const variant = item.variants.find((v) => v.id === variantId);
  const unit = variant?.priceCents ?? item.priceCents;

  return (
    <div className="space-y-4">
      {item.variants.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">{t.common.variant}</legend>
          <div className="flex flex-wrap gap-2">
            {item.variants.map((v) => {
              const active = v.id === variantId;
              return (
                <label
                  key={v.id}
                  className={`cursor-pointer rounded-[4px] border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-ink"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={`variant-${item.id}-${layout}`}
                    checked={active}
                    onChange={() => setVariantId(v.id)}
                  />
                  {pick(v.name, locale)}
                  {v.priceCents != null && v.priceCents !== item.priceCents ? ` · ${formatEuro(v.priceCents, locale)}` : ""}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="flex items-center gap-3">
        <QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} max={max} label={t.common.quantity} />
        <button
          type="button"
          className="btn btn-primary flex-1 px-4"
          onClick={() => {
            add(item.id, variantId, qty);
            setAdded(true);
            setQty(1);
          }}
          aria-live="polite"
        >
          {added ? (
            <>
              <Icon name="check" className="h-5 w-5 text-white" /> {t.common.added}
            </>
          ) : (
            <>
              <Icon name="bag" className="h-5 w-5" /> {t.common.addToCart}
            </>
          )}
        </button>
      </div>
      {layout === "detail" ? (
        <p className="text-sm text-ink-muted">
          {qty} × {formatEuro(unit, locale)} = <strong className="text-ink">{formatEuro(unit * qty, locale)}</strong>
        </p>
      ) : null}
      {item.remaining != null && item.remaining <= 20 ? (
        <p className="text-sm font-semibold text-ink">{fmt(t.common.remaining, { n: item.remaining })}</p>
      ) : null}
    </div>
  );
}
