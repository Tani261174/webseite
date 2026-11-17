"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { pick } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/messages";
import { formatEuro } from "@/lib/money";
import { checkPickupDate, earliestDate, formatDate, latestDate, weekdayName, type DateRules } from "@/lib/ordering";
import { buildOrderMessage, waLink } from "@/lib/whatsapp";
import { Ornament } from "../brand/Brand";
import { Icon } from "../ui/Icon";
import { Photo } from "../ui/Photo";
import { useCart, useCartLines } from "../providers/CartProvider";
import { useI18n } from "../providers/I18nProvider";
import { QtyStepper } from "./AddToCart";

type FieldErrors = Partial<Record<"date" | "name" | "phone" | "consent" | "form", string>>;

export function CartView({ rules, whatsappNumber, token }: { rules: DateRules; whatsappNumber: string; token: string }) {
  const { locale, t } = useI18n();
  const { ready, setQty, remove, clear } = useCart();
  const { lines, totalCents } = useCartLines();

  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [done, setDone] = useState<{ code: string; url: string } | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  const leadDays = Math.max(rules.minLeadDays, ...lines.map((l) => l.product.leadDays ?? 0));
  const hasSeasonal = lines.some((l) => l.product.seasonal);
  const minDate = useMemo(() => earliestDate(rules, leadDays), [rules, leadDays]);
  const maxDate = useMemo(() => latestDate(rules), [rules]);

  const errorText = (key: string, params: Record<string, string | number> = {}) => {
    const map = t.errors as Record<string, string>;
    return fmt(map[key] || t.errors.generic, {
      date: key === "date_too_far" ? formatDate(maxDate, locale) : formatDate(minDate, locale),
      ...params,
    });
  };

  if (done) {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center sm:p-10" role="status">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-bordeaux text-gold-light">
          <Icon name="whatsapp" className="h-8 w-8" />
        </span>
        <h2 className="mt-5 font-display text-3xl text-bordeaux">{t.cart.successTitle}</h2>
        <p className="mt-3 text-cocoa-soft">{fmt(t.cart.successText, { code: done.code })}</p>
        <a href={done.url} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-7 w-full text-lg">
          <Icon name="whatsapp" className="h-6 w-6" /> {t.cart.openWhatsApp}
        </a>
        <p className="mt-3 text-xs text-cocoa-muted">{t.cart.notOpened}</p>
        <p className="mt-6 rounded-2xl bg-gold/15 p-4 text-sm font-semibold text-bordeaux">{t.cart.confirmNote}</p>
        <Link href={`/${locale}/productos`} className="btn btn-outline mt-6">
          {t.cart.newOrder}
        </Link>
      </div>
    );
  }

  if (!ready) {
    return <div className="card mx-auto h-64 max-w-3xl animate-pulse" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <Icon name="bag" className="mx-auto h-10 w-10 text-gold-dark" />
        <p className="mt-4 font-display text-2xl text-bordeaux">{t.cart.empty}</p>
        <Link href={`/${locale}/productos`} className="btn btn-gold mt-6">
          {t.cart.emptyCta}
        </Link>
      </div>
    );
  }

  const unavailable = lines.filter((l) => !l.product.available);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFallbackUrl(null);
    const errs: FieldErrors = {};
    if (name.trim().length < 2) errs.name = t.errors.nameRequired;
    if (phone && !/^[+0-9 ()/-]{6,30}$/.test(phone.trim())) errs.phone = t.errors.invalid;
    if (!consent) errs.consent = t.errors.consentRequired;
    if (!date) errs.date = t.errors.dateRequired;
    else {
      const de = checkPickupDate(date, rules, { leadDays, hasSeasonal });
      if (de) errs.date = errorText(de);
    }
    if (unavailable.length) errs.form = errorText("soldOut", { name: pick(unavailable[0].product.name, locale) });
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>("[aria-invalid='true'], [data-form-error]")?.focus();
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          items: lines.map((l) => ({ productId: l.product.id, variantId: l.entry.variantId, qty: l.entry.qty })),
          date,
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim(),
          consent,
          token,
          website: honeypot.current?.value || "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.url) {
        setDone({ code: data.code, url: data.url });
        clear();
        window.scrollTo({ top: 0 });
        // Auf dem Handy direkt die WhatsApp-App öffnen; am Computer zeigt die Erfolgsseite den Button.
        if (window.matchMedia("(pointer: coarse)").matches) window.location.href = data.url;
        return;
      }
      if (data.error) {
        const key = String(data.error);
        if (key.startsWith("date_") || key === "paused") setErrors({ date: errorText(key, data.params) });
        else if (key === "nameRequired") setErrors({ name: errorText(key) });
        else if (key === "consentRequired") setErrors({ consent: errorText(key) });
        else setErrors({ form: errorText(key, data.params) });
        if (res.status >= 500) showFallback();
      } else {
        setErrors({ form: t.errors.generic });
        showFallback();
      }
    } catch {
      setErrors({ form: t.cart.fallback });
      showFallback();
    } finally {
      setBusy(false);
    }
  }

  // Notlösung, falls die Website die Anfrage nicht speichern konnte: Nachricht direkt im Browser bauen.
  function showFallback() {
    const text = buildOrderMessage(locale, {
      lines: lines.map((l) => ({
        qty: l.entry.qty,
        name: pick(l.product.name, locale),
        variant: l.variant ? pick(l.variant.name, locale) : null,
        lineCents: l.lineCents,
      })),
      totalCents,
      date,
      name: name.trim(),
      phone: phone.trim(),
      notes: message.trim(),
    });
    setFallbackUrl(waLink(whatsappNumber, text));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
      {/* Positionen */}
      <section aria-labelledby="cart-items" className="card p-4 sm:p-6">
        <h2 id="cart-items" className="sr-only">
          {t.cart.title}
        </h2>
        <ul className="divide-y divide-gold/20">
          {lines.map((l) => {
            const pname = pick(l.product.name, locale);
            const max = Math.max(1, Math.min(l.product.maxPerOrder, l.product.remaining ?? Infinity));
            return (
              <li key={`${l.product.id}-${l.entry.variantId}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-24">
                  <Photo src={l.product.image} alt={pname} label="" tag={t.common.placeholder} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-display text-lg leading-tight text-bordeaux">{pname}</p>
                      {l.variant ? <p className="text-sm text-cocoa-muted">{pick(l.variant.name, locale)}</p> : null}
                      <p className="text-xs text-cocoa-muted">
                        {formatEuro(l.unitCents, locale)} {t.cart.each}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold tabular-nums">{formatEuro(l.lineCents, locale)}</p>
                  </div>
                  {!l.product.available ? (
                    <p className="mt-1 text-sm font-semibold text-danger">{t.common.soldOut}</p>
                  ) : null}
                  <div className="mt-2 flex items-center justify-between">
                    <QtyStepper
                      size="sm"
                      value={l.entry.qty}
                      max={max}
                      label={`${t.common.quantity}: ${pname}`}
                      onChange={(n) => setQty(l.product.id, l.entry.variantId, n)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(l.product.id, l.entry.variantId)}
                      className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm text-cocoa-muted hover:text-danger"
                      aria-label={fmt(t.cart.removeItem, { name: pname })}
                    >
                      <Icon name="trash" className="h-4 w-4" />
                      <span className="hidden sm:inline">{t.cart.remove}</span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 flex items-baseline justify-between border-t border-gold/40 pt-5">
          <span className="eyebrow text-cocoa-muted">{t.cart.total}</span>
          <span className="font-display text-3xl font-semibold text-bordeaux" aria-live="polite">
            {formatEuro(totalCents, locale)}
          </span>
        </div>
        <p className="mt-3 text-sm text-cocoa-muted">{t.cart.paymentNote}</p>
      </section>

      {/* Angaben + Absenden */}
      <form onSubmit={submit} noValidate className="card p-5 sm:p-7" aria-labelledby="order-details">
        <h2 id="order-details" className="font-display text-2xl text-bordeaux">
          {t.cart.detailsTitle}
        </h2>
        <Ornament className="mt-3 justify-start" />

        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-gold/15 p-4 text-sm text-cocoa">
          <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-bordeaux" />
          {t.cart.preorderNote}
        </p>

        <div className="mt-5 space-y-5">
          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm font-bold">
              {t.cart.date} *
            </label>
            <input
              id="date"
              type="date"
              className="field"
              min={minDate}
              max={maxDate}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                const de = e.target.value ? checkPickupDate(e.target.value, rules, { leadDays, hasSeasonal }) : null;
                setErrors((x) => ({ ...x, date: de ? errorText(de) : undefined }));
              }}
              required
              aria-invalid={!!errors.date}
              aria-describedby="date-help date-err"
            />
            <div id="date-help" className="mt-1.5 space-y-0.5 text-xs text-cocoa-muted">
              <p>{fmt(t.cart.dateHelp, { date: formatDate(minDate, locale, true) })}</p>
              {rules.closedWeekdays.length ? (
                <p>{fmt(t.cart.closedDays, { days: rules.closedWeekdays.map((d) => weekdayName(d, locale)).join(", ") })}</p>
              ) : null}
              {rules.blockedDates.filter((d) => d >= minDate).length ? (
                <p>
                  {fmt(t.cart.blockedDates, {
                    dates: rules.blockedDates
                      .filter((d) => d >= minDate)
                      .slice(0, 8)
                      .map((d) => formatDate(d, locale))
                      .join(", "),
                  })}
                </p>
              ) : null}
            </div>
            {errors.date ? (
              <p id="date-err" className="mt-1.5 text-sm font-semibold text-danger">
                {errors.date}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-bold">
              {t.cart.name} *
            </label>
            <input
              id="name"
              className="field"
              autoComplete="name"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-err" : undefined}
            />
            {errors.name ? (
              <p id="name-err" className="mt-1.5 text-sm font-semibold text-danger">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-bold">
              {t.cart.phone}
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              className="field"
              autoComplete="tel"
              maxLength={30}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={!!errors.phone}
              aria-describedby="phone-help"
            />
            <p id="phone-help" className="mt-1.5 text-xs text-cocoa-muted">
              {errors.phone ? <span className="font-semibold text-danger">{errors.phone}</span> : t.cart.phoneHelp}
            </p>
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-bold">
              {t.cart.message}
            </label>
            <textarea
              id="message"
              className="field min-h-24"
              maxLength={800}
              rows={3}
              placeholder={t.cart.messagePlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Honeypot gegen Bots – für Menschen unsichtbar */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" ref={honeypot} tabIndex={-1} autoComplete="off" />
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-cocoa-soft">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 shrink-0 accent-[#4b0710]"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-invalid={!!errors.consent}
              />
              <span>
                {t.cart.consent}{" "}
                <Link href={`/${locale}/legal/privacidad`} className="text-bordeaux underline underline-offset-2" target="_blank">
                  {t.cart.privacy}
                </Link>
                .
              </span>
            </label>
            {errors.consent ? <p className="mt-1.5 text-sm font-semibold text-danger">{errors.consent}</p> : null}
          </div>
        </div>

        {errors.form ? (
          <p data-form-error tabIndex={-1} className="mt-5 rounded-2xl bg-danger/10 p-4 text-sm font-semibold text-danger" role="alert">
            {errors.form}
          </p>
        ) : null}

        <button type="submit" className="btn btn-whatsapp mt-6 min-h-[3.75rem] w-full text-[1.05rem]" disabled={busy}>
          {busy ? t.cart.sending : t.cart.send}
        </button>

        {fallbackUrl ? (
          <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-3 w-full">
            <Icon name="whatsapp" className="h-5 w-5" /> {t.cart.fallbackButton}
          </a>
        ) : null}

        <p className="mt-4 text-center text-sm font-semibold text-wine">{t.cart.confirmNote}</p>
      </form>
    </div>
  );
}
