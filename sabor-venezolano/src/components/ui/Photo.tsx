
/**
 * Zeigt ein hochgeladenes Foto – oder einen klar gekennzeichneten Platzhalter,
 * solange noch kein echtes Bild hinterlegt ist.
 */
export function Photo({
  src,
  alt,
  label,
  tag,
  kind = "food",
  className = "",
  priority = false,
}: {
  src: string | null | undefined;
  alt: string;
  label: string; // z. B. "Foto próximamente"
  tag: string; // z. B. "Imagen provisional"
  kind?: "food" | "portrait" | "group";
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${className}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    );
  }
  const compact = label === ""; // kleine Vorschaubilder: nur Symbol
  return (
    <div
      role="img"
      aria-label={`${alt} – ${tag}`}
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-paper text-center text-ink-muted ${className}`}
    >
      {compact ? null : <div className="pointer-events-none absolute inset-3 border border-line" aria-hidden="true" />}
      {kind === "group" ? (
        <svg viewBox="0 0 120 80" className="relative h-1/4 max-h-28 w-auto" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <circle cx="42" cy="26" r="12" />
          <path d="M16 74c3-15 13-23 26-23s23 8 26 23" />
          <circle cx="80" cy="26" r="12" />
          <path d="M54 74c3-15 13-23 26-23s23 8 26 23" />
        </svg>
      ) : kind === "portrait" ? (
        <svg viewBox="0 0 80 80" className="relative h-1/3 max-h-28 w-auto" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <circle cx="40" cy="28" r="13" />
          <path d="M14 72c3-15 13-23 26-23s23 8 26 23" />
        </svg>
      ) : (
        <svg viewBox="0 0 80 60" className="relative h-1/4 max-h-20 w-auto" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <ellipse cx="40" cy="40" rx="32" ry="10" />
          <path d="M14 38c2-14 14-22 26-22s24 8 26 22" />
          <path d="M40 10v6M30 12l2 5M50 12l-2 5" />
        </svg>
      )}
      {compact ? null : <p className="relative mt-4 px-6 font-display text-base italic text-ink-soft">{label}</p>}
      {compact ? null : (
        <span className="absolute left-5 top-5 bg-white px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ink-muted">
          {tag}
        </span>
      )}
    </div>
  );
}
