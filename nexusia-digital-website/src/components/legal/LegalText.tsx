/** Rendert Text und hebt {{Platzhalter}} sichtbar hervor. */
export function LegalText({ text }: { text: string }) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("{{") ? <span key={i} className="ph">{p.slice(2, -2)}</span> : <span key={i}>{p}</span>,
      )}
    </>
  );
}
