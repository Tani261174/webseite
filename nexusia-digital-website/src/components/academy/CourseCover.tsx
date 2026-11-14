import type { CoverMotif } from "@/academy/types";

/**
 * Hochwertige, generative Kursbilder (SVG) in Schwarz und Metallic-Gold.
 * Bewusst ohne Plattform-Logos (Markenrechte). Echte Fotos können später je Kurs
 * über das Feld `image` (Admin-Dashboard) hinterlegt werden.
 */
const motifs: Record<CoverMotif, React.ReactNode> = {
  amazon: (
    <>
      <path d="M20 46 60 26l40 20-40 20Z" />
      <path d="M20 46v42l40 20V66M100 46v42l-40 20" />
      <path d="M40 36l40 20v16" />
      <path d="M70 92l14-7M70 99l9-4.5" opacity=".6" />
    </>
  ),
  temu: (
    <>
      <path d="M28 18h42l36 36-41 41-37-37Z" />
      <circle cx="46" cy="36" r="6" />
      <path d="M56 74l26-26" />
      <circle cx="60" cy="52" r="4" />
      <circle cx="78" cy="70" r="4" />
    </>
  ),
  shein: (
    <>
      <path d="M52 34a8 8 0 1 1 8 8v8" />
      <path d="M60 50 14 86h92Z" />
      <path d="M30 86v8M90 86v8" opacity=".5" />
    </>
  ),
  tiktok: (
    <>
      <rect x="16" y="10" width="52" height="98" rx="10" />
      <path d="M34 19h16" />
      <path d="M34 46v24l20-12Z" />
      <path d="M70 62h36l-4 42H74Z" />
      <path d="M79 62v-6a9 9 0 0 1 18 0v6" />
    </>
  ),
  shopify: (
    <>
      <path d="M12 46l10-26h76l10 26" />
      <path d="M12 46c4 9 18 9 24 0 6 9 18 9 24 0 6 9 18 9 24 0 6 9 20 9 24 0" />
      <path d="M20 56v46h80V56" />
      <rect x="49" y="72" width="22" height="30" />
      <rect x="28" y="66" width="14" height="14" opacity=".6" />
      <rect x="78" y="66" width="14" height="14" opacity=".6" />
    </>
  ),
  etsy: (
    <>
      <rect x="30" y="22" width="44" height="9" rx="2" />
      <rect x="30" y="89" width="44" height="9" rx="2" />
      <path d="M36 31v58M68 31v58" />
      <path d="M38 44l28 7M38 57l28 7M38 70l28 7" opacity=".7" />
      <path d="M68 62c18 6 14 26 28 22" />
      <path d="M88 14l14 84" />
      <ellipse cx="89" cy="21" rx="2" ry="5" transform="rotate(-10 89 21)" />
    </>
  ),
  ebay: (
    <>
      <path d="M96 60a36 36 0 0 1-62 25" />
      <path d="M24 60a36 36 0 0 1 62-25" />
      <path d="M86 21v14H72M34 99V85h14" />
      <rect x="47" y="47" width="26" height="26" rx="3" />
      <path d="M47 56h26M60 47v9" opacity=".6" />
    </>
  ),
  aliexpress: (
    <>
      <circle cx="60" cy="60" r="42" />
      <ellipse cx="60" cy="60" rx="18" ry="42" />
      <path d="M18 60h84M24 40h72M24 80h72" opacity=".6" />
      <path d="M6 98C40 70 78 112 114 26" strokeDasharray="4 6" />
      <path d="M106 26l8 0 0 8" />
    </>
  ),
  hotmart: (
    <>
      <rect x="10" y="22" width="100" height="66" rx="7" />
      <path d="M44 102h32M60 88v14" />
      <path d="M60 36l30 13-30 13-30-13Z" />
      <path d="M43 55v12c9 7 25 7 34 0V55" />
      <path d="M90 49v15" />
    </>
  ),
  canva: (
    <>
      <path d="M14 96C34 28 82 112 106 24" />
      <rect x="10" y="92" width="8" height="8" />
      <rect x="102" y="20" width="8" height="8" />
      <path d="M14 96l32-42M106 24 74 66" strokeDasharray="3 5" opacity=".7" />
      <circle cx="46" cy="54" r="3.5" />
      <circle cx="74" cy="66" r="3.5" />
      <path d="M88 78l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" />
    </>
  ),
  youtube: (
    <>
      <rect x="10" y="34" width="72" height="52" rx="9" />
      <path d="M82 52l28-15v46L82 68" />
      <circle cx="46" cy="60" r="15" />
      <circle cx="46" cy="60" r="6" />
      <circle cx="22" cy="44" r="2.5" />
    </>
  ),
  marketing: (
    <>
      <path d="M12 26h96L72 66v36l-24-12V66Z" />
      <path d="M26 40h68M40 54h40" opacity=".7" />
      <circle cx="36" cy="12" r="3.5" />
      <circle cx="60" cy="7" r="3.5" />
      <circle cx="84" cy="13" r="3.5" />
      <path d="M60 106v8" />
    </>
  ),
};

export function CourseCover({ motif, id, number, className = "", image, alt = "" }: { motif: CoverMotif; id: string; number?: number; className?: string; image?: string; alt?: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={alt} className={`object-cover ${className}`} loading="lazy" />;
  }
  return (
    <svg viewBox="0 0 400 250" className={className} role="img" aria-label={alt} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`cg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7a5a1f" />
          <stop offset="0.25" stopColor="#c9a043" />
          <stop offset="0.42" stopColor="#f8e7ad" />
          <stop offset="0.58" stopColor="#d4af5a" />
          <stop offset="0.78" stopColor="#8f6b28" />
          <stop offset="1" stopColor="#ecd08a" />
        </linearGradient>
        <radialGradient id={`cr-${id}`} cx="0.62" cy="0.42" r="0.65">
          <stop offset="0" stopColor="#d4af5a" stopOpacity="0.26" />
          <stop offset="1" stopColor="#d4af5a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`cb-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15120d" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
      </defs>
      <rect width="400" height="250" fill={`url(#cb-${id})`} />
      <rect width="400" height="250" fill={`url(#cr-${id})`} />
      <g fill="none" stroke={`url(#cg-${id})`} strokeWidth="0.8" opacity="0.35">
        <circle cx="250" cy="110" r="96" />
        <circle cx="250" cy="110" r="132" />
        <path d="M0 214h400" />
      </g>
      <g transform="translate(190 50) scale(1.25)" fill="none" stroke={`url(#cg-${id})`} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        {motifs[motif]}
      </g>
      {number ? (
        <text x="28" y="56" fill={`url(#cg-${id})`} fontFamily="Cormorant Garamond, Georgia, serif" fontSize="44" fontWeight="500">
          {String(number).padStart(2, "0")}
        </text>
      ) : null}
      <text x="28" y="232" fill="#ffffff" fillOpacity="0.55" fontFamily="Manrope Variable, system-ui, sans-serif" fontSize="9.5" letterSpacing="3.2">
        ACADEMIA NEXUSIA DIGITAL
      </text>
    </svg>
  );
}
