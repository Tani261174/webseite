"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export interface ShopItem {
  slug: string;
  category: string;
  brand: string;
  status: string;
  price: number;
  title: string;
  text: string; // durchsuchbarer Text
  order: number;
}

interface Labels {
  search: string; searchPlaceholder: string; category: string; brand: string; status: string; all: string;
  results: string; resultOne: string; noResults: string; resetFilters: string; sort: string;
  sortOptions: { featured: string; priceAsc: string; priceDesc: string; name: string };
}

type Option = { value: string; label: string };

/**
 * Suche/Filter/Sortierung im Browser. Die Produktkarten werden auf dem Server
 * gerendert und hier nur ein- bzw. ausgeblendet – so bleibt das JavaScript klein.
 */
export function ShopBrowser({ items, cards, labels, categories, brands, statuses }: {
  items: ShopItem[];
  cards: Record<string, React.ReactNode>;
  labels: Labels;
  categories: Option[];
  brands: Option[];
  statuses: Option[];
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setQ(sp.get("q") || "");
    setCategory(sp.get("category") || "");
    setBrand(sp.get("brand") || "");
    setStatus(sp.get("status") || "");
    if (window.location.hash === "#search") document.getElementById("shop-search")?.focus();
  }, []);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    if (brand) sp.set("brand", brand);
    if (status) sp.set("status", status);
    const qs = sp.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [q, category, brand, status]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = items.filter(
      (i) =>
        (!needle || i.text.includes(needle)) &&
        (!category || i.category === category) &&
        (!brand || i.brand === brand) &&
        (!status || i.status === status),
    );
    const sorted = [...list];
    if (sort === "priceAsc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "priceDesc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "name") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else sorted.sort((a, b) => a.order - b.order);
    return sorted;
  }, [items, q, category, brand, status, sort]);

  const reset = () => { setQ(""); setCategory(""); setBrand(""); setStatus(""); setSort("featured"); };
  const select = "field !min-h-11 !rounded-full !py-2 pr-9 text-sm";

  return (
    <div>
      <div className="sticky top-[4.5rem] z-30 -mx-5 border-b border-mist bg-white/90 px-5 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.15fr]">
          <div className="relative">
            <label htmlFor="shop-search" className="sr-only">{labels.search}</label>
            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-smoke" />
            <input id="shop-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={labels.searchPlaceholder}
              className="field !min-h-11 !rounded-full !py-2 !pl-10 text-sm" maxLength={80} />
          </div>
          {[
            { id: "f-cat", label: labels.category, value: category, set: setCategory, opts: categories },
            { id: "f-brand", label: labels.brand, value: brand, set: setBrand, opts: brands },
            { id: "f-status", label: labels.status, value: status, set: setStatus, opts: statuses },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="sr-only">{f.label}</label>
              <select id={f.id} value={f.value} onChange={(e) => f.set(e.target.value)} className={select}>
                <option value="">{f.label}: {labels.all}</option>
                {f.opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label htmlFor="f-sort" className="sr-only">{labels.sort}</label>
            <select id="f-sort" value={sort} onChange={(e) => setSort(e.target.value)} className={select}>
              {Object.entries(labels.sortOptions).map(([k, v]) => <option key={k} value={k}>{labels.sort}: {v}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-sm text-graphite">
        <p aria-live="polite">{visible.length === 1 ? labels.resultOne : labels.results.replace("{count}", String(visible.length))}</p>
        {(q || category || brand || status) ? (
          <button type="button" onClick={reset} className="text-gold-700 underline underline-offset-4 hover:text-ink">{labels.resetFilters}</button>
        ) : null}
      </div>

      {visible.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((i) => <div key={i.slug} className="flex">{cards[i.slug]}</div>)}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-mist p-12 text-center">
          <p className="text-graphite">{labels.noResults}</p>
          <button type="button" onClick={reset} className="btn btn-outline mt-6">{labels.resetFilters}</button>
        </div>
      )}
    </div>
  );
}
