import fs from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/server/db";

/** Liefert hochgeladene Bilder aus $DATA_DIR/uploads aus (nur sichere Dateinamen). */
const TYPES: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png" };

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[a-z0-9-]{8,64}\.(webp|jpg|png)$/.test(file)) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": TYPES[path.extname(file)],
        "Cache-Control": "public, max-age=31536000, immutable", // Dateinamen sind eindeutig
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
