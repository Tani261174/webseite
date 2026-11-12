/**
 * RECHTSTEXTE – VORLAGEN
 * ------------------------------------------------------------------
 * ⚠ Rechtliche Prüfung erforderlich. Diese Texte sind Gerüste und ersetzen
 * keine Rechtsberatung. Platzhalter stehen in {{doppelten geschweiften Klammern}}
 * und werden auf der Website gold hervorgehoben, bis sie ersetzt sind.
 * Es wurden bewusst KEINE Firmen- oder Registerdaten erfunden.
 */
import type { L10n } from "@/lib/i18n/config";

export type LegalSlug = "imprint" | "privacy" | "terms" | "withdrawal";
export interface LegalSection { title: string; body: (string | string[])[] }
export interface LegalDoc { title: string; description: string; updated: string; sections: LegalSection[] }

export const legalDocs: Record<LegalSlug, L10n<LegalDoc>> = {
  imprint: {
    de: {
      title: "Impressum",
      description: "Impressum von NexusIA Digital – Angaben gemäß § 5 DDG.",
      updated: "{{Datum}}",
      sections: [
        { title: "Angaben gemäß § 5 DDG", body: ["{{Vollständiger Name bzw. Firmenname inkl. Rechtsform}}", "{{Straße und Hausnummer}}", "{{PLZ und Ort}}", "{{Land}}"] },
        { title: "Kontakt", body: ["E-Mail: {{E-Mail-Adresse}}", "Telefon: {{Telefonnummer (optional, aber empfohlen)}}"] },
        { title: "Vertretung & Register", body: ["Vertreten durch: {{Name der vertretungsberechtigten Person}}", "Registergericht / Registernummer: {{falls vorhanden}}"] },
        { title: "Umsatzsteuer", body: ["Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: {{USt-IdNr. oder Hinweis auf Kleinunternehmerregelung}}"] },
        { title: "Verantwortlich für den Inhalt", body: ["{{Name, Anschrift – gemäß § 18 Abs. 2 MStV}}"] },
        { title: "EU-Streitschlichtung & Verbraucherschlichtung", body: ["{{Hinweis zur Teilnahme an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle – bitte aktuell rechtlich prüfen lassen}}"] },
      ],
    },
    es: {
      title: "Aviso legal",
      description: "Aviso legal de NexusIA Digital.",
      updated: "{{Fecha}}",
      sections: [
        { title: "Datos del titular", body: ["{{Nombre completo o razón social, forma jurídica}}", "{{Calle y número}}", "{{Código postal y ciudad}}", "{{País}}"] },
        { title: "Contacto", body: ["Correo electrónico: {{Dirección de correo}}", "Teléfono: {{Número de teléfono}}"] },
        { title: "Representación y registro", body: ["Representado por: {{Nombre del representante}}", "Registro / número: {{si procede}}"] },
        { title: "IVA", body: ["Número de IVA: {{NIF-IVA o indicación de régimen de pequeña empresa}}"] },
        { title: "Responsable del contenido", body: ["{{Nombre y dirección}}"] },
        { title: "Resolución de litigios", body: ["{{Indicación sobre la participación en procedimientos de resolución de conflictos – revisar jurídicamente}}"] },
      ],
    },
    en: {
      title: "Legal notice",
      description: "Legal notice (Impressum) of NexusIA Digital.",
      updated: "{{Date}}",
      sections: [
        { title: "Information pursuant to § 5 DDG", body: ["{{Full name or company name incl. legal form}}", "{{Street and number}}", "{{Postcode and city}}", "{{Country}}"] },
        { title: "Contact", body: ["Email: {{Email address}}", "Phone: {{Phone number}}"] },
        { title: "Representation & register", body: ["Represented by: {{Name of authorised representative}}", "Register court / number: {{if applicable}}"] },
        { title: "VAT", body: ["VAT ID pursuant to § 27a UStG: {{VAT ID or small business notice}}"] },
        { title: "Responsible for content", body: ["{{Name, address}}"] },
        { title: "Dispute resolution", body: ["{{Statement on participation in consumer dispute resolution – legal review required}}"] },
      ],
    },
  },
  privacy: {
    de: {
      title: "Datenschutzerklärung",
      description: "Informationen zum Umgang mit personenbezogenen Daten bei NexusIA Digital.",
      updated: "{{Datum}}",
      sections: [
        { title: "1. Verantwortliche Stelle", body: ["{{Name und Anschrift der verantwortlichen Stelle, E-Mail}}"] },
        { title: "2. Hosting", body: ["Diese Website wird über {{Hosting-Anbieter, z. B. Cloudflare, Inc.}} bereitgestellt. Beim Aufruf werden technisch notwendige Daten (z. B. IP-Adresse, Zeitpunkt, aufgerufene Seite) verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. {{Angaben zu Auftragsverarbeitung und Drittlandübermittlung ergänzen}}"] },
        { title: "3. Schriftarten", body: ["Alle Schriftarten werden lokal von unserem Server ausgeliefert. Es findet keine Verbindung zu Google Fonts oder anderen Schrift-Anbietern statt."] },
        { title: "4. Cookies und lokaler Speicher", body: ["Wir verwenden nur technisch notwendige Speicher:", ["Cookie „NEXT_LOCALE“ – speichert deine Sprachwahl (1 Jahr)", "Lokaler Speicher „nexusia-cart-v1“ – Inhalt deines Warenkorbs, verlässt deinen Browser nicht"], "Es werden keine Analyse- oder Marketing-Cookies eingesetzt."] },
        { title: "5. Kontaktformular", body: ["Angaben aus dem Kontaktformular werden ausschließlich zur Bearbeitung deiner Anfrage verwendet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b bzw. f DSGVO. {{Speicherdauer und eingesetzten E-Mail-Dienst ergänzen}}"] },
        { title: "6. Newsletter", body: ["Für den Newsletter ist ein Double-Opt-in-Verfahren vorgesehen. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO. Du kannst deine Einwilligung jederzeit widerrufen. {{Newsletter-Anbieter ergänzen}}"] },
        { title: "7. Zahlungsabwicklung", body: ["Zahlungen werden künftig über PayPal (Europe) S.à r.l. et Cie, S.C.A. abgewickelt. Dabei werden die zur Zahlung notwendigen Daten an PayPal übermittelt. {{Abschnitt vor Aktivierung prüfen}}"] },
        { title: "8. Deine Rechte", body: ["Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht auf Beschwerde bei einer Aufsichtsbehörde."] },
      ],
    },
    es: {
      title: "Política de privacidad",
      description: "Información sobre el tratamiento de datos personales en NexusIA Digital.",
      updated: "{{Fecha}}",
      sections: [
        { title: "1. Responsable", body: ["{{Nombre y dirección del responsable, correo electrónico}}"] },
        { title: "2. Alojamiento", body: ["Este sitio web se ofrece a través de {{proveedor de alojamiento, p. ej. Cloudflare, Inc.}}. Al visitarlo se tratan datos técnicamente necesarios (p. ej. dirección IP, hora, página visitada). Base jurídica: art. 6.1.f RGPD. {{Completar encargo de tratamiento y transferencias internacionales}}"] },
        { title: "3. Tipografías", body: ["Todas las tipografías se sirven localmente desde nuestro servidor. No hay conexión con Google Fonts ni con otros proveedores."] },
        { title: "4. Cookies y almacenamiento local", body: ["Solo usamos almacenamiento técnicamente necesario:", ["Cookie «NEXT_LOCALE»: guarda tu idioma (1 año)", "Almacenamiento local «nexusia-cart-v1»: contenido de tu carrito, no sale de tu navegador"], "No se utilizan cookies de analítica ni de marketing."] },
        { title: "5. Formulario de contacto", body: ["Los datos del formulario se usan exclusivamente para tramitar tu consulta. Base jurídica: art. 6.1.b o f RGPD. {{Completar plazo de conservación y servicio de correo}}"] },
        { title: "6. Newsletter", body: ["Para la newsletter está previsto un procedimiento de doble confirmación. Base jurídica: art. 6.1.a RGPD. Puedes retirar tu consentimiento en cualquier momento. {{Completar proveedor}}"] },
        { title: "7. Pagos", body: ["En el futuro los pagos se procesarán a través de PayPal (Europe) S.à r.l. et Cie, S.C.A., a quien se transmitirán los datos necesarios. {{Revisar antes de activar}}"] },
        { title: "8. Tus derechos", body: ["Tienes derecho de acceso, rectificación, supresión, limitación, portabilidad y oposición, así como a presentar una reclamación ante una autoridad de control."] },
      ],
    },
    en: {
      title: "Privacy policy",
      description: "Information on how NexusIA Digital processes personal data.",
      updated: "{{Date}}",
      sections: [
        { title: "1. Controller", body: ["{{Name and address of the controller, email}}"] },
        { title: "2. Hosting", body: ["This website is provided via {{hosting provider, e.g. Cloudflare, Inc.}}. When you visit, technically necessary data (e.g. IP address, time, page requested) is processed. Legal basis: Art. 6(1)(f) GDPR. {{Add data processing agreement and third-country transfer details}}"] },
        { title: "3. Fonts", body: ["All fonts are served locally from our server. No connection is made to Google Fonts or other font providers."] },
        { title: "4. Cookies and local storage", body: ["We only use technically necessary storage:", ["Cookie “NEXT_LOCALE” – stores your language choice (1 year)", "Local storage “nexusia-cart-v1” – your cart contents, never leaves your browser"], "No analytics or marketing cookies are used."] },
        { title: "5. Contact form", body: ["Details from the contact form are used solely to handle your enquiry. Legal basis: Art. 6(1)(b) or (f) GDPR. {{Add retention period and email service}}"] },
        { title: "6. Newsletter", body: ["A double opt-in process is planned for the newsletter. Legal basis: Art. 6(1)(a) GDPR. You can withdraw your consent at any time. {{Add newsletter provider}}"] },
        { title: "7. Payment processing", body: ["Payments will be processed via PayPal (Europe) S.à r.l. et Cie, S.C.A., to whom the data required for payment is transmitted. {{Review before activation}}"] },
        { title: "8. Your rights", body: ["You have the right to access, rectification, erasure, restriction of processing, data portability and objection, as well as the right to lodge a complaint with a supervisory authority."] },
      ],
    },
  },
  terms: {
    de: {
      title: "Allgemeine Geschäftsbedingungen",
      description: "AGB für den Kauf digitaler Produkte bei NexusIA Digital.",
      updated: "{{Datum}}",
      sections: [
        { title: "§ 1 Geltungsbereich", body: ["Diese AGB gelten für alle Bestellungen digitaler Produkte über diese Website zwischen {{Anbieter}} und Kund:innen. {{Prüfen: Verbraucher und Unternehmer}}"] },
        { title: "§ 2 Vertragsschluss", body: ["{{Beschreibung des Bestellablaufs und des Zeitpunkts des Vertragsschlusses}}"] },
        { title: "§ 3 Preise und Zahlung", body: ["Alle Preise in Euro. {{Hinweis zur Umsatzsteuer}}. Zahlung über {{Zahlungsanbieter}}."] },
        { title: "§ 4 Lieferung digitaler Inhalte", body: ["Digitale Produkte werden per Download-Link bereitgestellt. {{Dauer der Verfügbarkeit, Anzahl der Downloads}}"] },
        { title: "§ 5 Nutzungsrechte / Lizenz", body: ["{{Umfang der Nutzungsrechte je Produktart, z. B. private/kommerzielle Nutzung}}"] },
        { title: "§ 6 Widerrufsrecht", body: ["Verbraucher:innen steht ein Widerrufsrecht nach Maßgabe der Widerrufsbelehrung zu."] },
        { title: "§ 7 Haftung, Schlussbestimmungen", body: ["{{Haftungsregelungen, anwendbares Recht, Gerichtsstand – rechtlich prüfen}}"] },
      ],
    },
    es: {
      title: "Condiciones generales",
      description: "Condiciones generales para la compra de productos digitales en NexusIA Digital.",
      updated: "{{Fecha}}",
      sections: [
        { title: "§ 1 Ámbito de aplicación", body: ["Estas condiciones se aplican a todos los pedidos de productos digitales realizados en este sitio entre {{proveedor}} y los clientes."] },
        { title: "§ 2 Celebración del contrato", body: ["{{Descripción del proceso de pedido y del momento de celebración del contrato}}"] },
        { title: "§ 3 Precios y pago", body: ["Todos los precios en euros. {{Indicación sobre el IVA}}. Pago a través de {{proveedor de pago}}."] },
        { title: "§ 4 Entrega de contenidos digitales", body: ["Los productos digitales se entregan mediante enlace de descarga. {{Duración de la disponibilidad, número de descargas}}"] },
        { title: "§ 5 Derechos de uso / licencia", body: ["{{Alcance de los derechos de uso por tipo de producto}}"] },
        { title: "§ 6 Derecho de desistimiento", body: ["Los consumidores disponen de un derecho de desistimiento conforme a la política de desistimiento."] },
        { title: "§ 7 Responsabilidad, disposiciones finales", body: ["{{Responsabilidad, ley aplicable, jurisdicción – revisión jurídica}}"] },
      ],
    },
    en: {
      title: "Terms & Conditions",
      description: "Terms and conditions for purchasing digital products at NexusIA Digital.",
      updated: "{{Date}}",
      sections: [
        { title: "§ 1 Scope", body: ["These terms apply to all orders of digital products via this website between {{provider}} and customers."] },
        { title: "§ 2 Conclusion of contract", body: ["{{Description of the ordering process and when the contract is concluded}}"] },
        { title: "§ 3 Prices and payment", body: ["All prices in euros. {{VAT notice}}. Payment via {{payment provider}}."] },
        { title: "§ 4 Delivery of digital content", body: ["Digital products are provided via download link. {{Availability period, number of downloads}}"] },
        { title: "§ 5 Rights of use / licence", body: ["{{Scope of usage rights per product type}}"] },
        { title: "§ 6 Right of withdrawal", body: ["Consumers have a right of withdrawal as set out in the withdrawal policy."] },
        { title: "§ 7 Liability, final provisions", body: ["{{Liability, applicable law, place of jurisdiction – legal review}}"] },
      ],
    },
  },
  withdrawal: {
    de: {
      title: "Widerrufsbelehrung",
      description: "Widerrufsbelehrung für digitale Inhalte bei NexusIA Digital.",
      updated: "{{Datum}}",
      sections: [
        { title: "Widerrufsrecht", body: ["{{Gesetzliche Muster-Widerrufsbelehrung einfügen und an digitale Inhalte anpassen}}"] },
        { title: "Vorzeitiges Erlöschen bei digitalen Inhalten", body: ["{{Hinweis zum Erlöschen des Widerrufsrechts bei digitalen Inhalten (§ 356 Abs. 5 BGB) inkl. erforderlicher Zustimmung und Bestätigung im Checkout – rechtlich prüfen}}"] },
        { title: "Muster-Widerrufsformular", body: ["{{Muster-Widerrufsformular einfügen}}"] },
      ],
    },
    es: {
      title: "Derecho de desistimiento",
      description: "Información sobre el derecho de desistimiento para contenidos digitales.",
      updated: "{{Fecha}}",
      sections: [
        { title: "Derecho de desistimiento", body: ["{{Insertar el modelo legal de información sobre el desistimiento, adaptado a contenidos digitales}}"] },
        { title: "Extinción anticipada en contenidos digitales", body: ["{{Indicación sobre la pérdida del derecho de desistimiento en contenidos digitales – revisión jurídica}}"] },
        { title: "Modelo de formulario de desistimiento", body: ["{{Insertar formulario}}"] },
      ],
    },
    en: {
      title: "Right of withdrawal",
      description: "Withdrawal policy for digital content at NexusIA Digital.",
      updated: "{{Date}}",
      sections: [
        { title: "Right of withdrawal", body: ["{{Insert statutory model withdrawal notice, adapted to digital content}}"] },
        { title: "Early expiry for digital content", body: ["{{Notice on expiry of the right of withdrawal for digital content incl. required consent in checkout – legal review}}"] },
        { title: "Model withdrawal form", body: ["{{Insert model withdrawal form}}"] },
      ],
    },
  },
};
