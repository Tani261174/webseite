import { resolveLocale } from "@/lib/i18n/page";
import { href } from "@/lib/site";
import { academyUi } from "@/academy/ui";
import { AcademyNav } from "@/components/academy/AcademyNav";

export default async function AcademyLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await resolveLocale(params);
  const ui = academyUi(locale);
  const base = href(locale, "/academia");
  return (
    <>
      <AcademyNav
        base={base}
        name={ui.name}
        label={ui.nav.label}
        items={[
          { href: base, label: ui.nav.catalog },
          { href: `${base}/mi-aprendizaje`, label: ui.nav.learning },
          { href: `${base}/tutor`, label: ui.nav.tutor },
          { href: `${base}/acceso`, label: ui.nav.access },
        ]}
      />
      {children}
    </>
  );
}
