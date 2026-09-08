import { BodyWrapper } from "@/app/_components/custom/body-wrapper";
import { Footer } from "@/app/_components/custom/footer";
import { Header } from "@/app/_components/custom/header";
import { Providers } from "@/app/_components/providers";
import { SectionRail } from "@/app/_components/custom/section-rail";
import { IS_STAGING, SITE_URL } from "@/lib/base-path";
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
  openGraph: {
    title: "Isagog — Un'IA che sa dire cosa sa",
    description:
      "Isagog rende la conoscenza della vostra organizzazione esplicita, verificabile e utilizzabile da assistenti e applicazioni di intelligenza artificiale.",
    url: "https://isagog.com",
    siteName: "Isagog",
    images: [
      {
        url: "https://isagog.com/images/tree.avif",
        width: 1200,
        height: 630,
        alt: "Illustrazione di un albero, Isagog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Isagog — Un'IA che sa dire cosa sa",
    description:
      "Isagog rende la conoscenza della vostra organizzazione esplicita, verificabile e utilizzabile da assistenti e applicazioni di intelligenza artificiale.",
    images: ["https://isagog.com/images/tree.avif"],
  },
  alternates: {
    // Derived from SITE_URL (not hardcoded to "https://isagog.com/"): on a
    // staging build (base path set) this must not assert canonical
    // ownership of the old live site's root URL — the same hazard the
    // sitemap guards against. SITE_URL already carries the base path when
    // one is set, so this resolves to https://isagog.com/isagog-web/ on
    // staging and https://isagog.com/ in production.
    canonical: `${SITE_URL}/`,
    languages: { it: "/it", en: "/en" },
  },
  // A staging build's robots.txt lives at a subpath and is never read by
  // crawlers — this per-page meta tag is what actually keeps it out of
  // search results there.
  robots: IS_STAGING ? { index: false, follow: false } : undefined,
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
