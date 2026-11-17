"use client";

import Link from "next/link";
import { StarArc } from "@/components/brand/Brand";
import { useI18n } from "@/components/providers/I18nProvider";

export default function NotFound() {
  const { locale, t } = useI18n();
  return (
    <div className="bg-linen flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <StarArc className="w-24 text-gold" />
      <h1 className="mt-4 font-display text-4xl text-bordeaux">{t.notFound.title}</h1>
      <p className="mt-3 text-cocoa-soft">{t.notFound.text}</p>
      <Link href={`/${locale}`} className="btn btn-gold mt-8">
        {t.common.backHome}
      </Link>
    </div>
  );
}
