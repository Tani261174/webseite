import { getAdminT } from "@/lib/server/admin-lang";
import { getSettings } from "@/lib/server/repo";
import { formatDate, todayIso, weekdayName } from "@/lib/ordering";
import { saveAvailabilityAction } from "../../actions";
import { Card, Check, Field, Notice, PageTitle, SaveBar } from "@/components/admin/Fields";

export default async function AvailabilityPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { lang, a } = await getAdminT();
  const sp = await searchParams;
  const o = getSettings().ordering;
  const today = todayIso();

  return (
    <form action={saveAvailabilityAction} className="space-y-6">
      <PageTitle>{a.availability.title}</PageTitle>
      <Notice saved={sp.saved} error={sp.error} a={a} />

      <Card>
        <Check name="accepting" label={a.availability.accepting} checked={o.accepting} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={a.availability.minLead} name="min_lead" type="number" min={0} max={60} defaultValue={o.minLeadDays} />
          <Field label={a.availability.maxAdvance} name="max_advance" type="number" min={1} max={365} defaultValue={o.maxAdvanceDays} />
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-bold">{a.availability.closedDays}</legend>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <label key={d} className="flex cursor-pointer items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm has-[:checked]:bg-bordeaux has-[:checked]:text-cream">
                <input type="checkbox" name={`wd_${d}`} defaultChecked={o.closedWeekdays.includes(d)} className="sr-only" />
                {weekdayName(d, lang)}
              </label>
            ))}
          </div>
        </fieldset>
      </Card>

      <Card title={a.availability.blocked} hint={a.availability.blockedHint}>
        <input type="hidden" name="blocked_count" value={o.blockedDates.length} />
        {o.blockedDates.length ? (
          <ul className="space-y-2">
            {o.blockedDates.map((b, i) => (
              <li key={b.date} className={`flex flex-wrap items-center gap-3 rounded-xl border border-gold/30 p-3 ${b.date < today ? "opacity-50" : ""}`}>
                <input type="hidden" name={`b${i}_date`} value={b.date} />
                <strong className="min-w-48">{formatDate(b.date, lang, true)}</strong>
                <input name={`b${i}_note`} defaultValue={b.note} className="field max-w-xs flex-1" aria-label={a.availability.note} />
                <label className="flex items-center gap-2 text-sm text-danger">
                  <input type="checkbox" name={`b${i}_remove`} className="h-4 w-4" /> {a.common.delete}
                </label>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-[12rem_1fr]">
          <Field label={a.availability.addBlocked} name="new_date" type="date" min={today} />
          <Field label={a.availability.note} name="new_note" />
        </div>
      </Card>
      <SaveBar a={a} />
    </form>
  );
}
