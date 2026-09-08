import { BodyWrapper } from "@/app/_components/custom/body-wrapper";
import { Footer } from "@/app/_components/custom/footer";
import { Header } from "@/app/_components/custom/header";
import { Providers } from "@/app/_components/providers";
import { SectionRail } from "@/app/_components/custom/section-rail";
import { I18nProviderClient } from "@/packages/locales/client";
import { getStaticParams } from "@/packages/locales/server";
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";

export const metadata: Metadata = {
  title: "Isagog — Un'IA che sa dire cosa sa",
  description:
    "Isagog rende la conoscenza della vostra organizzazione esplicita, verificabile e utilizzabile da assistenti e applicazioni di intelligenza artificiale.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL("https://isagog.com"),
};

export function generateStaticParams() {
  return getStaticParams();
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${fraunces.variable} font-sans`}
    >
      <I18nProviderClient locale={locale}>
        <BodyWrapper className="pt-[72px]">
          <Providers>
            <Header />
            <SectionRail />
            {children}
            <Footer />
          </Providers>
        </BodyWrapper>
      </I18nProviderClient>
    </html>
  );
}
