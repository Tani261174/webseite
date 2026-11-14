/**
 * PRODUKTKATALOG – DEMONSTRATIONSDATEN
 * ------------------------------------------------------------------
 * Alle Einträge sind klar als Demo markiert (demo: true). Es handelt sich
 * NICHT um echte Produkte; Preise sind Beispielpreise.
 * Später wird dieser Katalog aus einer Datenbank (z. B. Cloudflare D1)
 * über das Admin-Dashboard gepflegt. Die Struktur bleibt gleich.
 */
import type { L10n } from "@/lib/i18n/config";
import type { BrandSlug } from "./brands";
import type { ArtVariant } from "@/components/art/Artwork";

export type ProductStatus = "available" | "coming-soon" | "free";
export type ProductCategory =
  | "svg" | "png" | "illustrations" | "templates" | "bundles" | "backgrounds"
  | "ebooks" | "guides" | "courses" | "tutorials" | "ai";

export interface Product {
  slug: string;
  brand: BrandSlug;
  category: ProductCategory;
  status: ProductStatus;
  /** Preis in Euro-Cent. Bei "free" = 0, bei "coming-soon" optional. */
  priceCents?: number;
  demo: boolean;
  featured?: boolean;
  art: ArtVariant;
  title: L10n;
  short: L10n;
  description: L10n;
  includes: L10n<string[]>;
  formats: string[];
  tags: string[];
  /** Nur Kurse */
  level?: "beginner" | "intermediate" | "all";
  /** Interne Referenz auf die Datei im geschützten Speicher (z. B. R2-Key). Niemals öffentlich ausliefern. */
  fileKey?: string;
}

const t = (de: string, es: string, en: string): L10n => ({ de, es, en });
const tl = (de: string[], es: string[], en: string[]): L10n<string[]> => ({ de, es, en });

