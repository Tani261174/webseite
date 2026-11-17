import { getAdminT } from "@/lib/server/admin-lang";
import { getSettings } from "@/lib/server/repo";
import { REQUIRED_COMPANY_FIELDS, type Settings } from "@/lib/settings";
import { saveCompanyAction } from "../../actions";
import { BiField, Card, Field, Notice, PageTitle, SaveBar } from "@/components/admin/Fields";

export default async function CompanyAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { a } = await getAdminT();
  const sp = await searchParams;
  const s = getSettings();
  const keys = Object.keys(s.company) as (keyof Settings["company"])[];
  return (
    <form action={saveCompanyAction} className="space-y-6">
      <PageTitle>{a.nav.company}</PageTitle>
      <p className="rounded-2xl border border-rose bg-sage/60 p-4 text-sm">{a.company.intro}</p>
      <Notice saved={sp.saved} error={sp.error} a={a} />
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {keys.map((k) => (
            <div key={k} className={REQUIRED_COMPANY_FIELDS.includes(k) && !s.company[k] ? "rounded-xl ring-2 ring-danger/40 ring-offset-4 ring-offset-vanilla" : ""}>
              <Field label={a.company.fields[k]} name={`c_${k}`} defaultValue={s.company[k]} type={k === "email" ? "email" : "text"} />
            </div>
          ))}
        </div>
      </Card>
      <Card title={a.company.legalTexts} hint={a.company.legalHint}>
        <BiField label={a.company.terms} name="terms" value={s.legal.terms} a={a} textarea rows={8} />
        <BiField label={a.company.pickup} name="pickup" value={s.legal.pickup} a={a} textarea rows={6} />
        <BiField label={a.company.food} name="food" value={s.legal.food} a={a} textarea rows={6} />
        <BiField label={a.company.privacyExtra} name="privacyExtra" value={s.legal.privacyExtra} a={a} textarea rows={6} />
      </Card>
      <SaveBar a={a} />
    </form>
  );
}
