/**
 * Generative Platzhalter-Kunstwerke (SVG) in Schwarz, Weiß und Metallic-Gold.
 * Ersetzen später echte Produktfotos – bis dahin bleiben Seiten leicht und schnell.
 */
export type ArtVariant =
  | "lines" | "marble" | "botanical" | "frames" | "grid" | "rose"
  | "book" | "resin" | "wave" | "circuit" | "orbit";

interface Props {
  variant: ArtVariant;
  id: string;
  className?: string;
  title?: string;
}

export function GoldDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7a5a1f" />
        <stop offset="0.22" stopColor="#c9a043" />
        <stop offset="0.38" stopColor="#f8e7ad" />
        <stop offset="0.52" stopColor="#d4af5a" />
        <stop offset="0.7" stopColor="#8f6b28" />
        <stop offset="0.86" stopColor="#ecd08a" />
        <stop offset="1" stopColor="#9c7a35" />
      </linearGradient>
      <radialGradient id={`glow-${id}`} cx="0.5" cy="0.45" r="0.6">
        <stop offset="0" stopColor="#d4af5a" stopOpacity="0.28" />
        <stop offset="1" stopColor="#d4af5a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#141210" />
        <stop offset="1" stopColor="#050505" />
      </linearGradient>
    </defs>
  );
}

export function Artwork({ variant, id, className, title }: Props) {
  const g = `url(#g-${id})`;
  const stroke = { stroke: g, fill: "none", strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 400 300" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} preserveAspectRatio="xMidYMid slice">
      {title ? <title>{title}</title> : null}
      <GoldDefs id={id} />
      <rect width="400" height="300" fill={`url(#bg-${id})`} />
      <rect width="400" height="300" fill={`url(#glow-${id})`} />
      {renderVariant(variant, id, g, stroke)}
    </svg>
  );
}

