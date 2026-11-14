import { t, tl, soon, type Course, type Faq, type Module } from "../types";

/**
 * Kursstrukturen (Module & Lektionen) der weiteren elf Kurse.
 * Alle Lektionen sind als „Próximamente“ (status: "soon") markiert, bis die Inhalte fertig sind.
 */

const noExperience = tl(
  ["No necesitas experiencia previa.", "Un ordenador o smartphone con conexión a internet."],
  ["Keine Vorkenntnisse nötig.", "Computer oder Smartphone mit Internetzugang."],
  ["No prior experience needed.", "A computer or smartphone with internet access."],
);
const withExtra = (es: string, de: string, en: string) =>
  tl([...noExperience.es, es], [...noExperience.de, de], [...noExperience.en, en]);

const independent = (brand: string): Faq => ({
  q: t(`¿Es un curso oficial de ${brand}?`, `Ist das ein offizieller ${brand}-Kurs?`, `Is this an official ${brand} course?`),
  a: t(
    `No. Es un curso independiente de Academia NexusIA Digital, sin afiliación ni patrocinio de ${brand}.`,
    `Nein. Es ist ein unabhängiger Kurs der Academia NexusIA Digital, ohne Verbindung zu oder Sponsoring durch ${brand}.`,
    `No. It is an independent course by Academia NexusIA Digital, not affiliated with or sponsored by ${brand}.`,
  ),
});
const availability = (brand: string): Faq => ({
  q: t(`¿${brand} está disponible en mi país?`, `Ist ${brand} in meinem Land verfügbar?`, `Is ${brand} available in my country?`),
  a: t(
    `Los programas de ${brand} no están disponibles en todos los países y sus condiciones cambian. En el curso te mostramos cómo comprobarlo y qué alternativas tienes.`,
    `Die Programme von ${brand} sind nicht in allen Ländern verfügbar, und die Bedingungen ändern sich. Im Kurs zeigen wir dir, wie du das prüfst und welche Alternativen es gibt.`,
    `${brand}'s programmes are not available in every country and their terms change. The course shows you how to check and what alternatives you have.`,
  ),
});

type M = [slug: string, title: [string, string, string], lessons: [string, string, string, string][]];
const modules = (list: M[]): Module[] =>
  list.map(([slug, [es, de, en], lessons]) => ({
    slug,
    title: t(es, de, en),
    lessons: lessons.map(([s, les, lde, len]) => soon(s, les, lde, len)),
  }));

