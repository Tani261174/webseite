import { getAdminT } from "@/lib/server/admin-lang";
import { listReviews } from "@/lib/server/repo";
import { addReviewAction, reviewAction } from "../../actions";
import { Card, Check, Field, Notice, PageTitle } from "@/components/admin/Fields";

export default async function ReviewsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { a } = await getAdminT();
  const sp = await searchParams;
  const reviews = listReviews(false);
  return (
    <div className="space-y-6">
      <PageTitle>{a.nav.reviews}</PageTitle>
      <p className="rounded-2xl border border-rose bg-sage/60 p-4 text-sm">{a.reviews.intro}</p>
      <Notice saved={sp.saved} error={sp.error} a={a} />

      <form action={addReviewAction}>
        <Card title={a.reviews.add}>
          <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
            <Field label={a.reviews.name} name="name" required maxLength={80} />
            <Field label={a.reviews.rating} name="rating" type="number" min={1} max={5} defaultValue={5} />
          </div>
          <Field label={a.reviews.text} name="text" textarea required />
          <Check name="published" label={a.reviews.published} checked={false} />
          <button className="btn btn-primary">{a.reviews.add}</button>
        </Card>
      </form>

      <ul className="space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-2xl border border-rose bg-vanilla p-5">
            <p className="font-bold text-ink">
              {r.name} · {"★".repeat(r.rating)}
              <span className="ml-2 text-xs font-semibold text-ink-muted">{r.published ? a.reviews.published : a.products.hidden}</span>
            </p>
            <p className="mt-2 italic text-ink-soft">“{r.text}”</p>
            <div className="mt-3 flex gap-2">
              <form action={reviewAction}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="op" value={r.published ? "unpublish" : "publish"} />
                <button className="rounded-full px-3 py-2 text-xs font-bold ring-1 ring-rose">
                  {r.published ? a.reviews.unpublish : a.reviews.publish}
                </button>
              </form>
              <form action={reviewAction}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="op" value="delete" />
                <button className="rounded-full px-3 py-2 text-xs font-bold text-danger">{a.common.delete}</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
