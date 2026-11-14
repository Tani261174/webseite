/**
 * Datenmodell der Academia NexusIA Digital.
 * Dieselbe Struktur wird später in Cloudflare D1 gespeichert (siehe migrations/0001_academy.sql),
 * damit im Admin-Dashboard angelegte Kurse ohne Codeänderung im Katalog erscheinen.
 */
import type { L10n } from "@/lib/i18n/config";

export type CoverMotif =
  | "amazon" | "temu" | "shein" | "tiktok" | "shopify" | "etsy"
  | "ebay" | "aliexpress" | "hotmart" | "canva" | "youtube" | "marketing";

export type CourseArea = "ecommerce" | "affiliate" | "social" | "digital" | "ai";
export type CourseLevel = "beginner" | "intermediate" | "all";

/** soon = in Vorbereitung, open = kaufbar (erst nach Zahlungsfreigabe), draft = nicht öffentlich */
export type CourseStatus = "soon" | "open" | "draft";

/** ready = Inhalt fertig · soon = in Vorbereitung */
export type LessonStatus = "ready" | "soon";
/** preview = öffentlich & kostenlos · paid = nur für berechtigte Nutzer */
export type LessonAccess = "preview" | "paid";

export type VideoSource =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "file"; src: string };

export interface Download {
  label: L10n;
  href: string;
  format: "PDF" | "EPUB" | "XLSX" | "DOCX";
  /** Öffentliche Datei (Vorschau) oder geschützt (nur über signierten Link). */
  public: boolean;
}

/** Lektionsinhalt als Blöcke – einfach im Admin pflegbar und sicher darstellbar (kein HTML). */
export type Block =
  | { type: "h"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; title: string; text: string }
  | { type: "example"; title: string; text: string[] }
  | { type: "exercise"; title: string; steps: string[] }
  | { type: "table"; head: string[]; rows: string[][] };

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explain: string;
}

export interface LessonBody {
  /** Sprache, in der der Inhalt vorliegt */
  lang: "es" | "de" | "en";
  intro: string;
  objectives: string[];
  blocks: Block[];
  quiz?: QuizQuestion[];
  takeaways: string[];
}

export interface Lesson {
  slug: string;
  title: L10n;
  minutes?: number;
  access: LessonAccess;
  status: LessonStatus;
  video?: VideoSource;
  body?: LessonBody;
  downloads?: Download[];
}

export interface Module {
  slug: string;
  title: L10n;
  lessons: Lesson[];
}

export interface Faq {
  q: L10n;
  a: L10n;
}

/**
 * Plattform-Marke eines Kurses. Logos werden NUR angezeigt, wenn die Nutzung schriftlich freigegeben ist
 * (status "approved" + Datei unter /public/brands). Bis dahin: neutrale Textkarte mit dem Namen als reinem Text.
 */
export interface BrandInfo {
  name: string;
  logo: {
    status: "pending" | "approved";
    /** Pfad zur freigegebenen Originaldatei, z. B. /brands/shopify.svg */
    src?: string;
    /** Offizielle Markenrichtlinie / Ansprechpartner für die Freigabe */
    terms: string;
    /** Kurzbefund der Prüfung (Deutsch, nur Admin) */
    note: string;
  };
}

export interface Course {
  slug: string;
  /** Plattform, um die es im Kurs geht (fehlt bei eigenen Themen wie Marketing Digital) */
  brand?: BrandInfo;
  order: number;
  cover: CoverMotif;
  area: CourseArea;
  /** Optionales echtes Bild (z. B. aus R2 / Cloudflare Images). Ohne Bild wird das goldene SVG-Motiv gezeigt. */
  image?: string;
  title: L10n;
  short: L10n;
  description: L10n;
  level: CourseLevel;
  status: CourseStatus;
  /** Preis in Euro-Cent. Leer = „Próximamente“. */
  priceCents?: number;
  /** true = Beispielpreis, noch nicht verbindlich */
  priceIsExample?: boolean;
  goals: L10n<string[]>;
  audience: L10n<string[]>;
  requirements: L10n<string[]>;
  modules: Module[];
  faq: Faq[];
  keywords: string[];
  /** Slug der ausführlichen Beispiellektion, falls vorhanden */
  sampleLesson?: string;
}

export const t = (es: string, de: string, en: string): L10n => ({ es, de, en });
export const tl = (es: string[], de: string[], en: string[]): L10n<string[]> => ({ es, de, en });

/** Kurzform für Lektionen in Vorbereitung */
export const soon = (slug: string, es: string, de: string, en: string, access: LessonAccess = "paid"): Lesson => ({
  slug, title: t(es, de, en), access, status: "soon",
});
