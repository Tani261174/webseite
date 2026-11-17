/**
 * Zahlungsarten – Architektur für spätere Online-Zahlung.
 *
 * Aktuell ist NUR "manual" aktiv: Die Bestellung wird per WhatsApp angefragt und
 * manuell bestätigt. Es wird keine Zahlung simuliert oder als erfolgreich angezeigt.
 *
 * Für PayPal / Kreditkarte später:
 *  1. Schlüssel nur serverseitig als Umgebungsvariablen (siehe .env.example)
 *  2. Route src/app/api/checkout/<provider>/route.ts: Zahlung für eine bestehende
 *     Bestellnummer anlegen (Betrag immer aus der Datenbank, nie aus dem Browser)
 *  3. Webhook des Anbieters prüft die Signatur und setzt erst dann den Zahlstatus
 */
export type PaymentProvider = "manual" | "paypal" | "card";

export type PaymentProviderInfo = { id: PaymentProvider; enabled: boolean };

export function paymentProviders(): PaymentProviderInfo[] {
  return [
    { id: "manual", enabled: true },
    { id: "paypal", enabled: false }, // noch nicht angebunden
    { id: "card", enabled: false }, // noch nicht angebunden
  ];
}
