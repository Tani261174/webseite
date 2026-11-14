import "@fontsource-variable/manrope/wght.css";
import "../globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { adminLocale } from "@/academy/admin-ui";

export const metadata: Metadata = { title: "Admin · NexusIA Digital", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const lang = adminLocale(undefined, (await cookies()).get("NEXT_LOCALE")?.value);
  return (
    <html lang={lang}>
      <body className="bg-pearl">{children}</body>
    </html>
  );
}
