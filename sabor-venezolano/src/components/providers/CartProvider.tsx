"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CatalogItem } from "@/lib/types";

/**
 * Warenkorb im Browser (localStorage). Preise werden NICHT gespeichert –
 * sie kommen immer aktuell vom Server (Katalog) und werden beim Absenden serverseitig neu berechnet.
 */
export type CartEntry = { productId: number; variantId: number | null; qty: number };

type CartCtx = {
  entries: CartEntry[];
  ready: boolean;
  count: number;
  catalog: CatalogItem[];
  add: (productId: number, variantId: number | null, qty: number) => void;
  setQty: (productId: number, variantId: number | null, qty: number) => void;
  remove: (productId: number, variantId: number | null) => void;
  clear: () => void;
  lastAdded: number; // Zeitstempel für kleine Animation
};

const KEY = "sv_cart_v1";
const Ctx = createContext<CartCtx | null>(null);

const same = (a: CartEntry, productId: number, variantId: number | null) =>
  a.productId === productId && (a.variantId ?? null) === (variantId ?? null);

export function CartProvider({ catalog, children }: { catalog: CatalogItem[]; children: React.ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartEntry[];
        if (Array.isArray(parsed)) {
          setEntries(
            parsed
              .filter((e) => Number.isInteger(e.productId) && Number.isInteger(e.qty) && e.qty > 0)
              .slice(0, 50),
          );
        }
      }
    } catch {
      /* kein Speicher verfügbar → leerer Warenkorb */
    }
    loaded.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(entries));
    } catch {
      /* ignorieren */
    }
  }, [entries]);

  // Produkte, die es nicht mehr gibt, still entfernen
  useEffect(() => {
    if (!ready) return;
    setEntries((prev) => {
      const next = prev.filter((e) => {
        const p = catalog.find((c) => c.id === e.productId);
        if (!p) return false;
        if (e.variantId != null && !p.variants.some((v) => v.id === e.variantId)) return false;
        if (e.variantId == null && p.variants.length > 0) return false;
        return true;
      });
      return next.length === prev.length ? prev : next;
    });
  }, [catalog, ready]);

  const maxFor = useCallback(
    (productId: number) => {
      const p = catalog.find((c) => c.id === productId);
      return p ? Math.max(1, Math.min(p.maxPerOrder, p.remaining ?? Infinity)) : 1;
    },
    [catalog],
  );

  const add = useCallback(
    (productId: number, variantId: number | null, qty: number) => {
      setEntries((prev) => {
        const found = prev.find((e) => same(e, productId, variantId));
        if (found) {
          return prev.map((e) => (e === found ? { ...e, qty: Math.min(maxFor(productId), e.qty + qty) } : e));
        }
        return [...prev, { productId, variantId, qty: Math.min(maxFor(productId), qty) }];
      });
      setLastAdded(Date.now());
    },
    [maxFor],
  );

  const setQty = useCallback(
    (productId: number, variantId: number | null, qty: number) => {
      setEntries((prev) =>
        qty <= 0
          ? prev.filter((e) => !same(e, productId, variantId))
          : prev.map((e) => (same(e, productId, variantId) ? { ...e, qty: Math.min(maxFor(productId), qty) } : e)),
      );
    },
    [maxFor],
  );

  const remove = useCallback((productId: number, variantId: number | null) => {
    setEntries((prev) => prev.filter((e) => !same(e, productId, variantId)));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<CartCtx>(
    () => ({
      entries,
      ready,
      count: entries.reduce((s, e) => s + e.qty, 0),
      catalog,
      add,
      setQty,
      remove,
      clear,
      lastAdded,
    }),
    [entries, ready, catalog, add, setQty, remove, clear, lastAdded],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart außerhalb von CartProvider");
  return c;
}

/** Warenkorbzeilen mit aktuellen Preisen aus dem Katalog. */
export function useCartLines() {
  const { entries, catalog } = useCart();
  return useMemo(() => {
    const lines = entries
      .map((e) => {
        const p = catalog.find((c) => c.id === e.productId);
        if (!p) return null;
        const v = e.variantId != null ? p.variants.find((x) => x.id === e.variantId) ?? null : null;
        const unitCents = v?.priceCents ?? p.priceCents;
        return { entry: e, product: p, variant: v, unitCents, lineCents: unitCents * e.qty };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    return { lines, totalCents: lines.reduce((s, l) => s + l.lineCents, 0) };
  }, [entries, catalog]);
}
