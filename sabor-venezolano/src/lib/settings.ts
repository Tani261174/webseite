import type { Bi } from "./i18n/config";

/**
 * Alle im Adminbereich einstellbaren Werte.
 * Fehlende Felder in der Datenbank werden mit diesen Standardwerten ergänzt.
 */
export type Cook = {
  name: string;
  role: Bi;
  text: Bi;
  specialties: Bi;
  image: string | null;
};

export type Settings = {
  shop: {
    whatsappNumber: string; // nur Ziffern, internationales Format ohne +
    whatsappDisplay: string;
  };
  ordering: {
    accepting: boolean;
    minLeadDays: number;
    maxAdvanceDays: number;
    closedWeekdays: number[]; // 0 = Sonntag … 6 = Samstag
    blockedDates: { date: string; note: string }[];
  };
  christmas: {
    enabled: boolean;
    orderDeadline: string; // YYYY-MM-DD, leer = keiner
    periodStart: string;
    periodEnd: string;
    text: Bi;
    image: string | null;
  };
  content: {
    heroImage: string | null; // großes Foto der beiden Köchinnen
    heroTitle: Bi;
    heroSubtitle: Bi;
    heroCta: Bi;
    welcomeTitle: Bi;
    welcomeText: Bi;
    announcementEnabled: boolean;
    announcement: Bi;
    cooks: [Cook, Cook];
  };
  company: {
    businessName: string;
    legalForm: string;
    ownerNames: string;
    street: string;
    zipCity: string;
    country: string;
    email: string;
    phone: string;
    vatId: string;
    register: string;
    foodRegistration: string;
    contentResponsible: string;
  };
  legal: {
    privacyExtra: Bi;
    terms: Bi;
    food: Bi;
    pickup: Bi;
  };
};

/** Pflichtfelder für das Impressum – fehlen sie, zeigt die Website einen deutlichen Hinweis. */
export const REQUIRED_COMPANY_FIELDS: (keyof Settings["company"])[] = [
  "businessName",
  "ownerNames",
  "street",
  "zipCity",
  "country",
  "email",
  "phone",
];

const bi = (es: string, de: string): Bi => ({ es, de });

export const defaultSettings: Settings = {
  shop: {
    whatsappNumber: "49151122131076",
    whatsappDisplay: "+49 151 122131076",
  },
  ordering: {
    accepting: true,
    minLeadDays: 2,
    maxAdvanceDays: 60,
    closedWeekdays: [],
    blockedDates: [],
  },
  christmas: {
    enabled: true,
    orderDeadline: "",
    periodStart: "",
    periodEnd: "",
    text: bi(
      "Hallacas, pan de jamón y dulces caseros como los de casa en diciembre. Reserva a tiempo: preparamos cada pedido a mano y las cantidades son limitadas.",
      "Hallacas, Pan de Jamón und hausgemachte Süßspeisen – wie zu Hause im Dezember. Bitte rechtzeitig reservieren: Wir bereiten jede Bestellung von Hand zu, die Mengen sind begrenzt.",
    ),
    image: null,
  },
  content: {
    heroImage: null,
    heroTitle: bi("¡El auténtico sabor de Venezuela, hecho con amor!", "Der echte Geschmack Venezuelas – mit Liebe gemacht!"),
    heroSubtitle: bi(
      "Disfruta nuestras especialidades tradicionales, preparadas con cariño para llevar un pedacito de nuestra tierra hasta tu mesa.",
      "Genieß unsere traditionellen Spezialitäten – mit viel Hingabe zubereitet, damit ein Stück unserer Heimat auf deinen Tisch kommt.",
    ),
    heroCta: bi("¡Haz tu pedido!", "Jetzt bestellen!"),
    welcomeTitle: bi("Un pedacito de Venezuela en tu mesa", "Ein Stück Venezuela auf deinem Tisch"),
    welcomeText: bi(
      "Lo que cocinamos viene de nuestras familias: recetas que aprendimos mirando a nuestras madres y abuelas, con el mismo cuidado de siempre. Cada hallaca se envuelve a mano, cada empanada se fríe al momento y cada quesillo sale de nuestra cocina como si fuera para nuestra propia mesa.",
      "Was wir kochen, kommt aus unseren Familien: Rezepte, die wir unseren Müttern und Großmüttern abgeschaut haben – mit derselben Sorgfalt wie damals. Jede Hallaca wird von Hand gewickelt, jede Empanada frisch zubereitet und jeder Quesillo verlässt unsere Küche so, als wäre er für unseren eigenen Tisch.",
    ),
    announcementEnabled: false,
    announcement: bi("", ""),
    cooks: [
      {
        name: "Nombre 1 (editar en el panel)",
        role: bi("Cocinera y cofundadora", "Köchin und Mitgründerin"),
        text: bi(
          "Texto de presentación pendiente. Edítalo en el panel de administración.",
          "Vorstellungstext folgt. Im Adminbereich bearbeiten.",
        ),
        specialties: bi("Hallacas · Pan de jamón", "Hallacas · Pan de Jamón"),
        image: null,
      },
      {
        name: "Nombre 2 (editar en el panel)",
        role: bi("Cocinera y cofundadora", "Köchin und Mitgründerin"),
        text: bi(
          "Texto de presentación pendiente. Edítalo en el panel de administración.",
          "Vorstellungstext folgt. Im Adminbereich bearbeiten.",
        ),
        specialties: bi("Empanadas · Quesillo · Torta de pan", "Empanadas · Quesillo · Torta de Pan"),
        image: null,
      },
    ],
  },
  company: {
    businessName: "",
    legalForm: "",
    ownerNames: "",
    street: "",
    zipCity: "",
    country: "Deutschland",
    email: "",
    phone: "",
    vatId: "",
    register: "",
    foodRegistration: "",
    contentResponsible: "",
  },
  legal: {
    privacyExtra: bi("", ""),
    terms: bi("", ""),
    food: bi("", ""),
    pickup: bi("", ""),
  },
};

/** Tiefe Zusammenführung: gespeicherte Werte überschreiben Standardwerte, unbekannte Felder werden ignoriert. */
export function mergeSettings<T>(defaults: T, stored: unknown): T {
  if (Array.isArray(defaults)) {
    if (!Array.isArray(stored)) return defaults;
    // Tupel/Listen von Objekten elementweise zusammenführen
    if (defaults.length && typeof defaults[0] === "object" && defaults[0] !== null) {
      return defaults.map((d, i) => mergeSettings(d, stored[i])) as T;
    }
    return stored as T;
  }
  if (defaults && typeof defaults === "object") {
    if (!stored || typeof stored !== "object") return defaults;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(defaults)) {
      out[k] = mergeSettings(v, (stored as Record<string, unknown>)[k]);
    }
    return out as T;
  }
  if (defaults === null) return (stored === undefined ? null : stored) as T;
  if (stored === undefined || stored === null) return defaults;
  if (typeof stored !== typeof defaults) return defaults;
  return stored as T;
}
