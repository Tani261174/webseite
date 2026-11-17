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
      {items.length === 0 ? <p className="text-ink-muted">{a.common.none}</p> : null}
      <ul className="space-y-3">
        {items.map((m) => {
          const isMail = m.contact.includes("@");
          const digits = m.contact.replace(/\D/g, "");
          return (
            <li key={m.id} className={`rounded-2xl border bg-vanilla p-5 ${m.status === "nuevo" ? "border-rose" : "border-rose opacity-80"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p>
                  <strong className="text-ink">{m.name}</strong>{" "}
                  <span className="text-sm text-ink-muted">· {m.createdAt} UTC · {m.locale.toUpperCase()}</span>
                </p>
                <span className="rounded-full bg-sage/60 px-2.5 py-1 text-xs font-bold">{a.inquiries.status[m.status]}</span>
              </div>
              <p className="mt-1 text-sm">
                {a.inquiries.contact}:{" "}
                {isMail ? (
                  <a className="text-ink underline" href={`mailto:${m.contact}`}>{m.contact}</a>
                ) : (
                  <a className="text-ink underline" href={waLink(digits.startsWith("0") ? `49${digits.slice(1)}` : digits)} target="_blank" rel="noopener noreferrer">
                    {m.contact}
                  </a>
                )}
              </p>
              <p className="mt-3 whitespace-pre-line text-ink-soft">{m.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["respondido", "archivado"] as const).map((op) =>
                  m.status !== op ? (
                    <form key={op} action={inquiryAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="op" value={op} />
                      <button className="rounded-full bg-vanilla px-3 py-2 text-xs font-bold ring-1 ring-rose">
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
