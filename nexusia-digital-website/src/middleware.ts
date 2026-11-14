import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

/**
 * 1. Sprach-Routing: Pfade ohne Sprachpräfix werden auf /de, /es oder /en umgeleitet
 *    (Reihenfolge: Cookie NEXT_LOCALE → Accept-Language → Deutsch).
 * 2. Admin-Schutz: /admin und /api/admin sind serverseitig gesperrt, solange keine
 *    Zugangsdaten als Umgebungsvariablen/Secrets hinterlegt sind. Danach HTTP-Basic-Auth
 *    als Übergangslösung – für den Livebetrieb Cloudflare Access oder echte Sessions nutzen.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return guardAdmin(req);
  }

  if (pathname.startsWith("/api")) return NextResponse.next();

  const first = pathname.split("/")[1];
  if (isLocale(first)) {
    const res = NextResponse.next();
    // Hintergrund-Vorladen (Prefetch) darf die gewählte Sprache NICHT ändern – nur echte Seitenaufrufe.
    const prefetch = req.headers.has("next-router-prefetch") || req.headers.get("purpose") === "prefetch" || req.headers.get("sec-purpose")?.includes("prefetch");
    if (!prefetch && req.cookies.get("NEXT_LOCALE")?.value !== first) {
      res.cookies.set("NEXT_LOCALE", first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return res;
  }

  const url = req.nextUrl.clone();
  // Die Akademie startet standardmäßig auf Spanisch (außer die Sprache wurde bereits gewählt).
  const academy = pathname === "/academia" || pathname.startsWith("/academia/");
  const cookie = req.cookies.get("NEXT_LOCALE")?.value;
  const locale = academy ? (isLocale(cookie) ? cookie : "es") : detectLocale(req);
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

function detectLocale(req: NextRequest) {
  const cookie = req.cookies.get("NEXT_LOCALE")?.value;
  if (isLocale(cookie)) return cookie;
  const header = req.headers.get("accept-language") || "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of ranked) if (isLocale(lang)) return lang;
  return defaultLocale;
}

function guardAdmin(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass || pass.length < 12) {
    // Nicht konfiguriert → wie nicht vorhanden behandeln.
    return new NextResponse("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  }
  const auth = req.headers.get("authorization") || "";
  const [scheme, encoded] = auth.split(" ");
  if (scheme === "Basic" && encoded) {
    const [u, ...rest] = atob(encoded).split(":");
    if (safeEqual(u, user) && safeEqual(rest.join(":"), pass)) {
      const res = NextResponse.next();
      res.headers.set("Cache-Control", "no-store");
      const lang = req.nextUrl.searchParams.get("lang");
      if (isLocale(lang)) res.cookies.set("NEXT_LOCALE", lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
      return res;
    }
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="NexusIA Admin", charset="UTF-8"', "Cache-Control": "no-store" },
  });
}

/** Vergleich mit konstanter Laufzeit (gegen Timing-Angriffe). */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const config = {
  // Statische Dateien, Next-Interna und SEO-Dateien ausnehmen
  matcher: ["/((?!_next|favicon.ico|icon.svg|og.png|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|woff2?|txt|xml|pdf|epub)$).*)"],
};

