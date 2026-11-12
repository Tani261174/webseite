"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Warenkorb im Browser (localStorage). Enthält nur Produkt-Slugs – Preise werden
 * IMMER serverseitig aus dem Katalog berechnet, bevor eine Zahlung erstellt wird.
 * Digitale Produkte: Menge ist immer 1.
 */
const KEY = "nexusia-cart-v1";

interface CartState {
  items: string[];
  ready: boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setItems(parsed.filter((x): x is string => typeof x === "string" && /^[a-z0-9-]{1,80}$/.test(x)).slice(0, 50));
    } catch {
      /* Speicher nicht verfügbar – Warenkorb bleibt leer */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignorieren */
    }
  }, [items, ready]);

  const add = useCallback((slug: string) => setItems((cur) => (cur.includes(slug) ? cur : [...cur, slug])), []);
  const remove = useCallback((slug: string) => setItems((cur) => cur.filter((s) => s !== slug)), []);
  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((slug: string) => items.includes(slug), [items]);

  const value = useMemo(() => ({ items, ready, add, remove, clear, has }), [items, ready, add, remove, clear, has]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
