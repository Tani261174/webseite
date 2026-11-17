import "server-only";
import { cookies } from "next/headers";
import { adminMessages, type AdminLang } from "../i18n/admin";

export async function getAdminLang(): Promise<AdminLang> {
  const v = (await cookies()).get("sv_admin_lang")?.value;
  return v === "de" ? "de" : "es";
}

export async function getAdminT() {
  const lang = await getAdminLang();
  return { lang, a: adminMessages[lang] };
}
