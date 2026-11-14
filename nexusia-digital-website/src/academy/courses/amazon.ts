import { t, tl, soon, type Course } from "../types";
import { amazonSampleLesson } from "./amazon-sample-lesson";

export const amazonCourse: Course = {
  slug: "amazon-business",
  brand: { name: "Amazon", logo: { status: "pending", terms: "https://affiliate-program.amazon.com/help/operating/amazonmarks/", note: "Amazon-Logo und Smile-Logo sind für Publisher nicht erlaubt; Nutzung nur nach schriftlicher Freigabe über Amazon." } },
  order: 1,
  cover: "amazon",
  area: "ecommerce",
  level: "beginner",
  status: "soon",
  priceCents: 9700,
  priceIsExample: true,
  sampleLesson: "modelos-de-negocio",
  title: t(
    "Amazon Business Masterclass – De Cero a tu Negocio Online",
    "Amazon Business Masterclass – Von null zum eigenen Online-Business",
    "Amazon Business Masterclass – From Zero to Your Online Business",
  ),
  short: t(
    "Afiliados, Influencer, FBA, FBM y KDP: entiende cada modelo y construye tu negocio paso a paso.",
    "Affiliate, Influencer, FBA, FBM und KDP: jedes Modell verstehen und Schritt für Schritt aufbauen.",
    "Affiliate, Influencer, FBA, FBM and KDP: understand each model and build your business step by step.",
  ),
  description: t(
    "Un programa completo para entender cómo funcionan los distintos modelos de negocio en Amazon y aplicarlos con criterio: desde recomendar productos como afiliado hasta vender con Seller Central o publicar tu propio libro con KDP. Con cálculo de beneficios, marketing de contenidos, redes sociales, email marketing, herramientas de IA y un plan de acción de 90 días. Sin promesas de ingresos: con números, método y transparencia.",
    "Ein umfassendes Programm, um die verschiedenen Geschäftsmodelle auf Amazon zu verstehen und überlegt anzuwenden: vom Empfehlen als Affiliate über den Verkauf mit Seller Central bis zum eigenen Buch mit KDP. Mit Gewinnberechnung, Content-Marketing, Social Media, E-Mail-Marketing, KI-Tools und einem 90-Tage-Aktionsplan. Ohne Einkommensversprechen – mit Zahlen, Methode und Transparenz.",
    "A complete programme to understand how the different business models on Amazon work and apply them wisely: from recommending products as an affiliate to selling via Seller Central or publishing your own book with KDP. Including profit calculation, content marketing, social media, email marketing, AI tools and a 90-day action plan. No income promises – just numbers, method and transparency.",
  ),
  goals: tl(
    [
      "Distinguir los cinco modelos de negocio en Amazon y elegir el adecuado para ti.",
      "Configurar y usar Amazon Afiliados respetando las normas de divulgación.",
      "Entender Seller Central, FBA y FBM y calcular costes antes de invertir.",
      "Investigar productos y validar ideas con datos.",
      "Publicar un libro con KDP: manuscrito, portada, metadatos y precio.",
      "Atraer clientes con contenido, TikTok, Instagram, embudos y email marketing.",
      "Usar herramientas de IA con criterio y salir con un plan de 90 días.",
    ],
    [
      "Die fünf Amazon-Geschäftsmodelle unterscheiden und das passende wählen.",
      "Amazon-Partnerprogramm einrichten und Kennzeichnungspflichten einhalten.",
      "Seller Central, FBA und FBM verstehen und Kosten vor einer Investition berechnen.",
      "Produkte recherchieren und Ideen mit Daten prüfen.",
      "Ein Buch mit KDP veröffentlichen: Manuskript, Cover, Metadaten und Preis.",
      "Kunden mit Content, TikTok, Instagram, Funnels und E-Mail-Marketing gewinnen.",
      "KI-Tools überlegt nutzen und mit einem 90-Tage-Plan starten.",
    ],
    [
      "Distinguish the five Amazon business models and choose the right one for you.",
      "Set up and use Amazon Associates while following disclosure rules.",
      "Understand Seller Central, FBA and FBM and calculate costs before investing.",
      "Research products and validate ideas with data.",
      "Publish a book with KDP: manuscript, cover, metadata and pricing.",
      "Attract customers with content, TikTok, Instagram, funnels and email marketing.",
      "Use AI tools wisely and leave with a 90-day plan.",
    ],
  ),
  audience: tl(
    ["Personas que empiezan desde cero en el negocio online.", "Creadores de contenido que quieren monetizar recomendaciones.", "Quienes quieren publicar su propio libro o vender productos físicos."],
    ["Menschen, die online bei null anfangen.", "Content-Creator, die Empfehlungen monetarisieren möchten.", "Alle, die ein eigenes Buch veröffentlichen oder physische Produkte verkaufen wollen."],
    ["People starting an online business from scratch.", "Content creators who want to monetise recommendations.", "Anyone who wants to publish a book or sell physical products."],
  ),
  requirements: tl(
    ["No necesitas experiencia previa.", "Un ordenador o smartphone con conexión a internet.", "Para vender o recibir pagos, cada programa de Amazon pide sus propios datos (por ejemplo identidad, cuenta bancaria e información fiscal). Lo revisamos en el curso según tu país."],
    ["Keine Vorkenntnisse nötig.", "Computer oder Smartphone mit Internetzugang.", "Für Verkauf oder Auszahlungen verlangt jedes Amazon-Programm eigene Angaben (z. B. Identität, Bankkonto, Steuerdaten). Das gehen wir im Kurs je nach Land durch."],
    ["No prior experience needed.", "A computer or smartphone with internet access.", "To sell or receive payouts, each Amazon programme asks for its own details (e.g. identity, bank account, tax information). We cover this per country in the course."],
  ),
  keywords: ["amazon", "afiliados", "affiliate", "influencer", "fba", "fbm", "kdp", "seller central", "kindle", "libro", "buch", "book"],
  modules: [
    {
      slug: "fundamentos",
      title: t("Fundamentos", "Grundlagen", "Foundations"),
      lessons: [
        {
          slug: "modelos-de-negocio",
          title: t("Los 5 modelos de negocio en Amazon (y cuál elegir)", "Die 5 Geschäftsmodelle auf Amazon (und welches passt)", "The 5 business models on Amazon (and which to choose)"),
          minutes: 25,
          access: "preview",
          status: "ready",
          body: amazonSampleLesson,
          downloads: [
            { label: t("Hoja de trabajo: tu mapa de decisión", "Arbeitsblatt: deine Entscheidungskarte", "Worksheet: your decision map"), href: "/academia/amazon-hoja-de-trabajo-modelos.pdf", format: "PDF", public: true },
          ],
        },
        soon("marketplaces-internacionales", "Marketplaces de Amazon en distintos países", "Amazon-Marktplätze in verschiedenen Ländern", "Amazon marketplaces in different countries"),
        soon("objetivo-y-punto-de-partida", "Define tu objetivo y tu punto de partida", "Ziel und Ausgangspunkt festlegen", "Define your goal and starting point"),
      ],
    },
    {
      slug: "afiliados",
      title: t("Amazon Afiliados", "Amazon-Partnerprogramm", "Amazon Associates"),
      lessons: [
        soon("como-funciona-afiliados", "Cómo funciona el programa y cómo registrarte", "So funktioniert das Programm und die Anmeldung", "How the programme works and how to sign up"),
        soon("enlaces-y-divulgacion", "Enlaces, herramientas y normas de divulgación", "Links, Tools und Kennzeichnungspflichten", "Links, tools and disclosure rules"),
        soon("nicho-y-productos", "Elegir nicho y productos para recomendar", "Nische und Produkte zum Empfehlen wählen", "Choosing a niche and products to recommend"),
      ],
    },
    {
      slug: "influencer",
      title: t("Amazon Influencer", "Amazon Influencer", "Amazon Influencer"),
      lessons: [
        soon("programa-influencers", "Qué es el Programa de Influencers", "Was ist das Influencer-Programm?", "What the Influencer Program is"),
        soon("tienda-de-influencer", "Tu tienda de influencer y listas de ideas", "Dein Influencer-Shop und Ideenlisten", "Your influencer storefront and idea lists"),
        soon("videos-de-producto", "Vídeos de producto que ayudan a decidir", "Produktvideos, die bei der Entscheidung helfen", "Product videos that help people decide"),
      ],
    },
    {
      slug: "seller-central",
      title: t("Seller Central", "Seller Central", "Seller Central"),
      lessons: [
        soon("tipos-de-cuenta", "Tipos de cuenta y planes de venta", "Kontotypen und Verkaufstarife", "Account types and selling plans"),
        soon("registro-y-verificacion", "Registro y verificación: qué preparar", "Registrierung und Verifizierung: was du brauchst", "Registration and verification: what to prepare"),
        soon("recorrido-panel", "Recorrido guiado por el panel", "Geführte Tour durch das Dashboard", "Guided tour of the dashboard"),
      ],
    },
    {
      slug: "fba-fbm",
      title: t("FBA y FBM", "FBA und FBM", "FBA and FBM"),
      lessons: [
        soon("como-funciona-fba", "FBA: cómo funciona la logística de Amazon", "FBA: so funktioniert die Amazon-Logistik", "FBA: how Amazon's fulfilment works"),
        soon("vender-con-fbm", "FBM: vender con envío propio", "FBM: mit eigenem Versand verkaufen", "FBM: selling with your own shipping"),
        soon("comparar-costes", "Comparar costes y elegir el método", "Kosten vergleichen und Methode wählen", "Compare costs and choose a method"),
      ],
    },
    {
      slug: "investigacion-de-productos",
      title: t("Investigación de productos", "Produktrecherche", "Product research"),
      lessons: [
        soon("criterios-buen-producto", "Criterios de un buen producto", "Merkmale eines guten Produkts", "What makes a good product"),
        soon("demanda-y-competencia", "Analizar demanda y competencia", "Nachfrage und Wettbewerb analysieren", "Analysing demand and competition"),
        soon("validar-antes-de-invertir", "Validar antes de invertir", "Vor der Investition validieren", "Validate before you invest"),
      ],
    },
    {
      slug: "kdp",
      title: t("Amazon KDP", "Amazon KDP", "Amazon KDP"),
      lessons: [
        soon("como-funciona-kdp", "Cómo funciona Kindle Direct Publishing", "So funktioniert Kindle Direct Publishing", "How Kindle Direct Publishing works"),
        soon("manuscrito-formato-portada", "Manuscrito, formato y portada", "Manuskript, Format und Cover", "Manuscript, formatting and cover"),
        soon("metadatos-palabras-clave-precio", "Metadatos, palabras clave y precio", "Metadaten, Keywords und Preis", "Metadata, keywords and pricing"),
      ],
    },
    {
      slug: "content-marketing",
      title: t("Marketing de contenidos", "Content-Marketing", "Content marketing"),
      lessons: [
        soon("contenido-que-genera-confianza", "Contenido que genera confianza", "Inhalte, die Vertrauen schaffen", "Content that builds trust"),
        soon("blog-y-seo", "Blog y SEO para recomendaciones", "Blog und SEO für Empfehlungen", "Blog and SEO for recommendations"),
        soon("calendario-de-contenido", "Tu calendario de contenido", "Dein Content-Kalender", "Your content calendar"),
      ],
    },
    {
      slug: "tiktok-instagram",
      title: t("TikTok e Instagram", "TikTok und Instagram", "TikTok and Instagram"),
      lessons: [
        soon("formatos-para-productos", "Formatos que funcionan para productos", "Formate, die für Produkte funktionieren", "Formats that work for products"),
        soon("guiones-y-ganchos", "Guiones cortos y ganchos", "Kurze Skripte und Hooks", "Short scripts and hooks"),
        soon("publicidad-y-divulgacion-redes", "Normas de publicidad y divulgación en redes", "Werbekennzeichnung in sozialen Netzwerken", "Advertising and disclosure rules on social media"),
      ],
    },
    {
      slug: "embudos",
      title: t("Embudos de venta", "Verkaufstrichter", "Sales funnels"),
      lessons: [
        soon("que-es-un-embudo", "Qué es un embudo de ventas", "Was ist ein Verkaufstrichter?", "What a sales funnel is"),
        soon("landing-y-lead-magnet", "Páginas de destino y lead magnets", "Landingpages und Lead-Magnete", "Landing pages and lead magnets"),
        soon("medir-cada-etapa", "Medir cada etapa", "Jede Stufe messen", "Measuring each stage"),
      ],
    },
    {
      slug: "email-marketing",
      title: t("Email marketing", "E-Mail-Marketing", "Email marketing"),
      lessons: [
        soon("lista-con-permiso", "Construir una lista con permiso (RGPD)", "Eine Liste mit Einwilligung aufbauen (DSGVO)", "Building a permission-based list (GDPR)"),
        soon("secuencia-de-bienvenida", "Tu secuencia de bienvenida", "Deine Willkommensserie", "Your welcome sequence"),
        soon("newsletters-de-valor", "Newsletters que aportan valor", "Newsletter mit echtem Mehrwert", "Newsletters that add value"),
      ],
    },
    {
      slug: "herramientas-ia",
      title: t("Herramientas de IA", "KI-Tools", "AI tools"),
      lessons: [
        soon("ia-investigacion-ideas", "IA para investigación e ideas", "KI für Recherche und Ideen", "AI for research and ideas"),
        soon("ia-textos-imagenes-video", "IA para textos, imágenes y vídeo", "KI für Texte, Bilder und Video", "AI for copy, images and video"),
        soon("ia-limites-y-normas", "Límites, verificación y normas de las plataformas", "Grenzen, Prüfung und Plattformregeln", "Limits, fact-checking and platform rules"),
      ],
    },
    {
      slug: "calculo-de-beneficios",
      title: t("Cálculo de beneficios", "Gewinnberechnung", "Profit calculation"),
      lessons: [
        soon("costes-tarifas-margen", "Costes, tarifas y margen", "Kosten, Gebühren und Marge", "Costs, fees and margin"),
        soon("calculadora-rentabilidad", "Calculadora de rentabilidad paso a paso", "Rentabilitätsrechner Schritt für Schritt", "Step-by-step profitability calculator"),
        soon("impuestos-y-obligaciones", "Impuestos y obligaciones: qué consultar", "Steuern und Pflichten: was du klären solltest", "Taxes and obligations: what to check"),
      ],
    },
    {
      slug: "escalado",
      title: t("Escalado", "Skalierung", "Scaling"),
      lessons: [
        soon("sistemas-y-procesos", "Sistemas y procesos", "Systeme und Abläufe", "Systems and processes"),
        soon("sponsored-ads", "Publicidad en Amazon: fundamentos", "Werbung auf Amazon: Grundlagen", "Advertising on Amazon: fundamentals"),
        soon("diversificar", "Diversificar canales y riesgos", "Kanäle und Risiken streuen", "Diversifying channels and risk"),
      ],
    },
    {
      slug: "plan-90-dias",
      title: t("Plan de acción de 90 días", "90-Tage-Aktionsplan", "90-day action plan"),
      lessons: [
        soon("dias-1-30", "Días 1–30: base y primeros pasos", "Tag 1–30: Basis und erste Schritte", "Days 1–30: foundation and first steps"),
        soon("dias-31-60", "Días 31–60: contenido, producto o libro", "Tag 31–60: Content, Produkt oder Buch", "Days 31–60: content, product or book"),
        soon("dias-61-90", "Días 61–90: medir, ajustar y continuar", "Tag 61–90: messen, anpassen, weitermachen", "Days 61–90: measure, adjust and continue"),
      ],
    },
  ],
  faq: [
    {
      q: t("¿Este curso es oficial de Amazon?", "Ist das ein offizieller Amazon-Kurs?", "Is this an official Amazon course?"),
      a: t(
        "No. Es un curso independiente de Academia NexusIA Digital. No estamos afiliados ni patrocinados por Amazon.",
        "Nein. Es ist ein unabhängiger Kurs der Academia NexusIA Digital. Wir sind nicht mit Amazon verbunden oder von Amazon gesponsert.",
        "No. It is an independent course by Academia NexusIA Digital. We are not affiliated with or sponsored by Amazon.",
      ),
    },
    {
      q: t("¿Sirve para cualquier país?", "Gilt das für jedes Land?", "Does it work for any country?"),
      a: t(
        "Los fundamentos sí. Los programas de Amazon tienen condiciones distintas según el marketplace; en cada módulo te indicamos dónde consultar las reglas de tu país.",
        "Die Grundlagen ja. Die Amazon-Programme haben je nach Marktplatz unterschiedliche Bedingungen; in jedem Modul zeigen wir dir, wo du die Regeln für dein Land findest.",
        "The fundamentals do. Amazon's programmes have different terms per marketplace; each module shows you where to check the rules for your country.",
      ),
    },
  ],
};
