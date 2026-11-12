import { GoldDefs } from "@/components/art/Artwork";

/** NexusIA-Monogramm: ein „N“ aus zwei Linien im Sechseck – Symbol für Verbindung (Nexus). */
export function LogoMark({ className = "h-9 w-9", id = "logo" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <GoldDefs id={id} />
      <path d="M24 2.5 42.6 13.25v21.5L24 45.5 5.4 34.75v-21.5Z" fill="none" stroke={`url(#g-${id})`} strokeWidth="1.6" />
      <path d="M16 33V15l16 18V15" fill="none" stroke={`url(#g-${id})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="15" r="2.2" fill={`url(#g-${id})`} />
      <circle cx="32" cy="33" r="2.2" fill={`url(#g-${id})`} />
    </svg>
  );
}

export function Logo({ tone = "light", id }: { tone?: "light" | "dark"; id?: string }) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark id={id} />
      <span className="flex flex-col leading-none">
        <span className={`display text-[1.55rem] tracking-tight ${tone === "light" ? "text-white" : "text-ink"}`}>
          Nexus<span className="text-gold ml-px font-sans text-[1.2rem] font-semibold tracking-[0.06em]">IA</span>
        </span>
        <span className={`mt-1 text-[0.58rem] font-semibold tracking-[0.48em] ${tone === "light" ? "text-white/60" : "text-graphite"}`}>DIGITAL</span>
      </span>
    </span>
  );
}

/** Rosen-Signet für NeuesIchMitTani (Markenzeichen: rote Rose – hier in Gold, passend zum Dachmarken-Design). */
export function RoseMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
      <path d="M12 8.5c1.2-1.1 2.6-.3 1.9.9-.7 1.1-2.6.9-2.6-.5 0-1.6 2.7-2.2 3.6-.6" />
      <path d="M9.4 9.2c-.4-2.8 3.2-4.1 5.2-2.3 1.6 1.4.8 4.6-1.8 5.2-2.4.6-4.3-.9-3.9-3" />
      <path d="M8 9.6c-.8-4 3.5-6.3 6.9-4.6 2.6 1.4 2.5 5.4.3 7.1-2 1.6-5.6 1.3-6.8-.8" />
      <path d="M12 13.4V21 M12 17c1.8-1.3 3.4-1 4.4-2.2-1.6-.6-3.4.2-4.4 2.2 M12 18.6c-1.6-1-3-.7-3.9-1.8 1.5-.5 3 .2 3.9 1.8" />
    </svg>
  );
}
