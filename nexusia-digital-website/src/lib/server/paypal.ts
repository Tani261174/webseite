import "server-only";

/**
 * PayPal-Anbindung (REST API v2, serverseitig).
 * Wird nur aktiv, wenn PAYMENTS_ENABLED="true" UND Zugangsdaten als Secrets hinterlegt sind.
 * Zugangsdaten werden niemals an den Browser ausgeliefert.
 */
export function paypalConfigured() {
  return (
    process.env.PAYMENTS_ENABLED === "true" &&
    !!process.env.PAYPAL_CLIENT_ID &&
    !!process.env.PAYPAL_CLIENT_SECRET
  );
}

function apiBase() {
  return process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function accessToken() {
  const creds = btoa(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`);
  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${creds}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`paypal_auth_${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function createPaypalOrder(totalCents: number, referenceId: string) {
  const token = await accessToken();
  const res = await fetch(`${apiBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "PayPal-Request-Id": referenceId },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ reference_id: referenceId, amount: { currency_code: "EUR", value: (totalCents / 100).toFixed(2) } }],
    }),
  });
  if (!res.ok) throw new Error(`paypal_order_${res.status}`);
  return (await res.json()) as { id: string; status: string };
}

// Noch offen (bewusst nicht implementiert, bis Backend/Datenbank stehen):
// - captureOrder(orderId) nach Freigabe durch Käufer:in
// - Webhook-Verifizierung (/v1/notifications/verify-webhook-signature)
// - Bestellung in D1 speichern, Download-Links erzeugen, Bestätigungs-E-Mail senden
