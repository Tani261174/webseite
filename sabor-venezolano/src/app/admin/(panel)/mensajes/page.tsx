import { getAdminT } from "@/lib/server/admin-lang";
import { listInquiries } from "@/lib/server/repo";
import { waLink } from "@/lib/whatsapp";
import { inquiryAction } from "../../actions";
import { Notice, PageTitle } from "@/components/admin/Fields";

export default async function InquiriesAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { a } = await getAdminT();
  const sp = await searchParams;
  const items = listInquiries();

  return (
    <div className="space-y-6">
      <PageTitle>{a.nav.inquiries}</PageTitle>
      <Notice saved={sp.saved} error={sp.error} a={a} />
      {items.length === 0 ? <p className="text-cocoa-muted">{a.common.none}</p> : null}
      <ul className="space-y-3">
        {items.map((m) => {
          const isMail = m.contact.includes("@");
          const digits = m.contact.replace(/\D/g, "");
          return (
            <li key={m.id} className={`rounded-2xl border bg-ivory p-5 ${m.status === "nuevo" ? "border-gold" : "border-gold/30 opacity-80"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p>
                  <strong className="text-bordeaux">{m.name}</strong>{" "}
                  <span className="text-sm text-cocoa-muted">· {m.createdAt} UTC · {m.locale.toUpperCase()}</span>
                </p>
                <span className="rounded-full bg-cream-deep px-2.5 py-1 text-xs font-bold">{a.inquiries.status[m.status]}</span>
              </div>
              <p className="mt-1 text-sm">
                {a.inquiries.contact}:{" "}
                {isMail ? (
                  <a className="text-bordeaux underline" href={`mailto:${m.contact}`}>{m.contact}</a>
                ) : (
                  <a className="text-bordeaux underline" href={waLink(digits.startsWith("0") ? `49${digits.slice(1)}` : digits)} target="_blank" rel="noopener noreferrer">
                    {m.contact}
                  </a>
                )}
              </p>
              <p className="mt-3 whitespace-pre-line text-cocoa-soft">{m.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["respondido", "archivado"] as const).map((op) =>
                  m.status !== op ? (
                    <form key={op} action={inquiryAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="op" value={op} />
                      <button className="rounded-full bg-ivory px-3 py-2 text-xs font-bold ring-1 ring-gold/40">
                        {op === "respondido" ? a.inquiries.markAnswered : a.inquiries.archive}
                      </button>
                    </form>
                  ) : null,
                )}
                <form action={inquiryAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="op" value="delete" />
                  <button className="rounded-full px-3 py-2 text-xs font-bold text-danger">{a.common.delete}</button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
