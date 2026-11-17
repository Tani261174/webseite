import type { Bi } from "@/lib/i18n/config";
import type { AdminMessages } from "@/lib/i18n/admin";

export function Card({ title, children, hint }: { title?: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-rose bg-vanilla p-5 shadow-sm sm:p-6">
      {title ? <h2 className="font-display text-xl text-ink">{title}</h2> : null}
      {hint ? <p className="mt-1 text-sm text-ink-muted">{hint}</p> : null}
      <div className={title || hint ? "mt-5 space-y-5" : "space-y-5"}>{children}</div>
    </section>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  hint,
  required,
  textarea,
  rows = 3,
  ...rest
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  hint?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "name">) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ink">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} name={name} defaultValue={defaultValue ?? ""} rows={rows} className="field" required={required} />
      ) : (
        <input id={id} name={name} type={type} defaultValue={defaultValue ?? ""} className="field" required={required} {...rest} />
      )}
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}

/** Zweisprachiges Feld: Spanisch + Deutsch nebeneinander (Handy: untereinander). */
export function BiField({
  label,
  name,
  value,
  a,
  textarea,
  rows,
  hint,
  required,
}: {
  label: string;
  name: string;
  value: Bi;
  a: AdminMessages;
  textarea?: boolean;
  rows?: number;
  hint?: string;
  required?: boolean;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-bold text-ink">{label}</legend>
      <div className="grid gap-3 md:grid-cols-2">
        <LangInput flag="🇻🇪" lang={a.common.es} name={`${name}_es`} value={value.es} textarea={textarea} rows={rows} required={required} />
        <LangInput flag="🇩🇪" lang={a.common.de} name={`${name}_de`} value={value.de} textarea={textarea} rows={rows} />
      </div>
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
    </fieldset>
  );
}

function LangInput({
  flag,
  lang,
  name,
  value,
  textarea,
  rows = 3,
  required,
}: {
  flag: string;
  lang: string;
  name: string;
  value: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
        <span aria-hidden="true">{flag}</span> {lang}
      </span>
      {textarea ? (
        <textarea name={name} defaultValue={value} rows={rows} className="field" required={required} />
      ) : (
        <input name={name} defaultValue={value} className="field" required={required} />
      )}
    </label>
  );
}

export function Check({ name, label, checked, hint }: { name: string; label: string; checked: boolean; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" name={name} defaultChecked={checked} className="mt-0.5 h-5 w-5 shrink-0 accent-[#2e2e31]" />
      <span>
        <span className="font-semibold text-ink">{label}</span>
        {hint ? <span className="block text-xs text-ink-muted">{hint}</span> : null}
      </span>
    </label>
  );
}

export function ImageInput({
  name,
  current,
  a,
  label,
}: {
  name: string;
  current: string | null;
  a: AdminMessages;
  label?: string;
}) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-bold text-ink">{label || a.common.image}</p>
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-24 w-24 overflow-hidden rounded-xl border border-rose bg-sage/60">
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-ink-muted">—</span>
          )}
        </div>
        <div className="space-y-2">
          <input type="file" name={name} accept="image/jpeg,image/png,image/webp" className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-rose file:px-4 file:py-2 file:text-ink" />
          <p className="text-xs text-ink-muted">{a.common.uploadHint}</p>
          {current ? (
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" name={`${name}_remove`} className="h-4 w-4 accent-[#2e2e31]" /> {a.common.removeImage}
            </label>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Notice({ saved, error, a }: { saved?: string; error?: string; a: AdminMessages }) {
  if (saved) return <p role="status" className="rounded-xl bg-sage px-4 py-3 text-sm font-semibold text-ink">{a.common.saved}</p>;
  if (error)
    return (
      <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
        {error === "upload" ? a.common.uploadError : error === "slug" ? a.products.slugTaken : a.common.error}
      </p>
    );
  return null;
}

export function SaveBar({ a }: { a: AdminMessages }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 border-t border-rose bg-vanilla/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
      <button type="submit" className="btn btn-primary w-full sm:w-auto">
        {a.common.save}
      </button>
    </div>
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="font-display text-3xl text-ink">{children}</h1>;
}
