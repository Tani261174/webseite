"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

type Ctx = { locale: Locale; t: Messages };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ locale, t, children }: Ctx & { children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n außerhalb von I18nProvider");
  return ctx;
}
