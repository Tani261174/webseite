import { z } from "zod";

/** Gemeinsame Validierung – wird im Browser (Hinweise) und auf dem Server (verbindlich) genutzt. */
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  subject: z.string().trim().max(150).optional().default(""),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  locale: z.enum(["de", "es", "en"]),
  website: z.string().max(0).optional().default(""), // Honeypot – muss leer bleiben
});

export const newsletterSchema = z.object({
  email: z.email().max(200),
  consent: z.literal(true),
  locale: z.enum(["de", "es", "en"]),
  website: z.string().max(0).optional().default(""),
});

export const checkoutSchema = z.object({
  items: z.array(z.string().regex(/^[a-z0-9-]{1,80}$/)).min(1).max(50),
});

/* ---------- Academia ---------- */
export const tutorSchema = z.object({
  question: z.string().trim().min(2).max(500),
  locale: z.enum(["de", "es", "en"]),
  course: z.string().regex(/^[a-z0-9-]{1,80}$/).optional(),
});

export const quoteSchema = z.object({
  course: z.string().regex(/^[a-z0-9-]{1,80}$/),
  code: z.string().trim().max(40).regex(/^[A-Za-z0-9_-]*$/).optional(),
});

const l10nText = (min: number, max: number) => z.object({ es: z.string().trim().min(min).max(max), de: z.string().trim().max(max), en: z.string().trim().max(max) });

/** Kursformular im Admin-Dashboard */
export const adminCourseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]{3,80}$/),
  title: l10nText(3, 160),
  short: l10nText(10, 240),
  description: l10nText(20, 4000),
  area: z.enum(["ecommerce", "affiliate", "social", "digital", "ai"]),
  level: z.enum(["beginner", "intermediate", "all"]),
  status: z.enum(["draft", "soon", "open"]),
  priceCents: z.number().int().min(0).max(10_000_000).nullable(),
  image: z.union([z.url().max(500), z.literal("")]),
});
