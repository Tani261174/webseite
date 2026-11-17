// End-to-End-Test des Adminbereichs.
// Aufruf: ADMIN_USER=admin ADMIN_PASSWORD=... BASE_URL=http://localhost:3000 node scripts/admin-test.mjs [screenshot-ordner]
import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const sharp = require("sharp");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const shots = process.argv[2];
const ok = (c, m) => {
  if (!c) throw new Error("FEHLER: " + m);
  console.log("✓ " + m);
};

const img = path.join(shots || ".", "test-foto.jpg");
await sharp({ create: { width: 1200, height: 900, channels: 3, background: { r: 198, g: 161, b: 91 } } }).jpeg().toFile(img);

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();

// Falsches Passwort
await page.goto(`${BASE}/admin/login`);
await page.fill("#user", process.env.ADMIN_USER || "admin");
await page.fill("#password", "falsch-falsch-falsch");
await page.getByRole("button", { name: "Entrar" }).click();
await page.getByText("Usuario o contraseña incorrectos.").waitFor();
ok(true, "Falsches Passwort wird abgelehnt");

// Richtiges Passwort
await page.fill("#password", process.env.ADMIN_PASSWORD);
await page.getByRole("button", { name: "Entrar" }).click();
await page.waitForURL(`${BASE}/admin`);
ok(await page.getByText("¡Bienvenidas!").isVisible(), "Anmeldung erfolgreich, Übersicht sichtbar");
if (shots) await page.screenshot({ path: `${shots}/admin-dashboard.png`, fullPage: true });

// Bestellung öffnen und Status ändern
await page.goto(`${BASE}/admin/pedidos`);
const first = page.locator("ul li a").first();
ok((await first.count()) === 1, "Über die Website erfasste Bestellung ist sichtbar");
await first.click();
await page.getByLabel("Confirmado").check();
await page.getByRole("button", { name: "Guardar" }).click();
await page.waitForURL(/saved=1/);
await page.getByText("Guardado ✓").waitFor(); ok(true, "Bestellstatus auf 'Confirmado' gesetzt");
if (shots) await page.screenshot({ path: `${shots}/admin-order.png`, fullPage: true });

// Produktpreis ändern + Foto hochladen
await page.goto(`${BASE}/admin/productos`);
await page.locator("li", { hasText: "Quesillo" }).getByRole("link", { name: "Editar" }).click();
await page.fill("input[name=price]", "26,50");
await page.setInputFiles("input[name=image]", img);
await page.getByRole("button", { name: "Guardar" }).click();
await page.waitForURL(/saved=1/);
await page.getByText("Guardado ✓").waitFor(); ok(true, "Produkt gespeichert (Preis + Foto)");
if (shots) await page.screenshot({ path: `${shots}/admin-product.png`, fullPage: true });

await page.goto(`${BASE}/es/productos/quesillo`);
await page.getByText("26,50 €").first().waitFor(); ok(true, "Neuer Preis 26,50 € erscheint im Shop");
ok((await page.locator("img[src^='/media/']").count()) > 0, "Hochgeladenes Foto erscheint im Shop");

// Ohne Anmeldung kein Zugriff
const anon = await (await browser.newContext()).newPage();
await anon.goto(`${BASE}/admin/productos`);
ok(anon.url().endsWith("/admin/login"), "Ohne Anmeldung → Weiterleitung zur Anmeldung");

// Preis zurücksetzen
await page.goto(`${BASE}/admin/productos`);
await page.locator("li", { hasText: "Quesillo" }).getByRole("link", { name: "Editar" }).click();
await page.fill("input[name=price]", "25,00");
await page.check("input[name=image_remove]");
await page.getByRole("button", { name: "Guardar" }).click();
await page.waitForURL(/saved=1/);
ok(true, "Testdaten zurückgesetzt");

console.log("\nAlle Admin-Tests bestanden.");
await browser.close();
