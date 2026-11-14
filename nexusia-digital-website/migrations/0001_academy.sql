-- Academia NexusIA Digital – Datenbankschema für Cloudflare D1 (SQLite)
-- Anwenden (erst nach Freigabe & Einrichtung der D1-Datenbank):
--   npx wrangler d1 migrations apply nexusia-academy --local    (lokal testen)
--   npx wrangler d1 migrations apply nexusia-academy --remote   (Produktion)

PRAGMA foreign_keys = ON;

-- Nutzer & Rollen ------------------------------------------------------------
CREATE TABLE users (
  id            TEXT PRIMARY KEY,                 -- UUID
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,                    -- PBKDF2-SHA256 (WebCrypto), Salt + Iterationen im String
  role          TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','admin')),
  locale        TEXT NOT NULL DEFAULT 'es' CHECK (locale IN ('es','de','en')),
  email_verified_at TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE sessions (
  id         TEXT PRIMARY KEY,                    -- SHA-256 des Session-Tokens (Token selbst nur im HttpOnly-Cookie)
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_sessions_user ON sessions(user_id);

-- Kurse, Module, Lektionen ---------------------------------------------------
CREATE TABLE courses (
  slug        TEXT PRIMARY KEY,
  sort_order  INTEGER NOT NULL DEFAULT 100,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','soon','open')),
  area        TEXT NOT NULL,
  level       TEXT NOT NULL CHECK (level IN ('beginner','intermediate','all')),
  cover       TEXT,                               -- Motiv für das goldene SVG, falls kein Bild
  image_key   TEXT,                               -- R2-Schlüssel des Kursbilds
  price_cents INTEGER,                            -- NULL = Próximamente
  content     TEXT NOT NULL,                      -- JSON: title/short/description/goals/audience/requirements/faq je Sprache
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE modules (
  id          TEXT PRIMARY KEY,
  course_slug TEXT NOT NULL REFERENCES courses(slug) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL,
  title       TEXT NOT NULL,                      -- JSON {es,de,en}
  UNIQUE (course_slug, slug)
);

CREATE TABLE lessons (
  id          TEXT PRIMARY KEY,
  module_id   TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL,
  title       TEXT NOT NULL,                      -- JSON {es,de,en}
  access      TEXT NOT NULL DEFAULT 'paid' CHECK (access IN ('preview','paid')),
  status      TEXT NOT NULL DEFAULT 'soon' CHECK (status IN ('ready','soon')),
  minutes     INTEGER,
  video       TEXT,                               -- JSON {kind, id|src}
  body        TEXT,                               -- JSON LessonBody (Blöcke + Quiz)
  UNIQUE (module_id, slug)
);

CREATE TABLE files (
  id          TEXT PRIMARY KEY,
  lesson_id   TEXT REFERENCES lessons(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,                      -- JSON {es,de,en}
  format      TEXT NOT NULL CHECK (format IN ('PDF','EPUB','XLSX','DOCX','VIDEO')),
  r2_key      TEXT NOT NULL,                      -- privat; Auslieferung nur über signierte, kurzlebige Links
  is_public   INTEGER NOT NULL DEFAULT 0
);

-- Verkauf -------------------------------------------------------------------
CREATE TABLE bundles (
  slug        TEXT PRIMARY KEY,
  title       TEXT NOT NULL,                      -- JSON {es,de,en}
  price_cents INTEGER NOT NULL,
  active      INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE bundle_courses (
  bundle_slug TEXT NOT NULL REFERENCES bundles(slug) ON DELETE CASCADE,
  course_slug TEXT NOT NULL REFERENCES courses(slug) ON DELETE CASCADE,
  PRIMARY KEY (bundle_slug, course_slug)
);

CREATE TABLE coupons (
  code             TEXT PRIMARY KEY COLLATE NOCASE,
  percent_off      INTEGER CHECK (percent_off BETWEEN 1 AND 100),
  amount_off_cents INTEGER,
  course_slugs     TEXT,                          -- JSON-Array oder NULL = alle
  max_uses         INTEGER,
  used             INTEGER NOT NULL DEFAULT 0,
  expires_at       TEXT,
  active           INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE orders (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id),
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','refunded','failed')),
  provider       TEXT NOT NULL CHECK (provider IN ('paypal','stripe')),
  provider_ref   TEXT,                            -- Bestell-/Session-ID beim Anbieter
  currency       TEXT NOT NULL DEFAULT 'EUR',
  subtotal_cents INTEGER NOT NULL,
  discount_cents INTEGER NOT NULL DEFAULT 0,
  total_cents    INTEGER NOT NULL,
  coupon_code    TEXT,
  is_test        INTEGER NOT NULL DEFAULT 1,      -- Testmodus bis zur Freigabe
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  paid_at        TEXT
);
CREATE TABLE order_items (
  order_id    TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  course_slug TEXT,
  bundle_slug TEXT,
  price_cents INTEGER NOT NULL
);

-- Freischaltung nach BESTÄTIGTER Zahlung (Webhook des Anbieters, nie durch den Browser)
CREATE TABLE enrollments (
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL REFERENCES courses(slug) ON DELETE CASCADE,
  order_id    TEXT REFERENCES orders(id),
  granted_at  TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, course_slug)
);

-- Lernen ---------------------------------------------------------------------
CREATE TABLE progress (
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  done        INTEGER NOT NULL DEFAULT 0,
  quiz_score  INTEGER,
  quiz_total  INTEGER,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, course_slug, lesson_slug)
);

CREATE TABLE certificates (
  id          TEXT PRIMARY KEY,                   -- öffentlich prüfbare Zertifikats-ID
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  issued_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, course_slug)
);
