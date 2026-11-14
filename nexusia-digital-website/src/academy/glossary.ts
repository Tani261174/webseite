/**
 * Geprüftes Glossar – Wissensbasis für NexusTutor AI.
 * Der Tutor antwortet nur auf Grundlage dieser Einträge und der Kursinhalte.
 */
import { t } from "./types";
import type { L10n } from "@/lib/i18n/config";

export interface GlossaryEntry {
  term: L10n;
  aliases: string[];
  def: L10n;
  /** Passende Lektion: [Kurs-Slug, Lektions-Slug] */
  lesson?: [string, string];
}

export const glossary: GlossaryEntry[] = [
  {
    term: t("Afiliado", "Affiliate", "Affiliate"),
    aliases: ["afiliado", "afiliados", "affiliate", "partnerprogramm", "associates", "enlace de afiliado", "affiliate link", "comision", "provision", "commission"],
    def: t(
      "Una persona que recomienda productos de otra empresa con un enlace personal. Si alguien compra a través de ese enlace, el afiliado recibe una comisión. No necesita producto propio ni stock.",
      "Eine Person, die Produkte eines anderen Unternehmens über einen persönlichen Link empfiehlt. Kauft jemand über diesen Link, erhält der Affiliate eine Provision – ganz ohne eigenes Produkt oder Lager.",
      "Someone who recommends another company's products with a personal link. If someone buys through that link, the affiliate earns a commission – no own product or stock needed.",
    ),
    lesson: ["amazon-business", "modelos-de-negocio"],
  },
  {
    term: t("FBA (Logística de Amazon)", "FBA (Versand durch Amazon)", "FBA (Fulfillment by Amazon)"),
    aliases: ["fba", "fulfillment by amazon", "logistica de amazon", "versand durch amazon"],
    def: t(
      "Modalidad en la que envías tu stock a los almacenes de Amazon y Amazon almacena, envía y gestiona devoluciones de esos pedidos a cambio de tarifas de logística y almacenamiento.",
      "Modell, bei dem du deine Ware an Amazon-Lager schickst. Amazon lagert, versendet und bearbeitet Rücksendungen dieser Bestellungen – gegen Versand- und Lagergebühren.",
      "A model where you send your stock to Amazon's warehouses and Amazon stores, ships and handles returns for those orders in exchange for fulfilment and storage fees.",
    ),
    lesson: ["amazon-business", "modelos-de-negocio"],
  },
  {
    term: t("FBM (envío por el vendedor)", "FBM (Versand durch Verkäufer)", "FBM (Fulfilled by Merchant)"),
    aliases: ["fbm", "fulfilled by merchant", "envio propio", "eigener versand", "merchant fulfilled"],
    def: t(
      "Vendes en Amazon pero tú almacenas y envías los pedidos. Más control y menos tarifas de logística de Amazon, a cambio de más trabajo operativo.",
      "Du verkaufst auf Amazon, lagerst und versendest aber selbst. Mehr Kontrolle und weniger Amazon-Logistikgebühren, dafür mehr eigener Aufwand.",
      "You sell on Amazon but store and ship orders yourself. More control and fewer Amazon fulfilment fees, in exchange for more operational work.",
    ),
    lesson: ["amazon-business", "modelos-de-negocio"],
  },
  {
    term: t("KDP (Kindle Direct Publishing)", "KDP (Kindle Direct Publishing)", "KDP (Kindle Direct Publishing)"),
    aliases: ["kdp", "kindle", "kindle direct publishing", "autopublicacion", "self-publishing", "selfpublishing", "libro", "buch", "ebook", "e-book", "regalias", "tantiemen", "royalties"],
    def: t(
      "La plataforma de autopublicación de Amazon. Puedes publicar e-books y libros impresos sin coste inicial; los impresos se fabrican bajo demanda. Recibes regalías según el formato y el precio.",
      "Die Selfpublishing-Plattform von Amazon. E-Books und gedruckte Bücher lassen sich ohne Startkosten veröffentlichen; Printbücher werden bei Bestellung gedruckt. Du erhältst Tantiemen je nach Format und Preis.",
      "Amazon's self-publishing platform. You can publish e-books and print books with no upfront cost; print books are produced on demand. You earn royalties depending on format and price.",
    ),
    lesson: ["amazon-business", "modelos-de-negocio"],
  },
  {
    term: t("Seller Central", "Seller Central", "Seller Central"),
    aliases: ["seller central", "cuenta de vendedor", "verkauferkonto", "seller account"],
    def: t(
      "El panel donde los vendedores gestionan sus productos, pedidos, inventario, publicidad y pagos en Amazon. Hay distintos planes de venta según el volumen.",
      "Das Verwaltungsportal für Verkäufer:innen auf Amazon: Produkte, Bestellungen, Lager, Werbung und Auszahlungen. Es gibt verschiedene Verkaufstarife je nach Volumen.",
      "The dashboard where sellers manage products, orders, inventory, advertising and payouts on Amazon. There are different selling plans depending on volume.",
    ),
  },
  {
    term: t("Programa de Influencers de Amazon", "Amazon-Influencer-Programm", "Amazon Influencer Program"),
    aliases: ["influencer", "influencers", "storefront", "tienda de influencer"],
    def: t(
      "Extensión del programa de afiliados para creadores con presencia en redes. Si te aceptan, tienes una tienda propia en Amazon con tus recomendaciones. No está disponible en todos los países.",
      "Erweiterung des Partnerprogramms für Creator mit Social-Media-Reichweite. Nach Freischaltung bekommst du eine eigene Shopseite auf Amazon. Nicht in allen Ländern verfügbar.",
      "An extension of the affiliate programme for creators with a social media presence. If accepted, you get your own storefront on Amazon. Not available in every country.",
    ),
  },
  {
    term: t("Dropshipping", "Dropshipping", "Dropshipping"),
    aliases: ["dropshipping", "drop shipping"],
    def: t(
      "Vendes productos que no tienes en stock: cuando llega un pedido, el proveedor lo envía directamente al cliente. Sigues siendo responsable ante el cliente de plazos, calidad y devoluciones.",
      "Du verkaufst Ware, die du nicht auf Lager hast: Bei einer Bestellung versendet der Lieferant direkt an die Kundschaft. Für Lieferzeit, Qualität und Rückgaben bleibst du verantwortlich.",
      "You sell products you don't stock: when an order comes in, the supplier ships directly to the customer. You remain responsible to the customer for delivery times, quality and returns.",
    ),
  },
  {
    term: t("Embudo de ventas", "Verkaufstrichter (Funnel)", "Sales funnel"),
    aliases: ["embudo", "embudos", "funnel", "funnels", "verkaufstrichter", "trichter"],
    def: t(
      "El camino que recorre una persona desde que te descubre hasta que compra: atención, interés, decisión y acción. Sirve para ver en qué etapa se pierden clientes.",
      "Der Weg, den eine Person vom ersten Kontakt bis zum Kauf geht: Aufmerksamkeit, Interesse, Entscheidung, Handlung. Zeigt, an welcher Stelle Interessierte abspringen.",
      "The path a person takes from discovering you to buying: attention, interest, decision and action. It shows at which stage you lose potential customers.",
    ),
  },
  {
    term: t("Lead magnet", "Lead-Magnet", "Lead magnet"),
    aliases: ["lead magnet", "lead-magnet", "leadmagnet", "freebie"],
    def: t(
      "Un recurso gratuito y útil (guía, checklist, plantilla) que ofreces a cambio de que alguien se suscriba voluntariamente a tu lista de email.",
      "Eine kostenlose, nützliche Ressource (Guide, Checkliste, Vorlage), die du anbietest, damit sich jemand freiwillig für deine E-Mail-Liste anmeldet.",
      "A free, useful resource (guide, checklist, template) you offer in exchange for someone voluntarily joining your email list.",
    ),
  },
  {
    term: t("Tasa de conversión", "Conversion-Rate", "Conversion rate"),
    aliases: ["conversion", "conversión", "tasa de conversion", "conversion rate", "conversion-rate", "konversionsrate"],
    def: t(
      "El porcentaje de personas que realizan la acción deseada (comprar, suscribirse) respecto al total de visitas. Ejemplo: 20 compras de 1.000 visitas = 2 %.",
      "Der Anteil der Besucher:innen, die die gewünschte Aktion ausführen (kaufen, abonnieren). Beispiel: 20 Käufe bei 1.000 Besuchen = 2 %.",
      "The share of visitors who take the desired action (buy, subscribe). Example: 20 purchases from 1,000 visits = 2%.",
    ),
  },
  {
    term: t("Margen", "Marge", "Margin"),
    aliases: ["margen", "marge", "margin", "beneficio", "gewinn", "profit", "rentabilidad"],
    def: t(
      "Lo que te queda de cada venta después de restar todos los costes: producto, tarifas de la plataforma, envío, publicidad e impuestos. Sin conocer tu margen no puedes saber si un negocio es rentable.",
      "Was dir von jedem Verkauf bleibt, nachdem alle Kosten abgezogen sind: Ware, Plattformgebühren, Versand, Werbung und Steuern. Ohne Marge weißt du nicht, ob sich ein Geschäft lohnt.",
      "What you keep from each sale after subtracting all costs: product, platform fees, shipping, advertising and taxes. Without knowing your margin you can't tell if a business is profitable.",
    ),
  },
  {
    term: t("ROI (retorno de la inversión)", "ROI (Kapitalrendite)", "ROI (return on investment)"),
    aliases: ["roi", "retorno", "return on investment", "rendite"],
    def: t(
      "Mide cuánto ganas en relación con lo que inviertes: (beneficio − inversión) ÷ inversión. Un ROI del 50 % significa que recuperas la inversión y ganas la mitad de lo invertido.",
      "Misst den Gewinn im Verhältnis zum Einsatz: (Ertrag − Investition) ÷ Investition. 50 % ROI heißt: Einsatz zurück plus die Hälfte des Einsatzes als Gewinn.",
      "Measures what you earn relative to what you invest: (return − investment) ÷ investment. A 50% ROI means you get your investment back plus half of it as profit.",
    ),
  },
  {
    term: t("Nicho", "Nische", "Niche"),
    aliases: ["nicho", "nische", "niche"],
    def: t(
      "Un segmento concreto de personas con necesidades parecidas (por ejemplo «cocina saludable para familias con poco tiempo»). Un nicho claro facilita crear contenido y productos relevantes.",
      "Ein klar umrissenes Publikum mit ähnlichen Bedürfnissen (z. B. „gesunde Küche für Familien mit wenig Zeit“). Eine klare Nische macht passende Inhalte und Produkte leichter.",
      "A specific group of people with similar needs (e.g. 'healthy cooking for busy families'). A clear niche makes relevant content and products easier.",
    ),
  },
  {
    term: t("SEO", "SEO", "SEO"),
    aliases: ["seo", "posicionamiento", "suchmaschinenoptimierung", "palabras clave", "keywords", "keyword"],
    def: t(
      "Optimización para buscadores: preparar títulos, textos y estructura para que tu contenido o producto aparezca cuando la gente busca algo relacionado, en Google, YouTube, Etsy o Amazon.",
      "Suchmaschinenoptimierung: Titel, Texte und Struktur so gestalten, dass deine Inhalte oder Produkte bei passenden Suchen erscheinen – in Google, YouTube, Etsy oder Amazon.",
      "Search engine optimisation: shaping titles, copy and structure so your content or product shows up when people search for something related – on Google, YouTube, Etsy or Amazon.",
    ),
  },
  {
    term: t("PPC / Publicidad de pago", "PPC / bezahlte Werbung", "PPC / paid advertising"),
    aliases: ["ppc", "ads", "anuncios", "publicidad", "werbung", "sponsored", "advertising"],
    def: t(
      "Anuncios por los que pagas cada vez que alguien hace clic (pago por clic). Útiles para acelerar, pero conviene empezar con presupuestos pequeños y medir antes de aumentar.",
      "Anzeigen, bei denen du pro Klick bezahlst (Pay-per-Click). Gut zum Beschleunigen – starte aber mit kleinem Budget und miss, bevor du erhöhst.",
      "Ads where you pay each time someone clicks (pay-per-click). Useful to accelerate, but start with small budgets and measure before scaling up.",
    ),
  },
  {
    term: t("Social commerce", "Social Commerce", "Social commerce"),
    aliases: ["social commerce", "tiktok shop", "live shopping", "directo de venta"],
    def: t(
      "Comprar y vender directamente dentro de redes sociales, por ejemplo con TikTok Shop o tiendas en Instagram, a través de vídeos, directos y escaparates.",
      "Kaufen und Verkaufen direkt in sozialen Netzwerken, etwa über TikTok Shop oder Instagram-Shops – per Video, Livestream und Schaufenster.",
      "Buying and selling directly inside social networks, for example via TikTok Shop or Instagram shops – through videos, live streams and showcases.",
    ),
  },
  {
    term: t("Divulgación publicitaria", "Werbekennzeichnung", "Ad disclosure"),
    aliases: ["divulgacion", "transparencia", "publicidad encubierta", "kennzeichnung", "werbekennzeichnung", "disclosure", "anzeige"],
    def: t(
      "Indicar de forma clara cuándo un contenido es publicidad o contiene enlaces de afiliado. Es obligatorio en muchos países y lo exigen las propias plataformas y programas.",
      "Klar zeigen, wenn ein Inhalt Werbung ist oder Affiliate-Links enthält. In vielen Ländern Pflicht – und von Plattformen und Programmen selbst vorgeschrieben.",
      "Clearly stating when content is advertising or contains affiliate links. Mandatory in many countries and required by the platforms and programmes themselves.",
    ),
    lesson: ["amazon-business", "modelos-de-negocio"],
  },
  {
    term: t("Producto digital", "Digitales Produkt", "Digital product"),
    aliases: ["producto digital", "productos digitales", "digitales produkt", "digital product", "infoproducto", "plantilla", "vorlage", "template"],
    def: t(
      "Un producto que se entrega como archivo o acceso online: e-books, cursos, plantillas, imprimibles. Se crea una vez y se puede vender muchas veces, aunque requiere marketing y soporte.",
      "Ein Produkt, das als Datei oder Online-Zugang geliefert wird: E-Books, Kurse, Vorlagen, Printables. Einmal erstellt, vielfach verkaufbar – braucht aber Marketing und Support.",
      "A product delivered as a file or online access: e-books, courses, templates, printables. Created once and sold many times, though it still needs marketing and support.",
    ),
  },
];
