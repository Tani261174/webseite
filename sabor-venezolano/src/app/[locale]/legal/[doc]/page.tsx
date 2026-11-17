import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pick, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { alternates, resolveLocale } from "@/lib/server/page";
import { getSettings, listProducts } from "@/lib/server/repo";
import { REQUIRED_COMPANY_FIELDS, type Settings } from "@/lib/settings";
import { SimpleText } from "@/components/legal/SimpleText";
import { Ornament } from "@/components/brand/Brand";
import { Icon } from "@/components/ui/Icon";

const DOCS = ["impressum", "privacidad", "alimentos", "condiciones", "recogida"] as const;
type Doc = (typeof DOCS)[number];
type Params = Promise<{ locale: string; doc: string }>;

function title(doc: Doc, t: Messages) {
  return { impressum: t.legal.impressum, privacidad: t.legal.privacy, alimentos: t.legal.food, condiciones: t.legal.terms, recogida: t.legal.pickup }[doc];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  const { doc } = await params;
  if (!(DOCS as readonly string[]).includes(doc)) return {};
  return { title: title(doc as Doc, t), alternates: alternates(locale, `/legal/${doc}`), robots: { index: false } };
}

export default async function LegalPage({ params }: { params: Params }) {
  const { locale, t } = await resolveLocale(params);
  const { doc } = await params;
  if (!(DOCS as readonly string[]).includes(doc)) notFound();
  const s = getSettings();
  const d = doc as Doc;

  return (
    <div className="bg-soft px-4 pb-24 pt-12 sm:px-6">
      <article className="card mx-auto max-w-3xl p-6 sm:p-10">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">{title(d, t)}</h1>
        <Ornament className="mt-4 justify-start" />
        <p className="mt-6 flex items-start gap-2 rounded-2xl border border-rose bg-sage/60 p-4 text-sm font-semibold text-ink">
          <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
          {t.legal.draft}
        </p>
        <div className="prose-legal mt-6">
          {d === "impressum" ? <Impressum s={s} t={t} /> : null}
          {d === "privacidad" ? <Privacy s={s} t={t} locale={locale} /> : null}
          {d === "alimentos" ? <Food s={s} t={t} locale={locale} /> : null}
          {d === "condiciones" ? <Editable text={pick(s.legal.terms, locale)} t={t} /> : null}
          {d === "recogida" ? <Editable text={pick(s.legal.pickup, locale)} t={t} /> : null}
        </div>
      </article>
    </div>
  );
}

function Missing({ t, label }: { t: Messages; label: string }) {
  return (
    <span className="rounded bg-danger/10 px-1.5 py-0.5 font-semibold text-danger">
      [{t.legal.missing}: {label}]
    </span>
  );
}

function Editable({ text, t }: { text: string; t: Messages }) {
  return text ? <SimpleText text={text} /> : <p><Missing t={t} label="Text" /></p>;
}

const LABELS: Record<keyof Settings["company"], string> = {
  businessName: "Name des Unternehmens",
  legalForm: "Rechtsform",
  ownerNames: "Inhaberin(nen) / Vertretungsberechtigte",
  street: "Straße und Hausnummer",
  zipCity: "PLZ und Ort",
  country: "Land",
  email: "E-Mail",
  phone: "Telefon",
  vatId: "USt-IdNr.",
  register: "Handelsregister",
  foodRegistration: "Registrierung Lebensmittelüberwachung",
  contentResponsible: "Verantwortlich für den Inhalt",
};

function Impressum({ s, t }: { s: Settings; t: Messages }) {
  const c = s.company;
  const v = (k: keyof Settings["company"]) =>
    c[k] ? <span>{c[k]}</span> : REQUIRED_COMPANY_FIELDS.includes(k) ? <Missing t={t} label={LABELS[k]} /> : null;
  return (
    <>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        {v("businessName")} {c.legalForm ? `(${c.legalForm})` : null}
        <br />
        {v("ownerNames")}
        <br />
        {v("street")}
        <br />
        {v("zipCity")}
        <br />
        {v("country")}
      </p>
      <h2>Kontakt</h2>
      <p>
        Telefon: {v("phone")}
        <br />
        WhatsApp: {s.shop.whatsappDisplay}
        <br />
        E-Mail: {v("email")}
      </p>
      {c.vatId ? (
        <>
          <h2>Umsatzsteuer-ID</h2>
          <p>{c.vatId}</p>
        </>
      ) : null}
      {c.register ? (
        <>
          <h2>Registereintrag</h2>
          <p>{c.register}</p>
        </>
      ) : null}
      {c.foodRegistration ? (
        <>
          <h2>Lebensmittelrechtliche Registrierung</h2>
          <p>{c.foodRegistration}</p>
        </>
      ) : null}
      {c.contentResponsible ? (
        <>
          <h2>Verantwortlich für den Inhalt</h2>
          <p>{c.contentResponsible}</p>
        </>
      ) : null}
    </>
  );
}

