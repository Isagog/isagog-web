import { I18nProviderClient } from "@/packages/locales/client";
import { getStaticParams } from "@/packages/locales/server";
import type { ReactNode } from "react";
import "../globals.css";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <I18nProviderClient locale={locale}>
        <body>{children}</body>
      </I18nProviderClient>
    </html>
  );
}
