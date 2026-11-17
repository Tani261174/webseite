// End-to-End-Test des Bestellablaufs (Handy-Ansicht).
// Voraussetzung: Server läuft (npm run dev oder npm start).
// Aufruf: BASE_URL=http://localhost:3000 node scripts/smoke-test.mjs [screenshot-ordner]
import { createRequire } from "node:module";
const { chromium, devices } = createRequire(import.meta.url)("playwright");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const shots = process.argv[2];
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
// wa.me nicht wirklich öffnen
await page.route("https://wa.me/**", (r) => r.fulfill({ status: 200, body: "whatsapp" }));

function ok(cond, msg) {
  if (!cond) throw new Error("FEHLER: " + msg);
  console.log("✓ " + msg);
}

await page.goto(`${BASE}/es/productos`, { waitUntil: "networkidle" });
const empanadas = page.locator("article", { hasText: "Empanadas venezolanas" });
await empanadas.getByText("Pollo").click();
await empanadas.getByRole("button", { name: "Más" }).click();
await empanadas.getByRole("button", { name: /Añadir al carrito/ }).click();
await page.locator("article", { hasText: "Hallacas venezolanas" }).getByRole("button", { name: /Añadir al carrito/ }).click();
ok((await page.getByRole("link", { name: /Pedido \(3\)/ }).count()) === 1, "Warenkorb zeigt 3 Artikel");

await page.goto(`${BASE}/es/carrito`, { waitUntil: "networkidle" });
ok(await page.getByText("15,00 €").first().isVisible(), "Gesamtpreis 15,00 € (2×3,50 + 8,00)");
if (shots) await page.screenshot({ path: `${shots}/cart-mobile.png`, fullPage: true });

// Zu früher Termin → Fehlermeldung
const today = new Date().toISOString().slice(0, 10);
await page.fill("#date", today);
ok(await page.getByText(/demasiado pronto/).isVisible(), "Zu kurzfristiger Termin wird abgelehnt");

const min = await page.getAttribute("#date", "min");
await page.fill("#date", min);
await page.fill("#name", "Test Cliente");
await page.fill("#message", "Prueba automática");
await page.check("input[type=checkbox]");
await page.waitForTimeout(3200); // Spam-Schutz: Formular nicht in < 3 s absenden
await page.getByRole("button", { name: /Enviar pedido por WhatsApp/ }).click();
// Auf echten Handys öffnet sich WhatsApp direkt; im Test lesen wir den Link der Erfolgsseite.
const link = page.getByRole("link", { name: "Abrir WhatsApp" });
await link.waitFor({ timeout: 15000 });
if (shots) await page.screenshot({ path: `${shots}/order-success-mobile.png` });
const href = await link.getAttribute("href");
ok(href.startsWith("https://wa.me/49151122131076?text="), "WhatsApp-Link mit richtiger Nummer");
const text = new URL(href).searchParams.get("text");
console.log("\n--- WhatsApp-Nachricht ---\n" + text + "\n--------------------------");
ok(text.includes("2 × Empanadas venezolanas (Pollo) – 7,00 €"), "Nachricht enthält Empanadas");
ok(text.includes("1 × Hallacas venezolanas – 8,00 €"), "Nachricht enthält Hallacas");
ok(text.includes("Total: 15,00 €"), "Nachricht enthält Gesamtbetrag");
ok(/SV-[A-Z0-9]{5}/.test(text), "Nachricht enthält Bestellnummer");

if (errors.length) throw new Error("JS-Fehler: " + errors.join("\n"));
console.log("\nAlle Tests bestanden.");
await browser.close();
