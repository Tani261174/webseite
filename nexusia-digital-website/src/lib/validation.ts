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