function renderVariant(variant: ArtVariant, id: string, g: string, s: React.SVGProps<SVGPathElement>) {
  switch (variant) {
    case "lines":
      return (
        <g {...s} strokeWidth="1.4">
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={i} d={`M-20 ${70 + i * 18} C 100 ${20 + i * 22}, 260 ${200 - i * 6}, 420 ${60 + i * 20}`} opacity={0.35 + (i % 3) * 0.25} />
          ))}
          <circle cx="200" cy="150" r="46" strokeWidth="2" />
          <circle cx="200" cy="150" r="54" strokeWidth="0.8" opacity="0.6" />
        </g>
      );
    case "marble":
      return (
        <g>
          <filter id={`m-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="4" seed="7" />
            <feColorMatrix values="0 0 0 0 0.83  0 0 0 0 0.69  0 0 0 0 0.35  0 0 0 9 -4.6" />
          </filter>
          <rect width="400" height="300" filter={`url(#m-${id})`} opacity="0.9" />
          <path d="M-10 230 C 90 160, 160 250, 240 170 S 360 120, 420 80" {...s} strokeWidth="1.6" />
          <path d="M-10 90 C 60 120, 140 40, 230 90 S 330 200, 420 160" {...s} strokeWidth="0.8" opacity="0.6" />
        </g>
      );
    case "botanical":
      return (
        <g {...s} strokeWidth="1.5">
          <path d="M200 280 C 200 210, 195 150, 205 40" />
          {[60, 95, 130, 165, 200].map((y, i) => (
            <g key={y}>
              <path d={`M${202 - i} ${y} C ${240 + i * 4} ${y - 30}, ${270} ${y - 10}, ${290 - i * 6} ${y + 10} C ${260} ${y + 12}, ${230} ${y + 8}, ${202 - i} ${y}`} />
              <path d={`M${200 - i} ${y + 18} C ${160 - i * 4} ${y - 12}, ${130} ${y + 8}, ${110 + i * 6} ${y + 28} C ${140} ${y + 30}, ${170} ${y + 26}, ${200 - i} ${y + 18}`} />
            </g>
          ))}
        </g>
      );
    case "frames":
      return (
        <g {...s}>
          <rect x="110" y="50" width="180" height="200" rx="2" strokeWidth="2.2" />
          <rect x="124" y="64" width="152" height="172" strokeWidth="0.8" />
          {[[110, 50], [290, 50], [110, 250], [290, 250]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6" strokeWidth="1.4" />
          ))}
          <path d="M150 150 h100 M200 110 v80" strokeWidth="0.8" opacity="0.7" />
          <path d="M175 150 a25 25 0 1 0 50 0 a25 25 0 1 0 -50 0" strokeWidth="1.2" />
        </g>
      );
    case "grid":
      return (
        <g>
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 8 }).map((__, c) => {
              const on = (r * 3 + c * 5) % 7 === 0;
              return <rect key={`${r}-${c}`} x={22 + c * 46} y={20 + r * 46} width="36" height="36" rx="3" fill={on ? g : "none"} stroke={g} strokeWidth="0.8" opacity={on ? 0.95 : 0.35} />;
            }),
          )}
        </g>
      );
    case "rose":
      return (
        <g {...s} strokeWidth="1.6" transform="translate(200 128)">
          <path d="M0 -10 C 12 -22, 26 -6, 12 6 C 0 16, -18 6, -14 -8 C -10 -24, 18 -30, 28 -12" />
          <path d="M-26 -2 C -30 -34, 10 -48, 34 -26 C 50 -10, 40 24, 12 30 C -16 36, -40 20, -36 -6" />
          <path d="M-44 6 C -54 -40, -6 -66, 34 -48 C 64 -32, 64 14, 40 36 C 16 56, -30 52, -44 26" opacity="0.85" />
          <path d="M-8 52 C -10 90, -2 120, 0 160" />
          <path d="M-4 96 C 22 80, 44 86, 56 72 C 36 64, 12 74, -4 96" />
          <path d="M-2 120 C -26 106, -46 112, -58 98 C -38 92, -16 100, -2 120" />
        </g>
      );
    case "book":
      return (
        <g {...s} strokeWidth="1.6">
          <path d="M80 80 C 130 66, 170 70, 200 90 C 230 70, 270 66, 320 80 V 230 C 270 216, 230 220, 200 240 C 170 220, 130 216, 80 230 Z" />
          <path d="M200 90 V 240" />
          {[110, 130, 150, 170].map((y) => (
            <path key={y} d={`M105 ${y} C 135 ${y - 6}, 160 ${y - 4}, 182 ${y + 4} M218 ${y + 4} C 240 ${y - 4}, 265 ${y - 6}, 295 ${y}`} strokeWidth="0.8" opacity="0.6" />
          ))}
        </g>
      );
    case "resin":
      return (
        <g>
          <filter id={`r-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.008 0.014" numOctaves="3" seed="11" result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale="90" />
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
          <g filter={`url(#r-${id})`}>
            <ellipse cx="150" cy="140" rx="150" ry="70" fill={g} opacity="0.9" />
            <ellipse cx="270" cy="190" rx="130" ry="44" fill="#f5f1ea" opacity="0.85" />
            <ellipse cx="240" cy="110" rx="90" ry="26" fill="#0b0b0b" />
            <ellipse cx="110" cy="220" rx="110" ry="22" fill="#0b0b0b" opacity="0.9" />
            <ellipse cx="320" cy="80" rx="80" ry="18" fill={g} opacity="0.7" />
          </g>
        </g>
      );
    case "wave":
      return (
        <g {...s}>
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d={`M-10 ${110 + i * 12} C 60 ${80 + i * 12}, 120 ${150 + i * 10}, 200 ${120 + i * 12} S 340 ${90 + i * 12}, 410 ${130 + i * 11}`} strokeWidth={i % 4 === 0 ? 1.8 : 0.7} opacity={0.3 + (i % 4) * 0.18} />
          ))}
        </g>
      );
    case "circuit":
      return (
        <g {...s} strokeWidth="1.3">
          {[[40, 60, 160, 60, 200, 100], [40, 150, 120, 150, 160, 110], [40, 240, 180, 240, 200, 200], [360, 70, 260, 70, 220, 110], [360, 160, 280, 160, 240, 150], [360, 230, 250, 230, 220, 190]].map(([a, b, c, d, e, f], i) => (
            <g key={i}>
              <path d={`M${a} ${b} H${c} L${e} ${f}`} />
              <circle cx={a} cy={b} r="4" fill={g} />
            </g>
          ))}
          <rect x="170" y="100" width="60" height="100" rx="6" strokeWidth="2" />
          <path d="M185 130 h30 M185 150 h30 M185 170 h30" strokeWidth="0.8" />
        </g>
      );
    case "orbit":
    default:
      return (
        <g {...s}>
          <ellipse cx="200" cy="150" rx="150" ry="52" strokeWidth="1" transform="rotate(-18 200 150)" opacity="0.7" />
          <ellipse cx="200" cy="150" rx="150" ry="52" strokeWidth="1" transform="rotate(22 200 150)" opacity="0.5" />
          <ellipse cx="200" cy="150" rx="110" ry="110" strokeWidth="0.6" opacity="0.35" />
          <circle cx="200" cy="150" r="34" fill={g} stroke="none" />
          <circle cx="200" cy="150" r="44" strokeWidth="0.8" />
          <circle cx="62" cy="120" r="5" fill={g} stroke="none" />
          <circle cx="330" cy="200" r="4" fill={g} stroke="none" />
          <circle cx="292" cy="60" r="3" fill={g} stroke="none" />
        </g>
      );
  }
}
