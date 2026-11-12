import { json } from "@/lib/server/json";

/**
 * Admin-API (Platzhalter). Zugriff wird bereits in der Middleware serverseitig geprüft.
 * Später: Produkte in D1 anlegen/bearbeiten, Bilder/Dateien nach R2 hochladen.
 * Jede Route prüft zusätzlich selbst die Berechtigung (Defense in Depth).
 */
export async function GET() {
  return json({ error: "not_implemented" }, 501);
}
export async function POST() {
  return json({ error: "not_implemented" }, 501);
}
