/**
 * Markenelemente: Sternenbogen (die 8 Sterne der venezolanischen Flagge, in Gold),
 * Wortmarke und Ornamente.
 */

function starPath(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${(cx + Math.cos(rad) * rr).toFixed(2)},${(cy + Math.sin(rad) * rr).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

export function StarArc({ className = "", twinkle = false }: { className?: string; twinkle?: boolean }) {
  const stars = Array.from({ length: 8 }, (_, i) => {
    const angle = Math.PI * (0.86 - (0.72 * i) / 7); // Bogen von links nach rechts
    return { x: 60 + Math.cos(angle) * 48, y: 54 - Math.sin(angle) * 38 };
  });
  return (
    <svg viewBox="0 0 120 34" className={className} aria-hidden="true" fill="currentColor">
      {stars.map((s, i) => (
        <path
          key={i}
          d={starPath(s.x, s.y - 14, 3.6)}
          className={twinkle ? "animate-twinkle" : undefined}
          style={twinkle ? { animationDelay: `${i * 0.35}s` } : undefined}
        />
      ))}
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none text-ink ${className}`}>
      <StarArc className="-mb-0.5 w-12 text-flag-blue" />
      <span className="font-display text-[1.4rem] font-medium tracking-[0.2em]">SABOR</span>
      <span className="mt-1 pl-[0.46em] text-[0.52rem] font-semibold tracking-[0.46em]">VENEZOLANO</span>
    </span>
  );
}

/** Kleiner Akzent unter Überschriften: drei feine Striche in Gelb, Blau, Rot. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`} aria-hidden="true">
      <span className="h-[2px] w-5 bg-flag-yellow" />
      <span className="h-[2px] w-5 bg-flag-blue" />
      <span className="h-[2px] w-5 bg-flag-red" />
    </div>
  );
}

/** Dezenter Weihnachtsakzent: Tannenzweig (feine Linien) (nur Linien, keine Kitsch-Optik). */
export function PineSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M6 50 C 40 38, 70 30, 114 12" />
      {Array.from({ length: 11 }, (_, i) => {
        const t = i / 10;
        const x = 6 + t * 108;
        const y = 50 - t * 38 - Math.sin(t * Math.PI) * 4;
        return (
          <g key={i}>
            <path d={`M${x} ${y} l -6 -9`} />
            <path d={`M${x} ${y} l 7 5`} />
          </g>
        );
      })}
      <circle cx="44" cy="44" r="3" fill="currentColor" stroke="none" />
      <circle cx="51" cy="47" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="47" cy="51" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Sparkles({ className = "" }: { className?: string }) {
  const pts = [
    [8, 14, 3], [30, 6, 2], [52, 20, 2.6], [76, 8, 1.8], [96, 18, 3], [116, 4, 2],
  ];
  return (
    <svg viewBox="0 0 124 26" className={className} aria-hidden="true" fill="currentColor">
      {pts.map(([x, y, r], i) => (
        <path key={i} d={starPath(x, y, r)} className="animate-twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
    </svg>
  );
}
