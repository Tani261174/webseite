export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({
  eyebrow, title, text, tone = "light", align = "left", as: As = "h2",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  const dark = tone === "dark";
  return (
    <div className={`reveal max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p className={`eyebrow flex items-center gap-3 ${align === "center" ? "justify-center" : ""} ${dark ? "text-gold-300" : "text-gold-600"}`}>
          <span className="gold-hairline inline-block w-8" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <As className={`display mt-4 text-[2.3rem] sm:mt-5 sm:text-6xl ${dark ? "text-white" : "text-ink"}`}>{title}</As>
      {text ? <p className={`mt-6 text-base leading-relaxed sm:text-lg ${dark ? "text-white/65" : "text-graphite"}`}>{text}</p> : null}
    </div>
  );
}

export function PageHero({ eyebrow, title, text, children }: { eyebrow?: string; title: string; text?: string; children?: React.ReactNode }) {
  return (
    <section className="bg-noir grain relative overflow-hidden">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full border border-gold-400/15" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-[22rem] w-[22rem] rounded-full border border-gold-400/10" aria-hidden="true" />
      <Container className="relative py-12 sm:py-28">
        {eyebrow ? (
          <p className="eyebrow intro-1 flex items-center gap-3 text-gold-300">
            <span className="gold-hairline inline-block w-8" aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="display intro-2 mt-4 max-w-4xl text-[2.6rem] leading-[1.05] text-white sm:mt-5 sm:text-7xl">{title}</h1>
        {text ? <p className="intro-3 mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:mt-6 sm:text-lg">{text}</p> : null}
        {children ? <div className="intro-4 mt-8">{children}</div> : null}
      </Container>
    </section>
  );
}

export function DemoBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-gold-500/70 bg-gold-50 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-gold-700">
      {label}
    </span>
  );
}

export function Notice({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "dark" }) {
  return (
    <div role="note" className={`rounded-2xl border px-5 py-4 text-sm leading-relaxed ${tone === "gold" ? "border-gold-300/60 bg-gold-50 text-gold-700" : "border-white/15 bg-white/5 text-white/75"}`}>
      {children}
    </div>
  );
}
