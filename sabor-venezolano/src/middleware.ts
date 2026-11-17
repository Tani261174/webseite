import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

/**
 * Sprach-Routing: /es/… (Standard) und /de/…
 * Pfade ohne Sprachpräfix → zuletzt gewählte Sprache (Cookie) oder Spanisch.
 * Admin, API und Medien sind ausgenommen.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split("/")[1];

  if (isLocale(first)) {
    const res = NextResponse.next();
    if (req.cookies.get("sv_lang")?.value !== first) {
      res.cookies.set("sv_lang", first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return res;
  }

  const cookie = req.cookies.get("sv_lang")?.value;
  const locale = isLocale(cookie) ? cookie : defaultLocale;
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next|api|admin|media|favicon.ico|icon.svg|apple-icon.png|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|woff2?|txt|xml)$).*)",
  ],
};