export const otherCourses: Course[] = [
  {
    slug: "temu", order: 2, cover: "temu", area: "affiliate", level: "beginner", status: "soon",
    title: t("Temu – Afiliados e Influencer Marketing", "Temu – Affiliate- und Influencer-Marketing", "Temu – Affiliate & Influencer Marketing"),
    short: t("Recomienda productos de Temu con contenido honesto y medible.", "Temu-Produkte mit ehrlichem, messbarem Content empfehlen.", "Recommend Temu products with honest, measurable content."),
    description: t(
      "Aprende cómo funcionan los programas de afiliados e influencers de Temu, cómo crear contenido que aporte valor y cómo medir tus resultados, cuidando la confianza de tu audiencia y las normas de publicidad.",
      "Lerne, wie die Affiliate- und Influencer-Programme von Temu funktionieren, wie du Inhalte mit echtem Mehrwert erstellst und deine Ergebnisse misst – mit Rücksicht auf das Vertrauen deiner Community und die Werberegeln.",
      "Learn how Temu's affiliate and influencer programmes work, how to create content that adds value and how to measure your results – while protecting your audience's trust and following advertising rules.",
    ),
    goals: tl(
      ["Entender los programas de afiliados e influencers de Temu.", "Elegir productos que encajen con tu audiencia.", "Crear contenido de reseña honesto.", "Medir clics y conversiones."],
      ["Die Affiliate- und Influencer-Programme von Temu verstehen.", "Produkte wählen, die zu deiner Community passen.", "Ehrliche Review-Inhalte erstellen.", "Klicks und Conversions messen."],
      ["Understand Temu's affiliate and influencer programmes.", "Pick products that fit your audience.", "Create honest review content.", "Measure clicks and conversions."],
    ),
    audience: tl(["Creadores de contenido y personas que empiezan con afiliados."], ["Content-Creator und Affiliate-Einsteiger."], ["Content creators and affiliate beginners."]),
    requirements: withExtra("Una cuenta en al menos una red social.", "Ein Konto in mindestens einem sozialen Netzwerk.", "An account on at least one social network."),
    keywords: ["temu", "afiliados", "affiliate", "influencer"],
    modules: modules([
      ["fundamentos", ["Fundamentos de Temu", "Temu-Grundlagen", "Temu fundamentals"], [
        ["modelo-temu", "Cómo funciona Temu como marketplace", "So funktioniert Temu als Marktplatz", "How Temu works as a marketplace"],
        ["programas", "Programas de afiliados e influencers", "Affiliate- und Influencer-Programme", "Affiliate and influencer programmes"],
        ["registro", "Registro y panel de afiliado", "Anmeldung und Affiliate-Dashboard", "Sign-up and affiliate dashboard"],
      ]],
      ["productos", ["Elegir productos", "Produkte auswählen", "Choosing products"], [
        ["audiencia", "Conocer a tu audiencia", "Deine Zielgruppe kennen", "Knowing your audience"],
        ["calidad", "Calidad, opiniones y devoluciones", "Qualität, Bewertungen und Rückgaben", "Quality, reviews and returns"],
        ["tendencias", "Detectar tendencias con criterio", "Trends mit Augenmaß erkennen", "Spotting trends wisely"],
      ]],
      ["contenido", ["Contenido que convierte", "Content, der überzeugt", "Content that converts"], [
        ["unboxing", "Unboxing y reseñas honestas", "Unboxing und ehrliche Reviews", "Unboxing and honest reviews"],
        ["videos-cortos", "Vídeos cortos para TikTok y Reels", "Kurzvideos für TikTok und Reels", "Short videos for TikTok and Reels"],
        ["fotos", "Fotos de producto con el móvil", "Produktfotos mit dem Handy", "Product photos with your phone"],
      ]],
      ["normas", ["Normas y transparencia", "Regeln und Transparenz", "Rules and transparency"], [
        ["divulgacion", "Cómo señalar publicidad y enlaces", "Werbung und Links richtig kennzeichnen", "How to label ads and links"],
        ["derechos", "Derechos de imagen y música", "Bild- und Musikrechte", "Image and music rights"],
        ["confianza", "Proteger la confianza de tu comunidad", "Das Vertrauen deiner Community schützen", "Protecting your community's trust"],
      ]],
      ["resultados", ["Medir y mejorar", "Messen und verbessern", "Measure and improve"], [
        ["metricas", "Métricas clave", "Wichtige Kennzahlen", "Key metrics"],
        ["pruebas", "Pruebas A/B sencillas", "Einfache A/B-Tests", "Simple A/B tests"],
        ["plan-30", "Tu plan de 30 días", "Dein 30-Tage-Plan", "Your 30-day plan"],
      ]],
    ]),
    faq: [independent("Temu"), availability("Temu")],
  },
  {
    slug: "shein", order: 3, cover: "shein", area: "affiliate", level: "beginner", status: "soon",
    title: t("SHEIN – Afiliados y Marketing de Moda", "SHEIN – Affiliate- und Fashion-Marketing", "SHEIN – Affiliate & Fashion Marketing"),
    short: t("Contenido de moda que inspira y recomendaciones transparentes.", "Mode-Content, der inspiriert, und transparente Empfehlungen.", "Fashion content that inspires and transparent recommendations."),
    description: t(
      "Descubre cómo funciona el programa de afiliados de SHEIN y cómo crear contenido de moda atractivo: outfits, tallas, hauls y estilismo, siempre con transparencia sobre la publicidad.",
      "Erfahre, wie das Affiliate-Programm von SHEIN funktioniert und wie du ansprechenden Mode-Content erstellst – Outfits, Größen, Hauls und Styling, immer mit transparenter Werbekennzeichnung.",
      "Find out how SHEIN's affiliate programme works and how to create engaging fashion content – outfits, sizing, hauls and styling, always with transparent ad disclosure.",
    ),
    goals: tl(
      ["Conocer el programa de afiliados de SHEIN.", "Crear contenido de moda con identidad propia.", "Planificar colecciones y temporadas.", "Medir resultados y mejorar."],
      ["Das SHEIN-Affiliate-Programm kennen.", "Mode-Content mit eigener Handschrift erstellen.", "Kollektionen und Saisons planen.", "Ergebnisse messen und verbessern."],
      ["Know SHEIN's affiliate programme.", "Create fashion content with your own identity.", "Plan collections and seasons.", "Measure results and improve."],
    ),
    audience: tl(["Creadoras y creadores de moda y estilo de vida."], ["Mode- und Lifestyle-Creator."], ["Fashion and lifestyle creators."]),
    requirements: withExtra("Una cuenta en al menos una red social.", "Ein Konto in mindestens einem sozialen Netzwerk.", "An account on at least one social network."),
    keywords: ["shein", "moda", "fashion", "mode", "afiliados"],
    modules: modules([
      ["fundamentos", ["Fundamentos", "Grundlagen", "Foundations"], [
        ["programa", "El programa de afiliados de SHEIN", "Das SHEIN-Affiliate-Programm", "SHEIN's affiliate programme"],
        ["registro", "Registro y enlaces", "Anmeldung und Links", "Sign-up and links"],
        ["posicionamiento", "Tu estilo y tu público", "Dein Stil und deine Zielgruppe", "Your style and your audience"],
      ]],
      ["contenido-moda", ["Contenido de moda", "Mode-Content", "Fashion content"], [
        ["outfits", "Outfits y combinaciones", "Outfits und Kombinationen", "Outfits and combinations"],
        ["tallas", "Guías de tallas útiles", "Hilfreiche Größenberatung", "Helpful sizing guides"],
        ["hauls", "Hauls honestos", "Ehrliche Hauls", "Honest hauls"],
      ]],
      ["produccion", ["Fotos y vídeo", "Foto und Video", "Photo and video"], [
        ["luz", "Luz y fondo en casa", "Licht und Hintergrund zu Hause", "Light and background at home"],
        ["reels", "Reels y TikToks de moda", "Mode-Reels und TikToks", "Fashion Reels and TikToks"],
        ["edicion", "Edición rápida en el móvil", "Schnelle Bearbeitung am Handy", "Quick editing on your phone"],
      ]],
      ["estrategia", ["Estrategia", "Strategie", "Strategy"], [
        ["temporadas", "Temporadas y campañas", "Saisons und Kampagnen", "Seasons and campaigns"],
        ["divulgacion", "Transparencia y publicidad", "Transparenz und Werbung", "Transparency and advertising"],
        ["sostenibilidad", "Consumo consciente en tu contenido", "Bewusster Konsum in deinem Content", "Mindful consumption in your content"],
      ]],
      ["resultados", ["Resultados", "Ergebnisse", "Results"], [
        ["metricas", "Métricas que importan", "Kennzahlen, die zählen", "Metrics that matter"],
        ["optimizar", "Optimizar publicaciones", "Beiträge optimieren", "Optimising posts"],
        ["plan", "Plan de contenido mensual", "Monatlicher Content-Plan", "Monthly content plan"],
      ]],
    ]),
    faq: [independent("SHEIN"), availability("SHEIN")],
  },
  {
    slug: "tiktok-shop", order: 4, cover: "tiktok", area: "social", level: "beginner", status: "soon",
    title: t("TikTok Shop – Social Commerce", "TikTok Shop – Social Commerce", "TikTok Shop – Social Commerce"),
    short: t("Vende y recomienda productos dentro de TikTok.", "Produkte direkt in TikTok verkaufen und empfehlen.", "Sell and recommend products inside TikTok."),
    description: t(
      "Entiende el social commerce y TikTok Shop: como vendedor o como creador afiliado. Vídeos de producto, directos, escaparate y normas de la plataforma, sin atajos ni promesas.",
      "Verstehe Social Commerce und TikTok Shop – als Verkäufer:in oder als Affiliate-Creator. Produktvideos, Livestreams, Schaufenster und Plattformregeln, ohne Abkürzungen und ohne Versprechen.",
      "Understand social commerce and TikTok Shop – as a seller or as an affiliate creator. Product videos, live streams, showcase and platform rules, without shortcuts or promises.",
    ),
    goals: tl(
      ["Diferenciar vendedor y creador afiliado en TikTok Shop.", "Crear vídeos de producto que informen y vendan.", "Preparar un directo de ventas.", "Cumplir las normas de la plataforma."],
      ["Verkäufer:in und Affiliate-Creator im TikTok Shop unterscheiden.", "Produktvideos erstellen, die informieren und verkaufen.", "Einen Verkaufs-Livestream vorbereiten.", "Die Plattformregeln einhalten."],
      ["Tell sellers and affiliate creators apart in TikTok Shop.", "Create product videos that inform and sell.", "Prepare a live selling session.", "Follow the platform rules."],
    ),
    audience: tl(["Creadores, pequeñas marcas y vendedores online."], ["Creator, kleine Marken und Online-Händler:innen."], ["Creators, small brands and online sellers."]),
    requirements: withExtra("TikTok Shop solo está disponible en algunos países: lo comprobamos al inicio.", "TikTok Shop gibt es nur in einigen Ländern – das prüfen wir am Anfang.", "TikTok Shop is only available in some countries – we check this first."),
    keywords: ["tiktok", "tiktok shop", "social commerce", "live", "directo"],
    modules: modules([
      ["fundamentos", ["Social commerce", "Social Commerce", "Social commerce"], [
        ["que-es", "Qué es el social commerce", "Was ist Social Commerce?", "What social commerce is"],
        ["roles", "Vendedor o creador afiliado", "Verkäufer:in oder Affiliate-Creator", "Seller or affiliate creator"],
        ["disponibilidad", "Disponibilidad por país y requisitos", "Verfügbarkeit nach Land und Voraussetzungen", "Availability by country and requirements"],
      ]],
      ["tienda", ["Tu tienda o escaparate", "Dein Shop oder Schaufenster", "Your shop or showcase"], [
        ["configuracion", "Configuración básica", "Grundeinrichtung", "Basic setup"],
        ["catalogo", "Catálogo y fichas de producto", "Katalog und Produktseiten", "Catalogue and product pages"],
        ["logistica", "Envíos y atención al cliente", "Versand und Kundenservice", "Shipping and customer service"],
      ]],
      ["videos", ["Vídeos de producto", "Produktvideos", "Product videos"], [
        ["ganchos", "Ganchos de los primeros segundos", "Hooks für die ersten Sekunden", "Hooks for the first seconds"],
        ["demostracion", "Demostrar en lugar de exagerar", "Zeigen statt übertreiben", "Show rather than exaggerate"],
        ["series", "Series de contenido", "Content-Serien", "Content series"],
      ]],
      ["directos", ["Directos de venta", "Verkaufs-Livestreams", "Live selling"], [
        ["preparar", "Preparar un directo", "Einen Livestream vorbereiten", "Preparing a live stream"],
        ["guion", "Guion y ritmo", "Ablauf und Tempo", "Script and pacing"],
        ["despues", "Después del directo", "Nach dem Livestream", "After the live stream"],
      ]],
      ["normas", ["Normas y crecimiento", "Regeln und Wachstum", "Rules and growth"], [
        ["politicas", "Políticas de la plataforma", "Richtlinien der Plattform", "Platform policies"],
        ["metricas", "Métricas de TikTok Shop", "TikTok-Shop-Kennzahlen", "TikTok Shop metrics"],
        ["plan", "Plan de 30 días", "30-Tage-Plan", "30-day plan"],
      ]],
    ]),
    faq: [independent("TikTok"), availability("TikTok Shop")],
  },
  {
    slug: "shopify", order: 5, cover: "shopify", area: "ecommerce", level: "beginner", status: "soon",
    title: t("Shopify – Crea tu propia tienda online", "Shopify – Den eigenen Onlineshop erstellen", "Shopify – Build Your Own Online Store"),
    short: t("De la idea a una tienda profesional y lista para vender.", "Von der Idee zum professionellen, verkaufsbereiten Shop.", "From idea to a professional store ready to sell."),
    description: t(
      "Construye tu tienda con Shopify paso a paso: estructura, diseño, productos, pagos, envíos, páginas legales y primeras ventas. Con atención a los costes reales de la plataforma y las apps.",
      "Baue deinen Shop mit Shopify Schritt für Schritt: Struktur, Design, Produkte, Zahlungen, Versand, Rechtstexte und erste Verkäufe – mit Blick auf die echten Kosten von Plattform und Apps.",
      "Build your store with Shopify step by step: structure, design, products, payments, shipping, legal pages and first sales – keeping an eye on the real costs of the platform and apps.",
    ),
    goals: tl(
      ["Planificar la estructura de tu tienda.", "Diseñar una tienda clara y de confianza.", "Configurar pagos, envíos e impuestos básicos.", "Preparar el lanzamiento y las primeras campañas."],
      ["Die Struktur deines Shops planen.", "Einen klaren, vertrauenswürdigen Shop gestalten.", "Zahlungen, Versand und Steuern grundlegend einrichten.", "Launch und erste Kampagnen vorbereiten."],
      ["Plan your store's structure.", "Design a clear, trustworthy store.", "Set up payments, shipping and basic taxes.", "Prepare the launch and first campaigns."],
    ),
    audience: tl(["Emprendedores con un producto o una idea de marca."], ["Gründer:innen mit Produkt oder Markenidee."], ["Entrepreneurs with a product or brand idea."]),
    requirements: withExtra("Shopify es un servicio de pago tras el periodo de prueba; revisamos los planes al inicio.", "Shopify ist nach der Testphase kostenpflichtig; die Tarife schauen wir uns am Anfang an.", "Shopify is a paid service after the trial; we review the plans at the start."),
    keywords: ["shopify", "tienda online", "onlineshop", "ecommerce"],
    modules: modules([
      ["planificacion", ["Planificación", "Planung", "Planning"], [
        ["modelo", "Modelo de negocio y producto", "Geschäftsmodell und Produkt", "Business model and product"],
        ["costes", "Planes, apps y costes reales", "Tarife, Apps und echte Kosten", "Plans, apps and real costs"],
        ["estructura", "Estructura de la tienda", "Shop-Struktur", "Store structure"],
      ]],
      ["diseno", ["Diseño", "Design", "Design"], [
        ["tema", "Elegir y ajustar un tema", "Ein Theme wählen und anpassen", "Choosing and customising a theme"],
        ["marca", "Identidad visual", "Visuelle Identität", "Visual identity"],
        ["confianza", "Elementos de confianza", "Vertrauenselemente", "Trust elements"],
      ]],
      ["productos", ["Productos", "Produkte", "Products"], [
        ["fichas", "Fichas de producto que venden", "Produktseiten, die verkaufen", "Product pages that sell"],
        ["fotos", "Fotos y descripciones", "Fotos und Beschreibungen", "Photos and descriptions"],
        ["colecciones", "Colecciones y navegación", "Kollektionen und Navigation", "Collections and navigation"],
      ]],
      ["operaciones", ["Pagos y envíos", "Zahlungen und Versand", "Payments and shipping"], [
        ["pagos", "Pasarelas de pago", "Zahlungsanbieter", "Payment providers"],
        ["envios", "Zonas y tarifas de envío", "Versandzonen und -kosten", "Shipping zones and rates"],
        ["legal", "Páginas legales y privacidad", "Rechtstexte und Datenschutz", "Legal pages and privacy"],
      ]],
      ["lanzamiento", ["Lanzamiento", "Launch", "Launch"], [
        ["checklist", "Checklist antes de publicar", "Checkliste vor dem Start", "Pre-launch checklist"],
        ["trafico", "Primeras fuentes de tráfico", "Erste Traffic-Quellen", "First traffic sources"],
        ["analitica", "Analítica y mejoras", "Analyse und Verbesserungen", "Analytics and improvements"],
      ]],
    ]),
    faq: [independent("Shopify")],
  },
  {
    slug: "etsy", order: 6, cover: "etsy", area: "digital", level: "beginner", status: "soon",
    title: t("Etsy – Productos digitales y Handmade", "Etsy – Digitale Produkte und Handmade", "Etsy – Digital Products & Handmade"),
    short: t("Vende plantillas, imprimibles o productos hechos a mano.", "Vorlagen, Printables oder Handgemachtes verkaufen.", "Sell templates, printables or handmade products."),
    description: t(
      "Aprende a abrir y gestionar una tienda en Etsy: productos digitales descargables y artículos hechos a mano, fichas optimizadas, fotos, precios con todas las tarifas y atención al cliente.",
      "Lerne, einen Etsy-Shop zu eröffnen und zu führen: digitale Downloads und handgemachte Artikel, optimierte Angebote, Fotos, Preise inklusive aller Gebühren und Kundenservice.",
      "Learn to open and run an Etsy shop: digital downloads and handmade items, optimised listings, photos, pricing including all fees, and customer service.",
    ),
    goals: tl(
      ["Elegir qué vender en Etsy.", "Crear fichas optimizadas para la búsqueda.", "Calcular precios incluyendo tarifas.", "Ofrecer una buena experiencia de compra."],
      ["Entscheiden, was du auf Etsy verkaufst.", "Für die Suche optimierte Angebote erstellen.", "Preise inklusive Gebühren kalkulieren.", "Ein gutes Einkaufserlebnis bieten."],
      ["Decide what to sell on Etsy.", "Create search-optimised listings.", "Price products including fees.", "Offer a great buying experience."],
    ),
    audience: tl(["Creativos, diseñadores y artesanos."], ["Kreative, Designer:innen und Kunsthandwerker:innen."], ["Creatives, designers and makers."]),
    requirements: withExtra("Para productos digitales: un programa de diseño (por ejemplo Canva).", "Für digitale Produkte: ein Designprogramm (z. B. Canva).", "For digital products: a design tool (e.g. Canva)."),
    keywords: ["etsy", "handmade", "imprimibles", "printables", "plantillas"],
    modules: modules([
      ["fundamentos", ["Fundamentos de Etsy", "Etsy-Grundlagen", "Etsy fundamentals"], [
        ["como-funciona", "Cómo funciona Etsy y sus tarifas", "So funktioniert Etsy und seine Gebühren", "How Etsy and its fees work"],
        ["que-vender", "Qué vender: digital o físico", "Was verkaufen: digital oder physisch", "What to sell: digital or physical"],
        ["tienda", "Abrir tu tienda", "Deinen Shop eröffnen", "Opening your shop"],
      ]],
      ["digital", ["Productos digitales", "Digitale Produkte", "Digital products"], [
        ["ideas", "Ideas de productos descargables", "Ideen für Downloads", "Downloadable product ideas"],
        ["creacion", "Crear y entregar archivos", "Dateien erstellen und ausliefern", "Creating and delivering files"],
        ["licencias", "Licencias y derechos", "Lizenzen und Rechte", "Licences and rights"],
      ]],
      ["fichas", ["Fichas y SEO", "Angebote und SEO", "Listings and SEO"], [
        ["titulos", "Títulos y etiquetas", "Titel und Tags", "Titles and tags"],
        ["fotos", "Fotos y mockups", "Fotos und Mockups", "Photos and mockups"],
        ["precios", "Precios y rentabilidad", "Preise und Rentabilität", "Pricing and profitability"],
      ]],
      ["clientes", ["Clientes", "Kund:innen", "Customers"], [
        ["atencion", "Atención y mensajes", "Service und Nachrichten", "Service and messages"],
        ["resenas", "Reseñas y reputación", "Bewertungen und Ruf", "Reviews and reputation"],
        ["politicas", "Políticas de la tienda", "Shop-Richtlinien", "Shop policies"],
      ]],
      ["crecimiento", ["Crecimiento", "Wachstum", "Growth"], [
        ["promocion", "Promoción fuera de Etsy", "Werbung außerhalb von Etsy", "Promotion outside Etsy"],
        ["estadisticas", "Estadísticas de la tienda", "Shop-Statistiken", "Shop statistics"],
        ["plan", "Plan de 60 días", "60-Tage-Plan", "60-day plan"],
      ]],
    ]),
    faq: [independent("Etsy")],
  },
  {
    slug: "ebay", order: 7, cover: "ebay", area: "ecommerce", level: "beginner", status: "soon",
    title: t("eBay – Comercio online y reventa", "eBay – Onlinehandel und Wiederverkauf", "eBay – Online Selling & Reselling"),
    short: t("Vende y revende con método, números claros y buena reputación.", "Mit Methode, klaren Zahlen und gutem Ruf verkaufen.", "Sell and resell with method, clear numbers and a good reputation."),
    description: t(
      "Del primer artículo a un negocio de reventa organizado: búsqueda de productos, anuncios, precios, envíos, reputación y diferencias entre vender como particular y como empresa.",
      "Vom ersten Artikel zum organisierten Wiederverkaufs-Business: Warensuche, Angebote, Preise, Versand, Bewertungen und der Unterschied zwischen privatem und gewerblichem Verkauf.",
      "From your first item to an organised reselling business: sourcing, listings, pricing, shipping, reputation and the difference between selling privately and as a business.",
    ),
    goals: tl(
      ["Crear anuncios claros y competitivos.", "Encontrar productos para revender.", "Calcular precios, tarifas y envío.", "Construir una buena reputación."],
      ["Klare, wettbewerbsfähige Angebote erstellen.", "Waren für den Wiederverkauf finden.", "Preise, Gebühren und Versand kalkulieren.", "Einen guten Ruf aufbauen."],
      ["Create clear, competitive listings.", "Find products to resell.", "Calculate prices, fees and shipping.", "Build a good reputation."],
    ),
    audience: tl(["Personas que quieren vender o revender productos físicos."], ["Alle, die physische Produkte verkaufen oder weiterverkaufen möchten."], ["Anyone who wants to sell or resell physical products."]),
    requirements: noExperience,
    keywords: ["ebay", "reventa", "reselling", "wiederverkauf"],
    modules: modules([
      ["fundamentos", ["Fundamentos", "Grundlagen", "Foundations"], [
        ["cuenta", "Cuenta particular o profesional", "Privat- oder Geschäftskonto", "Private or business account"],
        ["tarifas", "Tarifas y pagos", "Gebühren und Zahlungen", "Fees and payments"],
        ["normas", "Normas y artículos prohibidos", "Regeln und verbotene Artikel", "Rules and prohibited items"],
      ]],
      ["sourcing", ["Encontrar productos", "Ware finden", "Sourcing"], [
        ["casa", "Empezar con lo que tienes", "Mit dem anfangen, was du hast", "Starting with what you have"],
        ["fuentes", "Fuentes de productos", "Bezugsquellen", "Product sources"],
        ["investigacion", "Investigar precios de venta", "Verkaufspreise recherchieren", "Researching sold prices"],
      ]],
      ["anuncios", ["Anuncios", "Angebote", "Listings"], [
        ["titulos", "Títulos y categorías", "Titel und Kategorien", "Titles and categories"],
        ["fotos", "Fotos honestas", "Ehrliche Fotos", "Honest photos"],
        ["formato", "Subasta o precio fijo", "Auktion oder Festpreis", "Auction or fixed price"],
      ]],
      ["envios", ["Envíos y servicio", "Versand und Service", "Shipping and service"], [
        ["embalaje", "Embalaje y envío", "Verpackung und Versand", "Packing and shipping"],
        ["devoluciones", "Devoluciones", "Rücksendungen", "Returns"],
        ["valoraciones", "Valoraciones", "Bewertungen", "Feedback"],
      ]],
      ["negocio", ["De hobby a negocio", "Vom Hobby zum Business", "From hobby to business"], [
        ["numeros", "Controlar tus números", "Deine Zahlen im Blick", "Tracking your numbers"],
        ["obligaciones", "Obligaciones fiscales: qué consultar", "Steuerliche Pflichten: was du klären solltest", "Tax obligations: what to check"],
        ["sistema", "Un sistema semanal", "Ein Wochensystem", "A weekly system"],
      ]],
    ]),
    faq: [independent("eBay")],
  },
  {
    slug: "aliexpress", order: 8, cover: "aliexpress", area: "ecommerce", level: "intermediate", status: "soon",
    title: t("AliExpress – Afiliados y Dropshipping", "AliExpress – Affiliate und Dropshipping", "AliExpress – Affiliate & Dropshipping"),
    short: t("Afiliación y dropshipping con una visión realista de riesgos y plazos.", "Affiliate und Dropshipping mit realistischem Blick auf Risiken und Lieferzeiten.", "Affiliate marketing and dropshipping with a realistic view of risks and delivery times."),
    description: t(
      "Conoce el programa de afiliados de AliExpress y el modelo de dropshipping: proveedores, tiempos de entrega, aduanas e impuestos, derechos del consumidor y atención al cliente. Para decidir con información y no con expectativas.",
      "Lerne das AliExpress-Affiliate-Programm und das Dropshipping-Modell kennen: Lieferanten, Lieferzeiten, Zoll und Steuern, Verbraucherrechte und Kundenservice – damit du mit Informationen entscheidest, nicht mit Erwartungen.",
      "Get to know AliExpress's affiliate programme and the dropshipping model: suppliers, delivery times, customs and taxes, consumer rights and customer service – so you decide with information, not expectations.",
    ),
    goals: tl(
      ["Entender afiliación y dropshipping y sus diferencias.", "Evaluar proveedores y calidad.", "Conocer aduanas, impuestos y derechos del consumidor.", "Calcular márgenes realistas."],
      ["Affiliate und Dropshipping und ihre Unterschiede verstehen.", "Lieferanten und Qualität bewerten.", "Zoll, Steuern und Verbraucherrechte kennen.", "Realistische Margen kalkulieren."],
      ["Understand affiliate marketing vs. dropshipping.", "Evaluate suppliers and quality.", "Know customs, taxes and consumer rights.", "Calculate realistic margins."],
    ),
    audience: tl(["Personas con nociones básicas de e-commerce."], ["Menschen mit E-Commerce-Grundkenntnissen."], ["People with basic e-commerce knowledge."]),
    requirements: tl(
      ["Conocimientos básicos de tiendas online (por ejemplo el curso de Shopify).", "Un ordenador con conexión a internet."],
      ["Grundkenntnisse zu Onlineshops (z. B. der Shopify-Kurs).", "Computer mit Internetzugang."],
      ["Basic online-store knowledge (e.g. the Shopify course).", "A computer with internet access."],
    ),
    keywords: ["aliexpress", "dropshipping", "afiliados", "affiliate", "proveedores"],
    modules: modules([
      ["modelos", ["Modelos", "Modelle", "Models"], [
        ["afiliados", "Programa de afiliados de AliExpress", "Das AliExpress-Affiliate-Programm", "AliExpress affiliate programme"],
        ["dropshipping", "Qué es el dropshipping de verdad", "Was Dropshipping wirklich bedeutet", "What dropshipping really is"],
        ["riesgos", "Riesgos y responsabilidades", "Risiken und Verantwortung", "Risks and responsibilities"],
      ]],
      ["proveedores", ["Proveedores", "Lieferanten", "Suppliers"], [
        ["evaluar", "Evaluar proveedores", "Lieferanten bewerten", "Evaluating suppliers"],
        ["muestras", "Pedir muestras", "Muster bestellen", "Ordering samples"],
        ["plazos", "Plazos de entrega", "Lieferzeiten", "Delivery times"],
      ]],
      ["legal", ["Aduanas y consumidor", "Zoll und Verbraucher", "Customs and consumers"], [
        ["aduanas", "Aduanas e impuestos de importación", "Zoll und Einfuhrsteuern", "Customs and import taxes"],
        ["derechos", "Derechos del consumidor", "Verbraucherrechte", "Consumer rights"],
        ["seguridad", "Seguridad de producto y certificados", "Produktsicherheit und Zertifikate", "Product safety and certificates"],
      ]],
      ["tienda", ["Tienda y marketing", "Shop und Marketing", "Store and marketing"], [
        ["integracion", "Conectar tienda y proveedor", "Shop und Lieferant verbinden", "Connecting store and supplier"],
        ["contenido", "Contenido y anuncios", "Content und Anzeigen", "Content and ads"],
        ["atencion", "Atención al cliente", "Kundenservice", "Customer service"],
      ]],
      ["numeros", ["Números", "Zahlen", "Numbers"], [
        ["margen", "Margen real", "Echte Marge", "Real margin"],
        ["devoluciones", "Coste de devoluciones", "Kosten von Rücksendungen", "Cost of returns"],
        ["decision", "Decidir con datos", "Mit Daten entscheiden", "Deciding with data"],
      ]],
    ]),
    faq: [independent("AliExpress")],
  },
  {
    slug: "hotmart", order: 9, cover: "hotmart", area: "digital", level: "beginner", status: "soon",
    title: t("Hotmart – Productos digitales y cursos online", "Hotmart – Digitale Produkte und Onlinekurse", "Hotmart – Digital Products & Online Courses"),
    short: t("Crea, publica y vende tu producto digital o tu curso.", "Dein digitales Produkt oder deinen Kurs erstellen und verkaufen.", "Create, publish and sell your digital product or course."),
    description: t(
      "Aprende a convertir tu conocimiento en un producto digital y a venderlo en Hotmart, ya sea como productor o como afiliado: idea, validación, creación, página de ventas y lanzamiento.",
      "Lerne, dein Wissen in ein digitales Produkt zu verwandeln und es auf Hotmart zu verkaufen – als Produzent:in oder als Affiliate: Idee, Validierung, Erstellung, Verkaufsseite und Launch.",
      "Learn to turn your knowledge into a digital product and sell it on Hotmart – as a producer or as an affiliate: idea, validation, creation, sales page and launch.",
    ),
    goals: tl(
      ["Definir y validar una idea de producto digital.", "Crear un curso o e-book bien estructurado.", "Configurar tu producto en Hotmart.", "Preparar un lanzamiento sencillo."],
      ["Eine Idee für ein digitales Produkt definieren und prüfen.", "Einen gut strukturierten Kurs oder ein E-Book erstellen.", "Dein Produkt in Hotmart einrichten.", "Einen einfachen Launch vorbereiten."],
      ["Define and validate a digital product idea.", "Create a well-structured course or e-book.", "Set up your product on Hotmart.", "Prepare a simple launch."],
    ),
    audience: tl(["Expertos, profesores y creadores con conocimientos que compartir."], ["Expert:innen, Lehrende und Creator mit Wissen zum Teilen."], ["Experts, teachers and creators with knowledge to share."]),
    requirements: noExperience,
    keywords: ["hotmart", "infoproductos", "curso online", "ebook", "productos digitales"],
    modules: modules([
      ["idea", ["Idea y validación", "Idee und Validierung", "Idea and validation"], [
        ["conocimiento", "Tu conocimiento como producto", "Dein Wissen als Produkt", "Your knowledge as a product"],
        ["publico", "Público y problema", "Zielgruppe und Problem", "Audience and problem"],
        ["validacion", "Validar antes de crear", "Validieren vor dem Erstellen", "Validate before creating"],
      ]],
      ["creacion", ["Creación", "Erstellung", "Creation"], [
        ["estructura", "Estructura del curso", "Kursstruktur", "Course structure"],
        ["grabacion", "Grabar con medios sencillos", "Mit einfachen Mitteln aufnehmen", "Recording with simple gear"],
        ["materiales", "Materiales descargables", "Downloadmaterial", "Downloadable materials"],
      ]],
      ["plataforma", ["Hotmart", "Hotmart", "Hotmart"], [
        ["configuracion", "Configurar tu producto", "Dein Produkt einrichten", "Setting up your product"],
        ["area-miembros", "Área de miembros", "Mitgliederbereich", "Members area"],
        ["afiliados", "Trabajar con afiliados", "Mit Affiliates arbeiten", "Working with affiliates"],
      ]],
      ["ventas", ["Ventas", "Verkauf", "Sales"], [
        ["pagina-ventas", "Página de ventas honesta", "Eine ehrliche Verkaufsseite", "An honest sales page"],
        ["precio", "Precio y oferta", "Preis und Angebot", "Price and offer"],
        ["lanzamiento", "Lanzamiento sencillo", "Ein einfacher Launch", "A simple launch"],
      ]],
      ["alumnos", ["Alumnos", "Teilnehmende", "Students"], [
        ["experiencia", "Experiencia del alumno", "Lernerlebnis", "Student experience"],
        ["soporte", "Soporte y comunidad", "Support und Community", "Support and community"],
        ["mejora", "Mejora continua", "Kontinuierliche Verbesserung", "Continuous improvement"],
      ]],
    ]),
    faq: [independent("Hotmart")],
  },
  {
    slug: "canva-ia", order: 10, cover: "canva", area: "ai", level: "all", status: "soon",
    title: t("Canva & IA – Diseños y productos digitales", "Canva & KI – Designs und digitale Produkte", "Canva & AI – Designs and Digital Products"),
    short: t("Diseña con Canva y herramientas de IA, con calidad y derechos claros.", "Mit Canva und KI gestalten – hochwertig und rechtlich sauber.", "Design with Canva and AI tools – high quality, with clear rights."),
    description: t(
      "Crea diseños profesionales para redes, marca y productos digitales (plantillas, e-books, imprimibles) con Canva y herramientas de IA. Incluye licencias, uso comercial y revisión de calidad.",
      "Erstelle professionelle Designs für Social Media, Marke und digitale Produkte (Vorlagen, E-Books, Printables) mit Canva und KI-Tools – inklusive Lizenzen, kommerzieller Nutzung und Qualitätscheck.",
      "Create professional designs for social media, branding and digital products (templates, e-books, printables) with Canva and AI tools – including licences, commercial use and quality checks.",
    ),
    goals: tl(
      ["Dominar las funciones esenciales de Canva.", "Usar IA para ideas, textos e imágenes con criterio.", "Crear productos digitales vendibles.", "Conocer licencias y uso comercial."],
      ["Die wichtigsten Canva-Funktionen beherrschen.", "KI für Ideen, Texte und Bilder überlegt nutzen.", "Verkaufbare digitale Produkte erstellen.", "Lizenzen und kommerzielle Nutzung kennen."],
      ["Master Canva's essential features.", "Use AI for ideas, copy and images wisely.", "Create sellable digital products.", "Understand licences and commercial use."],
    ),
    audience: tl(["Emprendedores, creadores y cualquier persona que quiera diseñar mejor."], ["Gründer:innen, Creator und alle, die besser gestalten wollen."], ["Entrepreneurs, creators and anyone who wants to design better."]),
    requirements: withExtra("Una cuenta gratuita de Canva (algunas funciones son de pago).", "Ein kostenloses Canva-Konto (manche Funktionen sind kostenpflichtig).", "A free Canva account (some features are paid)."),
    keywords: ["canva", "ia", "ki", "ai", "diseño", "design", "plantillas"],
    modules: modules([
      ["canva", ["Canva esencial", "Canva-Grundlagen", "Canva essentials"], [
        ["interfaz", "Interfaz y primeros diseños", "Oberfläche und erste Designs", "Interface and first designs"],
        ["marca", "Kit de marca", "Brand Kit", "Brand kit"],
        ["composicion", "Composición, color y tipografía", "Komposition, Farbe und Schrift", "Composition, colour and type"],
      ]],
      ["ia", ["IA creativa", "Kreative KI", "Creative AI"], [
        ["prompts", "Prompts claros", "Klare Prompts", "Clear prompts"],
        ["imagenes", "Imágenes con IA", "Bilder mit KI", "Images with AI"],
        ["revision", "Revisar y mejorar resultados", "Ergebnisse prüfen und verbessern", "Reviewing and improving results"],
      ]],
      ["redes", ["Diseño para redes", "Design für Social Media", "Design for social media"], [
        ["plantillas-redes", "Plantillas para publicaciones", "Vorlagen für Beiträge", "Post templates"],
        ["carruseles", "Carruseles que se leen", "Karussells, die gelesen werden", "Carousels people read"],
        ["video", "Vídeo corto en Canva", "Kurzvideo in Canva", "Short video in Canva"],
      ]],
      ["productos", ["Productos digitales", "Digitale Produkte", "Digital products"], [
        ["ebook", "Diseñar un e-book", "Ein E-Book gestalten", "Designing an e-book"],
        ["imprimibles", "Imprimibles y planners", "Printables und Planer", "Printables and planners"],
        ["plantillas-venta", "Plantillas para vender", "Vorlagen zum Verkaufen", "Templates to sell"],
      ]],
      ["legal", ["Licencias", "Lizenzen", "Licences"], [
        ["licencias-canva", "Licencias de Canva", "Canva-Lizenzen", "Canva licences"],
        ["ia-derechos", "IA y derechos de autor", "KI und Urheberrecht", "AI and copyright"],
        ["entrega", "Entregar productos al cliente", "Produkte an Kund:innen ausliefern", "Delivering products to customers"],
      ]],
    ]),
    faq: [independent("Canva")],
  },
  {
    slug: "youtube", order: 11, cover: "youtube", area: "social", level: "beginner", status: "soon",
    title: t("YouTube – Contenido y monetización", "YouTube – Content und Monetarisierung", "YouTube – Content & Monetisation"),
    short: t("Construye un canal con propósito y fuentes de ingreso diversas.", "Einen Kanal mit Konzept und mehreren Einnahmequellen aufbauen.", "Build a purposeful channel with diverse income streams."),
    description: t(
      "Planifica, graba y publica vídeos que la gente quiera ver. Conoce las vías de monetización —Programa de Socios, afiliados, patrocinios y productos propios— y sus requisitos, sin atajos.",
      "Plane, drehe und veröffentliche Videos, die Menschen sehen wollen. Lerne die Monetarisierungswege kennen – Partnerprogramm, Affiliate, Sponsoring und eigene Produkte – samt Voraussetzungen, ohne Abkürzungen.",
      "Plan, film and publish videos people want to watch. Learn the monetisation routes – Partner Programme, affiliate links, sponsorships and your own products – and their requirements, without shortcuts.",
    ),
    goals: tl(
      ["Definir el concepto de tu canal.", "Grabar y editar con medios sencillos.", "Optimizar títulos y miniaturas.", "Conocer las vías de monetización."],
      ["Das Konzept deines Kanals festlegen.", "Mit einfachen Mitteln drehen und schneiden.", "Titel und Thumbnails optimieren.", "Die Monetarisierungswege kennen."],
      ["Define your channel concept.", "Film and edit with simple gear.", "Optimise titles and thumbnails.", "Understand monetisation routes."],
    ),
    audience: tl(["Personas que quieren crear un canal o profesionalizar el suyo."], ["Alle, die einen Kanal starten oder professionalisieren wollen."], ["Anyone who wants to start or professionalise a channel."]),
    requirements: withExtra("Un smartphone con cámara es suficiente para empezar.", "Ein Smartphone mit Kamera reicht für den Anfang.", "A smartphone with a camera is enough to start."),
    keywords: ["youtube", "video", "monetizacion", "monetarisierung", "shorts"],
    modules: modules([
      ["concepto", ["Concepto del canal", "Kanalkonzept", "Channel concept"], [
        ["nicho", "Nicho y propuesta", "Nische und Versprechen", "Niche and promise"],
        ["formatos", "Formatos: vídeo largo y Shorts", "Formate: lange Videos und Shorts", "Formats: long videos and Shorts"],
        ["plan", "Plan de contenido", "Content-Plan", "Content plan"],
      ]],
      ["produccion", ["Producción", "Produktion", "Production"], [
        ["equipo", "Equipo básico", "Basis-Ausstattung", "Basic gear"],
        ["guion", "Guion y estructura", "Skript und Aufbau", "Script and structure"],
        ["edicion", "Edición", "Schnitt", "Editing"],
      ]],
      ["crecimiento", ["Crecimiento", "Wachstum", "Growth"], [
        ["titulos", "Títulos y miniaturas", "Titel und Thumbnails", "Titles and thumbnails"],
        ["retencion", "Retención de audiencia", "Zuschauerbindung", "Audience retention"],
        ["analitica", "YouTube Analytics", "YouTube Analytics", "YouTube Analytics"],
      ]],
      ["monetizacion", ["Monetización", "Monetarisierung", "Monetisation"], [
        ["socios", "Programa de Socios: requisitos", "Partnerprogramm: Voraussetzungen", "Partner Programme: requirements"],
        ["afiliados-patrocinios", "Afiliados y patrocinios", "Affiliate und Sponsoring", "Affiliates and sponsorships"],
        ["productos-propios", "Productos propios", "Eigene Produkte", "Your own products"],
      ]],
      ["normas", ["Normas y derechos", "Regeln und Rechte", "Rules and rights"], [
        ["derechos-autor", "Derechos de autor y música", "Urheberrecht und Musik", "Copyright and music"],
        ["publicidad", "Señalar contenido patrocinado", "Gesponserte Inhalte kennzeichnen", "Labelling sponsored content"],
        ["constancia", "Constancia sin agotarte", "Dranbleiben ohne Ausbrennen", "Consistency without burnout"],
      ]],
    ]),
    faq: [independent("YouTube")],
  },
  {
    slug: "marketing-digital", order: 12, cover: "marketing", area: "social", level: "all", status: "soon",
    title: t("Marketing Digital – Redes sociales, publicidad y embudos", "Digitales Marketing – Social Media, Werbung und Funnels", "Digital Marketing – Social Media, Ads & Funnels"),
    short: t("La base para atraer clientes a cualquier negocio online.", "Das Fundament, um Kund:innen für jedes Online-Business zu gewinnen.", "The foundation for attracting customers to any online business."),
    description: t(
      "Estrategia, redes sociales, publicidad de pago, embudos de venta, email marketing y analítica: todo lo que necesitas para atraer clientes de forma sostenible, con presupuestos controlados.",
      "Strategie, Social Media, bezahlte Werbung, Verkaufstrichter, E-Mail-Marketing und Analyse – alles, um nachhaltig Kund:innen zu gewinnen, mit kontrolliertem Budget.",
      "Strategy, social media, paid ads, sales funnels, email marketing and analytics – everything you need to attract customers sustainably, on a controlled budget.",
    ),
    goals: tl(
      ["Crear una estrategia de marketing sencilla.", "Planificar contenido para redes.", "Lanzar campañas de publicidad con presupuesto controlado.", "Diseñar un embudo y medirlo."],
      ["Eine einfache Marketingstrategie erstellen.", "Social-Media-Content planen.", "Werbekampagnen mit kontrolliertem Budget starten.", "Einen Funnel aufbauen und messen."],
      ["Create a simple marketing strategy.", "Plan social media content.", "Launch ad campaigns on a controlled budget.", "Design a funnel and measure it."],
    ),
    audience: tl(["Emprendedores, freelancers y creadores de cualquier sector."], ["Gründer:innen, Freelancer und Creator jeder Branche."], ["Entrepreneurs, freelancers and creators in any field."]),
    requirements: noExperience,
    keywords: ["marketing", "redes sociales", "social media", "publicidad", "ads", "embudos", "funnel", "email"],
    modules: modules([
      ["estrategia", ["Estrategia", "Strategie", "Strategy"], [
        ["cliente-ideal", "Cliente ideal y propuesta de valor", "Wunschkunde und Nutzenversprechen", "Ideal customer and value proposition"],
        ["objetivos", "Objetivos medibles", "Messbare Ziele", "Measurable goals"],
        ["canales", "Elegir canales", "Kanäle wählen", "Choosing channels"],
      ]],
      ["redes", ["Redes sociales", "Social Media", "Social media"], [
        ["pilares", "Pilares de contenido", "Content-Säulen", "Content pillars"],
        ["calendario", "Calendario editorial", "Redaktionsplan", "Editorial calendar"],
        ["comunidad", "Construir comunidad", "Community aufbauen", "Building community"],
      ]],
      ["publicidad", ["Publicidad", "Werbung", "Advertising"], [
        ["fundamentos-ads", "Fundamentos de anuncios", "Grundlagen von Anzeigen", "Ad fundamentals"],
        ["segmentacion", "Segmentación y creatividades", "Zielgruppen und Creatives", "Targeting and creatives"],
        ["presupuesto", "Presupuesto y pruebas", "Budget und Tests", "Budget and tests"],
      ]],
      ["embudos", ["Embudos", "Funnels", "Funnels"], [
        ["etapas", "Etapas del embudo", "Funnel-Stufen", "Funnel stages"],
        ["lead-magnet", "Lead magnet y landing page", "Lead-Magnet und Landingpage", "Lead magnet and landing page"],
        ["email", "Email marketing con permiso", "E-Mail-Marketing mit Einwilligung", "Permission-based email marketing"],
      ]],
      ["analitica", ["Analítica", "Analyse", "Analytics"], [
        ["kpis", "KPIs que importan", "KPIs, die zählen", "KPIs that matter"],
        ["privacidad", "Privacidad y cookies", "Datenschutz und Cookies", "Privacy and cookies"],
        ["optimizacion", "Optimización continua", "Laufende Optimierung", "Continuous optimisation"],
      ]],
    ]),
    faq: [],
  },
];
