"use client";

import { useState } from "react";
import type { AcademyUi } from "@/academy/ui";
import { Icon } from "@/components/ui/Icon";

type Quote = { subtotal: number | null; discount: number; total: number | null; coupon: null | { code: string; ok: true; demo: boolean } | { code: string; ok: false; reason: "unknown" | "expired" | "not_applicable" } };

export function CheckoutBox({ course, initial, ui, locale }: { course: string; initial: Quote; ui: AcademyUi["checkout"]; locale: string }) {
  const [code, setCode] = useState("");
  const [q, setQ] = useState<Quote>(initial);
  const [busy, setBusy] = useState(false);
  const money = (c: number) => new Intl.NumberFormat({ es: "es-ES", de: "de-DE", en: "en-IE" }[locale] || "es-ES", { style: "currency", currency: "EUR" }).format(c / 100);

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/academy/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ course, code: code.trim() }) });
      if (res.ok) setQ(await res.json());
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {q.subtotal !== null ? (
        <>
          <form onSubmit={apply} className="flex gap-2">
            <label htmlFor="coupon" className="sr-only">{ui.coupon}</label>
            <input id="coupon" value={code} onChange={(e) => setCode(e.target.value.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40))} placeholder={ui.coupon} className="field flex-1 uppercase" autoComplete="off" />
            <button type="submit" disabled={busy || !code} className="btn btn-outline">{ui.apply}</button>
          </form>
          {q.coupon ? (
            <p role="status" className={`text-sm ${q.coupon.ok ? "text-emerald-700" : "text-red-800"}`}>
              {q.coupon.ok ? `${ui.couponOk}${q.coupon.demo ? ` ${ui.couponDemo}` : ""}` : ui.couponErrors[q.coupon.reason]}
            </p>
          ) : null}
          <dl className="space-y-2 border-t border-mist pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-graphite">{ui.subtotal}</dt><dd>{money(q.subtotal)}</dd></div>
            {q.discount > 0 ? <div className="flex justify-between text-emerald-700"><dt>{ui.discount}</dt><dd>−{money(q.discount)}</dd></div> : null}
            <div className="flex justify-between border-t border-mist pt-3 text-lg font-semibold"><dt>{ui.total}</dt><dd>{money(q.total ?? 0)}</dd></div>
          </dl>
        </>
      ) : null}

      <fieldset disabled className="space-y-3">
        <legend className="eyebrow text-[0.62rem] text-gold-600">{ui.payWith}</legend>
        <button type="button" className="btn btn-dark w-full" aria-disabled="true">{ui.paypal}</button>
        <button type="button" className="btn btn-outline w-full" aria-disabled="true"><Icon name="lock" className="h-4 w-4" /> {ui.card}</button>
      </fieldset>
      <div role="note" className="rounded-2xl border border-gold-300/60 bg-gold-50 p-4 text-sm text-gold-700">
        <p className="font-semibold">{ui.disabledTitle}</p>
        <p className="mt-1">{ui.disabledText}</p>
      </div>
    </div>
  );
}
