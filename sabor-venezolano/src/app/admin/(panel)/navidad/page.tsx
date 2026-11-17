import { getAdminT } from "@/lib/server/admin-lang";
import { getSettings } from "@/lib/server/repo";
import { saveChristmasAction } from "../../actions";
import { BiField, Card, Check, Field, ImageInput, Notice, PageTitle, SaveBar } from "@/components/admin/Fields";

export default async function ChristmasAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { a } = await getAdminT();
  const sp = await searchParams;
  const x = getSettings().christmas;
  return (
    <form action={saveChristmasAction} className="space-y-6">
      <PageTitle>🎄 {a.nav.christmas}</PageTitle>
      <Notice saved={sp.saved} error={sp.error} a={a} />
      <Card>
        <div className="rounded-xl bg-gold/15 p-4">
          <Check name="enabled" label={a.christmas.enabled} checked={x.enabled} />
        </div>
        <Field label={a.christmas.deadline} name="deadline" type="date" defaultValue={x.orderDeadline} hint={a.christmas.deadlineHint} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={a.christmas.periodStart} name="periodStart" type="date" defaultValue={x.periodStart} />
          <Field label={a.christmas.periodEnd} name="periodEnd" type="date" defaultValue={x.periodEnd} />
        </div>
        <BiField label={a.christmas.text} name="text" value={x.text} a={a} textarea rows={4} />
        <ImageInput name="image" current={x.image} a={a} label={a.christmas.image} />
      </Card>
      <SaveBar a={a} />
    </form>
  );
}