export const products: Product[] = [
  {
    slug: "golden-lines-svg-ornaments",
    brand: "nexusstock", category: "svg", status: "available", priceCents: 900, demo: true, featured: true, art: "lines",
    title: t("Golden Lines – SVG-Ornamente", "Golden Lines – ornamentos SVG", "Golden Lines – SVG Ornaments"),
    short: t("Feine Linienornamente für edle Designs.", "Ornamentos de línea fina para diseños elegantes.", "Fine line ornaments for elegant designs."),
    description: t(
      "Ein Set aus eleganten Linienornamenten, Rahmen und Trennern. Skalierbar ohne Qualitätsverlust und ideal für Einladungen, Etiketten, Social Media und Webdesign.",
      "Un set de elegantes ornamentos de línea, marcos y separadores. Escalables sin pérdida de calidad e ideales para invitaciones, etiquetas, redes sociales y diseño web.",
      "A set of elegant line ornaments, frames and dividers. Scalable without loss of quality and ideal for invitations, labels, social media and web design.",
    ),
    includes: tl(["Ornamente & Rahmen", "Trennlinien", "Farbvarianten"], ["Ornamentos y marcos", "Separadores", "Variantes de color"], ["Ornaments & frames", "Dividers", "Colour variants"]),
    formats: ["SVG", "PNG"], tags: ["gold", "ornament", "vector", "elegant"],
  },
  {
    slug: "black-marble-backgrounds",
    brand: "nexusstock", category: "backgrounds", status: "available", priceCents: 700, demo: true, featured: true, art: "marble",
    title: t("Black Marble – Hintergründe", "Black Marble – fondos", "Black Marble – Backgrounds"),
    short: t("Schwarzer Marmor mit goldenen Adern.", "Mármol negro con vetas doradas.", "Black marble with golden veins."),
    description: t(
      "Hochauflösende Marmor-Hintergründe in Schwarz und Gold für Präsentationen, Produktfotos, Websites und Druck.",
      "Fondos de mármol en alta resolución en negro y dorado para presentaciones, fotos de producto, webs e impresión.",
      "High-resolution marble backgrounds in black and gold for presentations, product shots, websites and print.",
    ),
    includes: tl(["Hochauflösende Hintergründe", "Hoch- und Querformat"], ["Fondos en alta resolución", "Vertical y horizontal"], ["High-resolution backgrounds", "Portrait and landscape"]),
    formats: ["PNG", "JPG"], tags: ["marble", "background", "gold", "black"],
  },
  {
    slug: "botanical-line-art",
    brand: "nexusstock", category: "illustrations", status: "coming-soon", priceCents: 1200, demo: true, art: "botanical",
    title: t("Botanical Line Art", "Botanical Line Art", "Botanical Line Art"),
    short: t("Minimalistische Pflanzen-Illustrationen.", "Ilustraciones botánicas minimalistas.", "Minimalist botanical illustrations."),
    description: t(
      "Zarte, handgezeichnet wirkende Pflanzenmotive als Vektor – für Branding, Packaging und Wanddekoration.",
      "Motivos botánicos delicados con estilo dibujado a mano, en vector, para branding, packaging y decoración.",
      "Delicate, hand-drawn-style botanical motifs as vectors – for branding, packaging and wall art.",
    ),
    includes: tl(["Pflanzenmotive", "Einzeln freigestellt"], ["Motivos botánicos", "Recortados individualmente"], ["Botanical motifs", "Individually isolated"]),
    formats: ["SVG", "PNG"], tags: ["botanical", "line art", "illustration"],
  },
  {
    slug: "luxe-social-media-templates",
    brand: "nexusstock", category: "templates", status: "available", priceCents: 1500, demo: true, featured: true, art: "frames",
    title: t("Luxe – Social-Media-Vorlagen", "Luxe – plantillas para redes sociales", "Luxe – Social Media Templates"),
    short: t("Edle Vorlagen für Posts und Stories.", "Plantillas elegantes para posts y stories.", "Elegant templates for posts and stories."),
    description: t(
      "Bearbeitbare Vorlagen in Schwarz, Weiß und Gold für einen einheitlichen, hochwertigen Auftritt auf Instagram, TikTok und Co.",
      "Plantillas editables en negro, blanco y dorado para una presencia coherente y de calidad en Instagram, TikTok y más.",
      "Editable templates in black, white and gold for a consistent, premium presence on Instagram, TikTok and more.",
    ),
    includes: tl(["Post-Vorlagen", "Story-Vorlagen", "Kurzanleitung"], ["Plantillas de post", "Plantillas de stories", "Guía rápida"], ["Post templates", "Story templates", "Quick guide"]),
    formats: ["Canva", "PSD"], tags: ["social media", "template", "instagram"],
  },
  {
    slug: "creator-bundle-vol-1",
    brand: "nexusstock", category: "bundles", status: "coming-soon", demo: true, art: "grid",
    title: t("Creator Bundle Vol. 1", "Creator Bundle Vol. 1", "Creator Bundle Vol. 1"),
    short: t("Grafiken, Vorlagen und Hintergründe im Paket.", "Gráficos, plantillas y fondos en un pack.", "Graphics, templates and backgrounds in one pack."),
    description: t(
      "Ein kuratiertes Paket aus verschiedenen NexusStock-Ressourcen. Inhalt und Preis werden vor dem Start festgelegt.",
      "Un pack seleccionado con diversos recursos de NexusStock. El contenido y el precio se definirán antes del lanzamiento.",
      "A curated pack of various NexusStock resources. Content and price will be set before launch.",
    ),
    includes: tl(["Inhalt folgt"], ["Contenido próximamente"], ["Contents to follow"]),
    formats: ["SVG", "PNG", "PSD"], tags: ["bundle"],
  },
  {
    slug: "gold-frames-png-free",
    brand: "nexusstock", category: "png", status: "free", priceCents: 0, demo: true, featured: true, art: "frames",
    title: t("Goldrahmen – PNG gratis", "Marcos dorados – PNG gratis", "Gold Frames – free PNG"),
    short: t("Ein kleines Geschenk zum Kennenlernen.", "Un pequeño regalo para conocernos.", "A small welcome gift."),
    description: t(
      "Freigestellte Goldrahmen mit transparentem Hintergrund – kostenlos zum Ausprobieren.",
      "Marcos dorados recortados con fondo transparente, gratis para probar.",
      "Isolated gold frames with transparent background – free to try.",
    ),
    includes: tl(["Goldrahmen als PNG"], ["Marcos dorados en PNG"], ["Gold frames as PNG"]),
    formats: ["PNG"], tags: ["free", "frame", "gold"],
  },
  {
    slug: "high-protein-recipe-ebook",
    brand: "neuesichmittani", category: "ebooks", status: "coming-soon", demo: true, featured: true, art: "rose",
    title: t("High-Protein-Rezepte – E-Book", "Recetas altas en proteína – e-book", "High-Protein Recipes – E-book"),
    short: t("Eigene Rezepte, eiweißreich und alltagstauglich.", "Recetas propias, ricas en proteína y fáciles.", "Original recipes, high in protein and easy to make."),
    description: t(
      "Eine Sammlung selbst entwickelter, proteinreicher Rezepte mit klaren Schritten und Nährwertangaben. Inspiration für bewusstes Kochen – kein Ersatz für eine Ernährungsberatung.",
      "Una colección de recetas propias ricas en proteína, con pasos claros e información nutricional. Inspiración para cocinar de forma consciente; no sustituye el asesoramiento nutricional.",
      "A collection of self-developed, high-protein recipes with clear steps and nutrition information. Inspiration for mindful cooking – not a substitute for nutritional advice.",
    ),
    includes: tl(["Rezepte mit Nährwerten", "Einkaufslisten"], ["Recetas con valores nutricionales", "Listas de la compra"], ["Recipes with nutrition facts", "Shopping lists"]),
    formats: ["PDF"], tags: ["protein", "rezepte", "recipes", "ebook"],
  },
  {
    slug: "light-cooking-guide",
    brand: "neuesichmittani", category: "guides", status: "coming-soon", demo: true, art: "book",
    title: t("Leichte Küche – Guide", "Cocina ligera – guía", "Light Cooking – Guide"),
    short: t("Kalorienbewusst kochen, ohne zu verzichten.", "Cocina ligera sin renunciar al sabor.", "Calorie-conscious cooking without missing out."),
    description: t(
      "Ein digitaler Guide mit Tipps, Grundrezepten und Wochenplan-Vorlagen für eine leichte, abwechslungsreiche Küche.",
      "Una guía digital con consejos, recetas básicas y plantillas de planificación semanal para una cocina ligera y variada.",
      "A digital guide with tips, basic recipes and weekly planner templates for light, varied cooking.",
    ),
    includes: tl(["Grundrezepte", "Wochenplan-Vorlage"], ["Recetas básicas", "Plantilla semanal"], ["Basic recipes", "Weekly planner template"]),
    formats: ["PDF"], tags: ["low calorie", "guide"],
  },
  {
    slug: "resin-art-basics-course",
    brand: "mundoresinamagica", category: "courses", status: "coming-soon", demo: true, featured: true, art: "resin", level: "beginner",
    title: t("Resin-Art – Grundkurs", "Arte en resina – curso básico", "Resin Art – Foundations Course"),
    short: t("Vom ersten Guss zum eigenen Kunstwerk.", "Del primer vertido a tu propia obra.", "From your first pour to your own artwork."),
    description: t(
      "Lerne Material, Sicherheit, Farben und Gießtechniken kennen – Schritt für Schritt und in deinem Tempo.",
      "Conoce materiales, seguridad, colores y técnicas de vertido, paso a paso y a tu ritmo.",
      "Learn about materials, safety, colours and pouring techniques – step by step and at your own pace.",
    ),
    includes: tl(["Videolektionen", "Materialliste", "Sicherheits-Guide"], ["Lecciones en vídeo", "Lista de materiales", "Guía de seguridad"], ["Video lessons", "Materials list", "Safety guide"]),
    formats: ["Video", "PDF"], tags: ["resin", "epoxy", "kurs", "course"],
  },
  {
    slug: "ocean-resin-tutorial",
    brand: "mundoresinamagica", category: "tutorials", status: "coming-soon", demo: true, art: "wave",
    title: t("Ocean Resin – Tutorial", "Ocean Resin – tutorial", "Ocean Resin – Tutorial"),
    short: t("Wellen und Schaumkronen in Harz.", "Olas y espuma en resina.", "Waves and sea foam in resin."),
    description: t(
      "Ein ausführliches Tutorial für den beliebten Ozean-Effekt mit Zellen, Schichten und Lacing.",
      "Un tutorial detallado del popular efecto océano con celdas, capas y lacing.",
      "A detailed tutorial for the popular ocean effect with cells, layers and lacing.",
    ),
    includes: tl(["Video-Tutorial", "Materialliste"], ["Vídeo tutorial", "Lista de materiales"], ["Video tutorial", "Materials list"]),
    formats: ["Video"], tags: ["resin", "ocean", "tutorial"],
  },
  {
    slug: "website-creation-course",
    brand: "nexuscreator-ai", category: "courses", status: "coming-soon", demo: true, featured: true, art: "circuit", level: "beginner",
    title: t("Websites erstellen – Kurs", "Crear sitios web – curso", "Building Websites – Course"),
    short: t("Deine eigene professionelle Website.", "Tu propia web profesional.", "Your own professional website."),
    description: t(
      "Von der Idee zur fertigen Website: Struktur, Design, Texte und Veröffentlichung – mit modernen Werkzeugen und KI-Unterstützung.",
      "De la idea a la web terminada: estructura, diseño, textos y publicación, con herramientas modernas y apoyo de IA.",
      "From idea to finished website: structure, design, copy and publishing – with modern tools and AI support.",
    ),
    includes: tl(["Videolektionen", "Checklisten"], ["Lecciones en vídeo", "Checklists"], ["Video lessons", "Checklists"]),
    formats: ["Video", "PDF"], tags: ["website", "kurs", "course"],
  },
  {
    slug: "ai-tools-automation-course",
    brand: "nexuscreator-ai", category: "courses", status: "coming-soon", demo: true, art: "orbit", level: "all",
    title: t("KI-Tools & kreative Automatisierung", "Herramientas IA y automatización creativa", "AI Tools & Creative Automation"),
    short: t("KI sinnvoll im Alltag und Business nutzen.", "Usa la IA con sentido en tu día a día y negocio.", "Use AI wisely in everyday life and business."),
    description: t(
      "Welche KI-Werkzeuge lohnen sich wofür? Praxisnah erklärt – mit Beispielen für Bilder, Texte, Videos und Abläufe.",
      "¿Qué herramientas de IA merecen la pena y para qué? Explicado de forma práctica, con ejemplos de imágenes, textos, vídeos y procesos.",
      "Which AI tools are worth it, and for what? Explained hands-on – with examples for images, copy, video and workflows.",
    ),
    includes: tl(["Videolektionen", "Prompt-Vorlagen"], ["Lecciones en vídeo", "Plantillas de prompts"], ["Video lessons", "Prompt templates"]),
    formats: ["Video", "PDF"], tags: ["ai", "ki", "automation"],
  },
  {
    slug: "digital-business-course",
    brand: "nexuscreator-ai", category: "courses", status: "coming-soon", demo: true, art: "grid", level: "beginner",
    title: t("Digitales Business starten", "Lanzar un negocio digital", "Starting a Digital Business"),
    short: t("Von der Idee zum ersten digitalen Produkt.", "De la idea al primer producto digital.", "From idea to your first digital product."),
    description: t(
      "Grundlagen für digitale Produkte: Positionierung, Angebot, Plattformen und Vermarktung – realistisch und ohne Hype.",
      "Fundamentos de los productos digitales: posicionamiento, oferta, plataformas y marketing, de forma realista y sin humo.",
      "Fundamentals of digital products: positioning, offer, platforms and marketing – realistic and without hype.",
    ),
    includes: tl(["Videolektionen", "Arbeitsblätter"], ["Lecciones en vídeo", "Fichas de trabajo"], ["Video lessons", "Worksheets"]),
    formats: ["Video", "PDF"], tags: ["business", "kurs", "course"],
  },
  {
    slug: "academia-amazon-kdp-course",
    brand: "nexuscreator-ai", category: "courses", status: "coming-soon", demo: true, featured: true, art: "book", level: "beginner",
    title: t("Academia Amazon – Self-Publishing mit KDP", "Academia Amazon – autopublicación con KDP", "Academia Amazon – Self-Publishing with KDP"),
    short: t("Dein eigenes Buch auf Amazon veröffentlichen.", "Publica tu propio libro en Amazon.", "Publish your own book on Amazon."),
    description: t(
      "Schritt für Schritt vom Manuskript zum veröffentlichten E-Book oder Taschenbuch: Nischenidee, Inhalt, Formatierung, Cover, Buchbeschreibung, Keywords, Preisgestaltung und Veröffentlichung über Amazon KDP. Ehrlich erklärt – ohne Versprechen auf schnelles Geld. Unabhängiger Kurs, kein offizielles Angebot von Amazon.",
      "Paso a paso del manuscrito al e-book o libro de bolsillo publicado: idea de nicho, contenido, maquetación, portada, descripción, palabras clave, precio y publicación con Amazon KDP. Explicado con honestidad, sin promesas de dinero rápido. Curso independiente, no es una oferta oficial de Amazon.",
      "Step by step from manuscript to published e-book or paperback: niche idea, content, formatting, cover, book description, keywords, pricing and publishing via Amazon KDP. Explained honestly – no promises of quick money. Independent course, not an official Amazon offer.",
    ),
    includes: tl(
      ["Videolektionen", "KDP-Checkliste", "Cover- & Formatvorlagen", "KI-Prompts für Recherche"],
      ["Lecciones en vídeo", "Checklist de KDP", "Plantillas de portada y formato", "Prompts de IA para investigar"],
      ["Video lessons", "KDP checklist", "Cover & format templates", "AI prompts for research"],
    ),
    formats: ["Video", "PDF"], tags: ["amazon", "kdp", "self-publishing", "ebook", "kurs", "course"],
  },
  {
    slug: "creative-design-course",
    brand: "nexusstock", category: "courses", status: "coming-soon", demo: true, art: "lines", level: "beginner",
    title: t("Kreatives Design – Einstieg", "Diseño creativo – iniciación", "Creative Design – Introduction"),
    short: t("Farbe, Schrift und Komposition verstehen.", "Entiende color, tipografía y composición.", "Understand colour, type and composition."),
    description: t(
      "Die wichtigsten Gestaltungsgrundlagen, verständlich erklärt und direkt anwendbar – für Social Media, Druck und Web.",
      "Los fundamentos clave del diseño, explicados con claridad y aplicables al momento, para redes, impresión y web.",
      "The key design fundamentals, clearly explained and immediately applicable – for social media, print and web.",
    ),
    includes: tl(["Videolektionen", "Übungsdateien"], ["Lecciones en vídeo", "Archivos de práctica"], ["Video lessons", "Practice files"]),
    formats: ["Video"], tags: ["design", "kurs", "course"],
  },
  {
    slug: "nexuscreator-ai-early-access",
    brand: "nexuscreator-ai", category: "ai", status: "coming-soon", demo: true, art: "orbit",
    title: t("NexusCreator AI – Early Access", "NexusCreator AI – acceso anticipado", "NexusCreator AI – Early Access"),
    short: t("Als Erste:r die Plattform testen.", "Prueba la plataforma antes que nadie.", "Be among the first to try the platform."),
    description: t(
      "Der Early-Access-Zugang wird angeboten, sobald die Plattform testbereit ist. Bis dahin: Newsletter abonnieren.",
      "El acceso anticipado se ofrecerá cuando la plataforma esté lista para pruebas. Hasta entonces: suscríbete a la newsletter.",
      "Early access will be offered once the platform is ready for testing. Until then: subscribe to the newsletter.",
    ),
    includes: tl(["Details folgen"], ["Detalles próximamente"], ["Details to follow"]),
    formats: ["Web-App"], tags: ["ai", "ki", "early access"],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(cents: number, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(cents / 100);
}

/** Öffentliche, sichere Teilmenge für den Client (ohne interne Felder wie fileKey). */
export type PublicProduct = Omit<Product, "fileKey">;
export function toPublic(p: Product): PublicProduct {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fileKey, ...rest } = p;
  return rest;
}
