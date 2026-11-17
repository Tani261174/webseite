import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

/**
 * SQLite-Datenbank (in Node.js eingebaut, keine Zusatzsoftware nötig).
 * Datei: $DATA_DIR/sabor.db – auf dem Server persistent ablegen und regelmäßig sichern.
 */
export const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), "data"));
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const g = globalThis as unknown as { __saborDb?: DatabaseSync };

export function db(): DatabaseSync {
  if (g.__saborDb) return g.__saborDb;
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const conn = new DatabaseSync(path.join(DATA_DIR, "sabor.db"));
  conn.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  migrate(conn);
  seed(conn);
  g.__saborDb = conn;
  return conn;
}

/** Mehrere Schritte atomar ausführen. */
export function tx<T>(fn: (c: DatabaseSync) => T): T {
  const c = db();
  c.exec("BEGIN IMMEDIATE");
  try {
    const r = fn(c);
    c.exec("COMMIT");
    return r;
  } catch (e) {
    c.exec("ROLLBACK");
    throw e;
  }
}

function migrate(c: DatabaseSync) {
  c.exec(`
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name_es TEXT NOT NULL, name_de TEXT NOT NULL DEFAULT '',
      desc_es TEXT NOT NULL DEFAULT '', desc_de TEXT NOT NULL DEFAULT '',
      unit_es TEXT NOT NULL DEFAULT '', unit_de TEXT NOT NULL DEFAULT '',
      price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
      image TEXT,
      allergens TEXT NOT NULL DEFAULT '[]',
      allergens_confirmed INTEGER NOT NULL DEFAULT 0,
      ingredients_es TEXT NOT NULL DEFAULT '', ingredients_de TEXT NOT NULL DEFAULT '',
      foodinfo_es TEXT NOT NULL DEFAULT '', foodinfo_de TEXT NOT NULL DEFAULT '',
      active INTEGER NOT NULL DEFAULT 1,
      sold_out INTEGER NOT NULL DEFAULT 0,
      stock INTEGER,
      max_per_order INTEGER NOT NULL DEFAULT 50,
      lead_days INTEGER,
      christmas INTEGER NOT NULL DEFAULT 0,
      seasonal INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 1,
      sort INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      name_es TEXT NOT NULL, name_de TEXT NOT NULL DEFAULT '',
      price_cents INTEGER,
      active INTEGER NOT NULL DEFAULT 1,
      sort INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')));

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      pickup_date TEXT NOT NULL,
      message TEXT NOT NULL DEFAULT '',
      items TEXT NOT NULL,
      total_cents INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'nuevo',
      stock_reserved INTEGER NOT NULL DEFAULT 1,
      locale TEXT NOT NULL DEFAULT 'es',
      admin_note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS orders_date ON orders(pickup_date);

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'nuevo',
      locale TEXT NOT NULL DEFAULT 'es',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      text TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      published INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rate_hits (key TEXT NOT NULL, at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS rate_hits_key ON rate_hits(key, at);
  `);
}

/** Startprodukte einmalig anlegen (danach nur noch über den Adminbereich ändern). */
function seed(c: DatabaseSync) {
  const done = c.prepare("SELECT value FROM meta WHERE key = 'seeded'").get();
  if (done) return;

  const insert = c.prepare(`
    INSERT INTO products (slug, name_es, name_de, desc_es, desc_de, unit_es, unit_de, price_cents, christmas, featured, sort, lead_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);
  const variant = c.prepare("INSERT INTO variants (product_id, name_es, name_de, sort) VALUES (?, ?, ?, ?)");

  const products: [string, string, string, string, string, string, string, number, number, number, number | null][] = [
    [
      "hallacas",
      "Hallacas venezolanas",
      "Venezolanische Hallacas",
      "La reina de la Navidad venezolana: masa de maíz rellena de guiso tradicional, envuelta a mano en hojas de plátano y cocida con paciencia.",
      "Die Königin der venezolanischen Weihnacht: Maisteig mit traditionellem Schmorfleisch-Füllung, von Hand in Bananenblätter gewickelt und langsam gegart.",
      "por unidad",
      "pro Stück",
      800, 1, 1, null,
    ],
    [
      "empanadas",
      "Empanadas venezolanas",
      "Venezolanische Empanadas",
      "Doraditas y crujientes, de masa de maíz y rellenas al gusto. Perfectas para el desayuno, la merienda o cualquier antojo.",
      "Goldbraun und knusprig, aus Maisteig und nach Wahl gefüllt. Perfekt zum Frühstück, als Snack oder einfach so.",
      "por unidad",
      "pro Stück",
      350, 0, 2, null,
    ],
    [
      "pan-de-jamon",
      "Pan de Jamón",
      "Pan de Jamón",
      "El pan navideño por excelencia: masa suave enrollada con jamón, aceitunas y pasas. Ideal para compartir en la mesa.",
      "Das klassische venezolanische Weihnachtsbrot: weicher Hefeteig, gerollt mit Schinken, Oliven und Rosinen. Ideal zum Teilen.",
      "por unidad",
      "pro Stück",
      2500, 1, 3, null,
    ],
    [
      "torta-de-pan",
      "Torta de Pan",
      "Torta de Pan",
      "Torta casera de pan, húmeda y aromática, como la que se hacía en casa de la abuela.",
      "Hausgemachter Brotkuchen, saftig und aromatisch – wie bei Oma.",
      "torta entera",
      "ganzer Kuchen",
      2200, 1, 4, null,
    ],
    [
      "quesillo",
      "Quesillo venezolano",
      "Venezolanischer Quesillo",
      "Nuestro flan venezolano, cremoso y con su caramelo dorado. Un clásico que nunca falla.",
      "Unser venezolanischer Karamellpudding – cremig, mit goldenem Karamell. Ein Klassiker, der immer gelingt.",
      "molde entero",
      "ganze Form",
      2500, 1, 5, null,
    ],
  ];

  c.exec("BEGIN");
  try {
    for (const p of products) {
      const r = insert.run(...p);
      if (p[0] === "empanadas") {
        const id = Number(r.lastInsertRowid);
        variant.run(id, "Carne mechada", "Carne mechada (gezupftes Rindfleisch)", 1);
        variant.run(id, "Pollo", "Hähnchen", 2);
        variant.run(id, "Queso", "Käse", 3);
      }
    }
    c.prepare("INSERT INTO meta (key, value) VALUES ('seeded', ?)").run(new Date().toISOString());
    c.exec("COMMIT");
  } catch (e) {
    c.exec("ROLLBACK");
    throw e;
  }
}
