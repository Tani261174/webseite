import "@fontsource/playfair-display/500.css";
import "@fontsource-variable/manrope";
import "../globals.css";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin · Sabor Venezolano",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-white">{children}</body>
    </html>
  );
}
