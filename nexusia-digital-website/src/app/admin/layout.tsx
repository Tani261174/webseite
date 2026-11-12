import "@fontsource-variable/manrope/wght.css";
import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin · NexusIA Digital", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-pearl">{children}</body>
    </html>
  );
}
