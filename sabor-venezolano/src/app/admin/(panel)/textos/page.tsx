import { getAdminT } from "@/lib/server/admin-lang";
import { getSettings } from "@/lib/server/repo";
import { saveTextsAction } from "../../actions";
import { BiField, Card, Check, Field, ImageInput, Notice, PageTitle, SaveBar } from "@/components/admin/Fields";

export default async function TextsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { a } = await getAdminT();
  const sp = await searchParams;
  const s = getSettings();
  const c = s.content;
  return (
    <form action={saveTextsAction} className="space-y-6">
      <PageTitle>{a.nav.texts}</PageTitle>
      <Notice saved={sp.saved} error={sp.error} a={a} />

      <Card title={a.texts.hero}>
        <BiField label={a.texts.heroTitle} name="heroTitle" value={c.heroTitle} a={a} required />
        <BiField label={a.texts.heroSubtitle} name="heroSubtitle" value={c.heroSubtitle} a={a} textarea />
        <BiField label={a.texts.heroCta} name="heroCta" value={c.heroCta} a={a} />
      </Card>

      <Card title={a.texts.cooks} hint={a.texts.photoNote}>
        {c.cooks.map((cook, i) => (
          <div key={i} className="space-y-4 rounded-xl border border-gold/30 p-4">
            <h3 className="font-bold text-bordeaux">{a.texts.cook} {i + 1}</h3>
            <Field label={a.texts.cookName} name={`cook${i}_name`} defaultValue={cook.name} />
            <ImageInput name={`cook${i}_image`} current={cook.image} a={a} />
            <BiField label={a.texts.cookRole} name={`cook${i}_role`} value={cook.role} a={a} />
            <BiField label={a.texts.cookText} name={`cook${i}_text`} value={cook.text} a={a} textarea />
            <BiField label={a.texts.cookSpecialties} name={`cook${i}_spec`} value={cook.specialties} a={a} />
          </div>
        ))}
      </Card>

      <Card title={a.texts.welcome}>
        <BiField label={a.texts.welcomeTitle} name="welcomeTitle" value={c.welcomeTitle} a={a} />
        <BiField label={a.texts.welcomeText} name="welcomeText" value={c.welcomeText} a={a} textarea rows={6} />
      </Card>

      <Card title={a.texts.announcement}>
        <Check name="announcementEnabled" label={a.texts.announcementEnabled} checked={c.announcementEnabled} />
        <BiField label={a.texts.announcement} name="announcement" value={c.announcement} a={a} />
      </Card>

      <Card title={a.texts.whatsapp}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={a.texts.whatsappNumber} name="wa_number" defaultValue={s.shop.whatsappNumber} inputMode="numeric" />
          <Field label={a.texts.whatsappDisplay} name="wa_display" defaultValue={s.shop.whatsappDisplay} />
        </div>
      </Card>
      <SaveBar a={a} />
    </form>
  );
}
