import { GoldDefs } from "@/components/art/Artwork";

/** Großes, animiertes Gold-Emblem für den Hero-Bereich (reines SVG + CSS). */
export function HeroEmblem() {
  const g = "url(#g-hero)";
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]" aria-hidden="true">
      <div className="absolute inset-[12%] rounded-full bg-gold-400/20 blur-[90px]" />
      <svg viewBox="0 0 500 500" className="spin-slow absolute inset-0 h-full w-full">
        <GoldDefs id="hero" />
        <circle cx="250" cy="250" r="238" fill="none" stroke={g} strokeWidth="0.8" strokeDasharray="2 10" opacity="0.7" />
        <circle cx="250" cy="250" r="205" fill="none" stroke={g} strokeWidth="0.6" opacity="0.45" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={250 + Math.cos(a) * 205} cy={250 + Math.sin(a) * 205} r={i % 3 === 0 ? 4 : 2} fill={g} />;
        })}
      </svg>
      <svg viewBox="0 0 500 500" className="float-slow absolute inset-0 h-full w-full">
        <GoldDefs id="hero2" />
        <ellipse cx="250" cy="250" rx="190" ry="64" fill="none" stroke="url(#g-hero2)" strokeWidth="1.1" transform="rotate(-24 250 250)" opacity="0.8" />
        <ellipse cx="250" cy="250" rx="190" ry="64" fill="none" stroke="url(#g-hero2)" strokeWidth="1.1" transform="rotate(30 250 250)" opacity="0.55" />
        <path d="M250 112 369.5 181v138L250 388 130.5 319V181Z" fill="#0a0a0a" stroke="url(#g-hero2)" strokeWidth="2.4" />
        <path d="M250 134 350 192v116L250 366 150 308V192Z" fill="none" stroke="url(#g-hero2)" strokeWidth="0.8" opacity="0.6" />
        <path d="M205 300V200l90 100V200" fill="none" stroke="url(#g-hero2)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="205" cy="200" r="10" fill="url(#g-hero2)" />
        <circle cx="295" cy="300" r="10" fill="url(#g-hero2)" />
        <circle cx="92" cy="186" r="5" fill="url(#g-hero2)" />
        <circle cx="410" cy="318" r="6" fill="url(#g-hero2)" />
      </svg>
    </div>
  );
}
