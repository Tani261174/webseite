/**
 * Sehr einfacher, sicherer Text-Renderer für im Admin gepflegte Texte (kein HTML!):
 *   "## Überschrift"   → Zwischenüberschrift
 *   "- Punkt"          → Aufzählung
 *   Leerzeile          → neuer Absatz
 */
export function SimpleText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          const [head, ...rest] = block.split("\n");
          return (
            <div key={i}>
              <h2>{head.slice(3)}</h2>
              {rest.length ? <SimpleText text={rest.join("\n")} /> : null}
            </div>
          );
        }
        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <span key={j}>
                {j > 0 ? <br /> : null}
                {l}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}
