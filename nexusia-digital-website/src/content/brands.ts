import type { L10n } from "@/lib/i18n/config";
import type { ArtVariant } from "@/components/art/Artwork";

export type BrandSlug = "nexuscreator-ai" | "nexusstock" | "neuesichmittani" | "mundoresinamagica";

export interface Brand {
  slug: BrandSlug;
  name: string;
  status: "live" | "coming-soon";
  art: ArtVariant;
  tagline: L10n;
  summary: L10n;
  description: L10n;
  features: L10n<string[]>;
  /** Optionale Hinweise, die prominent auf der Markenseite stehen (z. B. kein Heilversprechen). */
  disclaimer?: L10n;
  /** Links zu bestehenden Angeboten (z. B. Social Media, bestehender Shop). Bitte ergänzen. */
  externalLinks?: { label: L10n; url: string }[];
}

export const brands: Brand[] = [
  {
    slug: "nexuscreator-ai",
    name: "NexusCreator AI",
    status: "coming-soon",
    art: "orbit",
    tagline: {
      de: "Die kreative KI-Plattform – in Entwicklung.",
      es: "La plataforma creativa de IA, en desarrollo.",
      en: "The creative AI platform – in development.",
    },
    summary: {
      de: "Bilder, Videos, Figuren und Inhalte mit KI erschaffen – geführt von Assistenten, die mitdenken.",
      es: "Crea imágenes, vídeos, personajes y contenidos con IA, guiado por asistentes que piensan contigo.",
      en: "Create images, videos, characters and content with AI – guided by assistants that think along with you.",
    },
    description: {
      de: "NexusCreator AI wird unsere eigene Plattform für kreative künstliche Intelligenz. Ziel ist ein Ort, an dem aus einer Idee in wenigen Schritten ein Bild, ein Video oder eine eigene Figur entsteht – verständlich, hochwertig und ohne technisches Vorwissen. Die Plattform befindet sich in Entwicklung. Alle hier beschriebenen Funktionen sind geplant und noch nicht nutzbar.",
      es: "NexusCreator AI será nuestra propia plataforma de inteligencia artificial creativa. El objetivo: un lugar donde una idea se convierta en pocos pasos en una imagen, un vídeo o un personaje propio, de forma comprensible, con calidad y sin conocimientos técnicos. La plataforma está en desarrollo. Todas las funciones descritas aquí están previstas y aún no se pueden usar.",
      en: "NexusCreator AI will be our own platform for creative artificial intelligence. The goal: a place where an idea becomes an image, a video or a character of your own in just a few steps – easy to understand, high quality and without technical know-how. The platform is in development. All features described here are planned and not yet usable.",
    },
    features: {
      de: ["KI-Bildgenerierung", "KI-Videogenerierung", "Kreative KI-Assistenten", "Eigene KI-Figuren und Roboter", "Werkzeuge für kreative Inhalte"],
      es: ["Generación de imágenes con IA", "Generación de vídeos con IA", "Asistentes creativos de IA", "Personajes y robots de IA propios", "Herramientas de contenido creativo"],
      en: ["AI image generation", "AI video generation", "Creative AI assistants", "Custom AI characters and robots", "Creative content tools"],
    },
  },
  {
    slug: "nexusstock",
    name: "NexusStock",
    status: "coming-soon",
    art: "grid",
    tagline: {
      de: "Der Marktplatz für kreative digitale Assets.",
      es: "El marketplace de recursos digitales creativos.",
      en: "The marketplace for creative digital assets.",
    },
    summary: {
      de: "SVG- und PNG-Grafiken, Illustrationen, Vorlagen, Hintergründe und Bundles für deine Projekte.",
      es: "Gráficos SVG y PNG, ilustraciones, plantillas, fondos y packs para tus proyectos.",
      en: "SVG and PNG graphics, illustrations, templates, backgrounds and bundles for your projects.",
    },
    description: {
      de: "NexusStock ist unser Marktplatz für kreative Ressourcen. Hier findest du sorgfältig gestaltete Grafiken, Illustrationen und Vorlagen – einzeln oder als Bundle. Die Architektur ist bereits auf Einzelkäufe und spätere Abo-Modelle ausgelegt.",
      es: "NexusStock es nuestro marketplace de recursos creativos. Aquí encontrarás gráficos, ilustraciones y plantillas diseñados con esmero, sueltos o en packs. La arquitectura ya está preparada para compras individuales y futuros modelos de suscripción.",
      en: "NexusStock is our marketplace for creative resources. Here you will find carefully designed graphics, illustrations and templates – individually or as a bundle. The architecture is already designed for single purchases and future subscription plans.",
    },
    features: {
      de: ["SVG-Grafiken", "PNG-Grafiken", "Digitale Illustrationen", "Designvorlagen", "Kreative Bundles", "Hintergründe", "Digitale Ressourcen"],
      es: ["Gráficos SVG", "Gráficos PNG", "Ilustraciones digitales", "Plantillas de diseño", "Packs creativos", "Fondos", "Recursos digitales"],
      en: ["SVG graphics", "PNG graphics", "Digital illustrations", "Design templates", "Creative bundles", "Backgrounds", "Digital resources"],
    },
  },
  {
    slug: "neuesichmittani",
    name: "NeuesIchMitTani",
    status: "live",
    art: "rose",
    tagline: {
      de: "Gesunde Rezepte, ehrliche Motivation.",
      es: "Recetas saludables, motivación honesta.",
      en: "Healthy recipes, honest motivation.",
    },
    summary: {
      de: "Eigene, gesunde Rezepte – proteinreich, kalorienbewusst und alltagstauglich. Dazu E-Books, Guides und Programme.",
      es: "Recetas propias y saludables: ricas en proteína, ligeras y fáciles para el día a día. Además, e-books, guías y programas.",
      en: "Original, healthy recipes – high in protein, calorie-conscious and made for everyday life. Plus e-books, guides and programmes.",
    },
    description: {
      de: "NeuesIchMitTani steht für selbst entwickelte, gesunde Rezepte und eine ehrliche Begleitung auf dem Weg zu mehr Wohlbefinden. Proteinreiche Gerichte, leichte Küche und digitale Ernährungs-Guides – ohne Verbote, ohne leere Versprechen. Die Rose ist das Markenzeichen.",
      es: "NeuesIchMitTani representa recetas saludables de creación propia y un acompañamiento honesto hacia un mayor bienestar. Platos ricos en proteína, cocina ligera y guías de nutrición digitales, sin prohibiciones ni promesas vacías. La rosa es su sello.",
      en: "NeuesIchMitTani stands for self-developed, healthy recipes and honest support on the way to greater well-being. High-protein dishes, light cooking and digital nutrition guides – no bans, no empty promises. The rose is its signature.",
    },
    features: {
      de: ["Gesunde Rezepte", "High-Protein-Gerichte", "Kalorienbewusst kochen", "Rezept-E-Books", "Digitale Ernährungs-Guides", "Onlineprogramme"],
      es: ["Recetas saludables", "Platos altos en proteína", "Cocina ligera", "E-books de recetas", "Guías de nutrición digitales", "Programas online"],
      en: ["Healthy recipes", "High-protein meals", "Low-calorie cooking", "Recipe e-books", "Digital nutrition guides", "Online programmes"],
    },
    disclaimer: {
      de: "Die Inhalte dienen der Inspiration und ersetzen keine medizinische oder ernährungsfachliche Beratung. Ergebnisse sind individuell verschieden.",
      es: "Los contenidos sirven de inspiración y no sustituyen el asesoramiento médico ni nutricional. Los resultados varían según cada persona.",
      en: "The content is meant as inspiration and does not replace medical or professional nutritional advice. Results vary from person to person.",
    },
    externalLinks: [
      // Beispiel – bitte durch echte Links ersetzen:
      // { label: { de: "Instagram", es: "Instagram", en: "Instagram" }, url: "https://instagram.com/…" },
    ],
  },
  {
    slug: "mundoresinamagica",
    name: "MundoResinaMagica",
    status: "coming-soon",
    art: "resin",
    tagline: {
      de: "Die Magie der Epoxidharz-Kunst.",
      es: "La magia del arte en resina epoxi.",
      en: "The magic of epoxy resin art.",
    },
    summary: {
      de: "Resin-Art, kreative Tutorials, DIY-Projekte und Onlinekurse für alle, die mit Harz gestalten wollen.",
      es: "Arte en resina, tutoriales creativos, proyectos DIY y cursos online para quien quiera crear con resina.",
      en: "Resin art, creative tutorials, DIY projects and online courses for everyone who wants to create with resin.",
    },
    description: {
      de: "MundoResinaMagica öffnet die Welt der Epoxidharz-Kunst: fließende Farben, eingefangenes Licht, einzigartige Stücke. Mit Schritt-für-Schritt-Tutorials, Kursen und Lernmaterial – vom ersten Guss bis zu fortgeschrittenen Techniken. Sicherheit beim Arbeiten mit Harz steht dabei immer an erster Stelle.",
      es: "MundoResinaMagica abre el mundo del arte en resina epoxi: colores fluidos, luz atrapada, piezas únicas. Con tutoriales paso a paso, cursos y material didáctico, desde el primer vertido hasta técnicas avanzadas. La seguridad al trabajar con resina siempre es lo primero.",
      en: "MundoResinaMagica opens up the world of epoxy resin art: flowing colours, captured light, one-of-a-kind pieces. With step-by-step tutorials, courses and learning material – from your first pour to advanced techniques. Safety when working with resin always comes first.",
    },
    features: {
      de: ["Epoxidharz-Kunst", "Kreative Tutorials", "Digitale Kurse", "DIY-Projekte", "Künstlerische Techniken", "Kreative Lernressourcen"],
      es: ["Arte en resina epoxi", "Tutoriales creativos", "Cursos digitales", "Proyectos DIY", "Técnicas artísticas", "Recursos de aprendizaje creativo"],
      en: ["Epoxy resin art", "Creative tutorials", "Digital courses", "DIY projects", "Artistic techniques", "Creative learning resources"],
    },
  },
];

export function getBrand(slug: string) {
  return brands.find((b) => b.slug === slug);
}
