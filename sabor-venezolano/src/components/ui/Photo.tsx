import { StarArc } from "../brand/Brand";

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
  kind?: "food" | "portrait";
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
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden text-center ${
        kind === "portrait" ? "bg-sage text-ink-soft" : "bg-rose text-ink-soft"
      } ${className}`}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(70% 60% at 50% 35%, rgba(255,248,237,0.85), transparent 70%)",
        }}
      />
      {kind === "portrait" ? (
        <svg viewBox="0 0 80 80" className="relative h-1/3 max-h-28 w-auto opacity-70" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <circle cx="40" cy="28" r="13" />
          <path d="M14 72c3-15 13-23 26-23s23 8 26 23" />
        </svg>
      ) : (
        <svg viewBox="0 0 80 60" className="relative h-1/4 max-h-20 w-auto opacity-70" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <ellipse cx="40" cy="40" rx="32" ry="10" />
          <path d="M14 38c2-14 14-22 26-22s24 8 26 22" />
          <path d="M40 10v6M30 12l2 5M50 12l-2 5" />
        </svg>
      )}
      {compact ? null : <StarArc className="relative mt-3 w-16 text-ink-muted" />}
      {compact ? null : <p className="relative mt-1 px-4 font-display text-base italic">{label}</p>}
      {compact ? null : <span
        className={`absolute ${kind === "portrait" ? "bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap" : "left-3 top-3"} rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] ${
          "bg-vanilla/90 text-ink"
        }`}
      >
        {tag}
      </span>}
    </div>
  );
}
