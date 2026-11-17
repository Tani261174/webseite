import { requireAdmin } from "@/lib/server/auth";
import { getAdminT } from "@/lib/server/admin-lang";
import { countNewInquiries, orderCounts } from "@/lib/server/repo";
import { logoutAction, setAdminLangAction } from "../actions";
import { AdminNav, BackInput } from "@/components/admin/AdminNav";
import { Logo } from "@/components/brand/Brand";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const { lang, a } = await getAdminT();
  const counts = orderCounts();

  const links = [
    { href: "/admin", label: a.nav.dashboard },
    { href: "/admin/pedidos", label: a.nav.orders, badge: counts.nuevo || 0 },
    { href: "/admin/productos", label: a.nav.products },
    { href: "/admin/disponibilidad", label: a.nav.availability },
    { href: "/admin/navidad", label: a.nav.christmas },
    { href: "/admin/textos", label: a.nav.texts },
    { href: "/admin/mensajes", label: a.nav.inquiries, badge: countNewInquiries() },
    { href: "/admin/resenas", label: a.nav.reviews },
    { href: "/admin/empresa", label: a.nav.company },
  ];

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[250px_1fr]">
      <aside className="bg-velvet px-4 pb-3 pt-4 text-cream lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:py-6">
        <div className="mb-4 flex items-center justify-between lg:mb-8 lg:flex-col lg:gap-4">
          <Logo className="scale-90" />
          <div className="flex items-center gap-2 lg:w-full lg:flex-col lg:items-stretch">
            <form action={setAdminLangAction}>
              <input type="hidden" name="lang" value={lang === "es" ? "de" : "es"} />
              <BackInput />
              <button className="rounded-full border border-gold/50 px-3 py-1.5 text-xs font-bold text-gold-light lg:w-full">
                {lang === "es" ? "🇩🇪" : "🇻🇪"} {a.common.switchLang}
              </button>
            </form>
            <a href="/es" target="_blank" className="rounded-full border border-cream/30 px-3 py-1.5 text-center text-xs font-bold text-cream/85">
              {a.nav.viewSite}
            </a>
            <form action={logoutAction}>
              <button className="rounded-full px-3 py-1.5 text-xs font-bold text-cream/70 hover:text-cream lg:w-full">{a.nav.logout}</button>
            </form>
          </div>
        </div>
        <AdminNav links={links} />
      </aside>
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
