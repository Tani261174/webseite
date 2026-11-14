import type { Block } from "@/academy/types";
import { Icon } from "@/components/ui/Icon";

/** Stellt Lektionsblöcke sicher dar (reiner Text, kein HTML aus der Datenbank). */
export function LessonBlocks({ blocks, labels }: { blocks: Block[]; labels: { example: string; exercise: string } }) {
  return (
    <div className="space-y-6 text-[1.02rem] leading-[1.8] text-[#2b2b2b]">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h":
            return <h2 key={i} className="display pt-6 text-3xl text-ink sm:text-4xl">{b.text}</h2>;
          case "p":
            return <p key={i}>{b.text}</p>;
          case "list": {
            const L = b.ordered ? "ol" : "ul";
            return (
              <L key={i} className={`space-y-2 pl-5 ${b.ordered ? "list-decimal" : "list-disc"} marker:text-gold-600`}>
                {b.items.map((x, j) => <li key={j}>{x}</li>)}
              </L>
            );
          }
          case "callout":
            return (
              <aside key={i} className="rounded-2xl border border-gold-300/60 bg-gold-50 p-5">
                <p className="flex items-center gap-2 font-semibold text-gold-700"><Icon name="shield" className="h-4 w-4" /> {b.title}</p>
                <p className="mt-2 text-[0.95rem] text-[#4a3a17]">{b.text}</p>
              </aside>
            );
          case "example":
            return (
              <section key={i} className="rounded-2xl border border-mist bg-white p-6 shadow-[var(--shadow-lux)]">
                <p className="eyebrow text-[0.62rem] text-gold-600">{labels.example}</p>
                <h3 className="mt-2 text-lg font-semibold">{b.title}</h3>
                <div className="mt-3 space-y-3 text-[0.97rem]">{b.text.map((x, j) => <p key={j}>{x}</p>)}</div>
              </section>
            );
          case "exercise":
            return (
              <section key={i} className="bg-noir rounded-2xl p-6 text-white">
                <p className="eyebrow text-[0.62rem] text-gold-300">{labels.exercise}</p>
                <h3 className="mt-2 text-lg font-semibold">{b.title}</h3>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-[0.97rem] text-white/80 marker:text-gold-300">
                  {b.steps.map((x, j) => <li key={j}>{x}</li>)}
                </ol>
              </section>
            );
          case "table":
            return (
              <div key={i} className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-ink">{b.head.map((h) => <th key={h} scope="col" className="px-3 py-3 font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="border-b border-mist">
                        {r.map((c, k) => (k === 0 ? <th key={k} scope="row" className="px-3 py-3 font-semibold">{c}</th> : <td key={k} className="px-3 py-3 text-graphite">{c}</td>))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
