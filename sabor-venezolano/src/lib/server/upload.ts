import "server-only";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "./db";

/**
 * Bild-Upload aus dem Adminbereich.
 * - Nur JPEG, PNG, WebP (Prüfung anhand der Datei-Signatur, nicht nur der Endung)
 * - max. 8 MB
 * - wird auf max. 1600 px verkleinert und als WebP gespeichert (schnelle Ladezeiten, keine EXIF-/GPS-Daten)
 */
const MAX = 8 * 1024 * 1024;

function sniff(buf: Buffer) {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "webp";
  return null;
}

export class UploadError extends Error {}

export async function saveImage(file: File | null | undefined): Promise<string | null> {
  if (!file || typeof file === "string" || file.size === 0) return null;
  if (file.size > MAX) throw new UploadError("too_large");
  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf);
  if (!kind) throw new UploadError("bad_type");

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`;
  try {
    const sharp = (await import("sharp")).default;
    const out = await sharp(buf).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    await fs.writeFile(path.join(UPLOAD_DIR, `${name}.webp`), out);
    return `/media/${name}.webp`;
  } catch (e) {
    if (e instanceof Error && /unsupported|corrupt|Input/i.test(e.message)) throw new UploadError("bad_type");
    // Fallback ohne Bildbearbeitung (z. B. falls sharp auf dem Server fehlt)
    await fs.writeFile(path.join(UPLOAD_DIR, `${name}.${kind}`), buf);
    return `/media/${name}.${kind}`;
  }
}