function Privacy({ s, t, locale }: { s: Settings; t: Messages; locale: Locale }) {
  const c = s.company;
  const extra = pick(s.legal.privacyExtra, locale);
  return (
    <>
      {locale === "es" ? <p><em>{t.legal.legalNoteDe}</em></p> : null}
      <h2>1. Verantwortliche Stelle</h2>
      <p>
        {c.businessName || <Missing t={t} label={LABELS.businessName} />}, {c.ownerNames || <Missing t={t} label={LABELS.ownerNames} />},{" "}
        {c.street || <Missing t={t} label={LABELS.street} />}, {c.zipCity || <Missing t={t} label={LABELS.zipCity} />}. E-Mail:{" "}
        {c.email || <Missing t={t} label={LABELS.email} />}
      </p>
      <h2>2. Welche Daten diese Website verarbeitet</h2>
      <h3>Bestellanfragen</h3>
      <p>
        Wenn du über den Warenkorb eine Bestellung anfragst, speichern wir Name, optional Telefonnummer, Wunschtermin, Anmerkungen
        und die gewählten Produkte, um deine Bestellung zu bearbeiten (Art. 6 Abs. 1 lit. b DSGVO).
      </p>
      <h3>Kontaktformular</h3>
      <p>
        Bei Nachrichten über das Kontaktformular speichern wir Name, E-Mail-Adresse oder Telefonnummer und deine Nachricht, um dir zu
        antworten (Art. 6 Abs. 1 lit. b bzw. f DSGVO).
      </p>
      <h3>Spam- und Missbrauchsschutz</h3>
      <p>
        Zum Schutz vor Missbrauch wird aus deiner IP-Adresse ein nicht rückrechenbarer Kurzwert gebildet und höchstens 24 Stunden
        gespeichert. Die IP-Adresse selbst wird von der Anwendung nicht gespeichert.
      </p>
      <h3>WhatsApp</h3>
      <p>
        Beim Absenden öffnet sich WhatsApp (WhatsApp Ireland Ltd. / Meta). Erst wenn du die Nachricht dort selbst abschickst, werden
        die Daten an WhatsApp übertragen. Es gelten die Datenschutzbestimmungen von WhatsApp. Auf dieser Website sind keine
        WhatsApp-Skripte eingebunden.
      </p>
      <h3>Speicherung im Browser</h3>
      <p>
        Dein Warenkorb wird nur lokal in deinem Browser (localStorage) gespeichert. Ein technisch notwendiges Cookie merkt sich die
        gewählte Sprache. Es werden keine Analyse- oder Werbe-Cookies verwendet. Schriften werden von unserem eigenen Server geladen.
      </p>
      <h3>Server-Logdateien</h3>
      <p>
        <Missing t={t} label="Angaben zum Hoster und zu Server-Logs (abhängig vom gewählten Hosting)" />
      </p>
      <h2>3. Speicherdauer</h2>
      <p>
        <Missing t={t} label="Löschfristen für Bestellungen und Anfragen festlegen" />
      </p>
      <h2>4. Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch
        sowie das Recht auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde.
      </p>
      {extra ? <SimpleText text={extra} /> : null}
    </>
  );
}

function Food({ s, t, locale }: { s: Settings; t: Messages; locale: Locale }) {
  const text = pick(s.legal.food, locale);
  const products = listProducts();
  return (
    <>
      {text ? <SimpleText text={text} /> : <p><Missing t={t} label="Allgemeine Lebensmittelinformationen (Haltbarkeit, Lagerung, Kennzeichnung)" /></p>}
      <h2>{t.product.allergens}</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <strong>{pick(p.name, locale)}:</strong>{" "}
            {p.allergensConfirmed
              ? p.allergens.length
                ? p.allergens.map((a) => t.allergens[a]).join(", ")
                : t.product.noAllergens
              : <Missing t={t} label={t.product.allergens} />}
          </li>
        ))}
      </ul>
    </>
  );
}
