import { BodyWrapper } from "@/app/_components/custom/body-wrapper";
import { Footer } from "@/app/_components/custom/footer";
import { Header } from "@/app/_components/custom/header";
import { Providers } from "@/app/_components/providers";
import { asset, SITE_URL } from "@/lib/base-path";
import { I18nProviderClient } from "@/packages/locales/client";
import { getStaticParams } from "@/packages/locales/server";
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";

export const metadata: Metadata = {
  // asset() prefixes the base path directly — icon URLs are never resolved
  // against metadataBase, so a hardcoded root-relative path here would
  // serve the old live site's favicon on a staging build.
  icons: [{ rel: "icon", url: asset("/favicon.ico") }],
  // Must be this deployment's own origin+base path, not a bare production
  // hardcode: buildPageMetadata's alternates.languages resolve against
  // this too. A stale metadataBase would make a staging build's hreflang
  // tags point at the old live site's real URLs while canonical correctly
  // pointed at /isagog-web/ — the same identity-contradiction hazard as
  // the og:url/image fix.
  metadataBase: new URL(SITE_URL),
  // Title, description, canonical and hreflang alternates are per-page —
  // see src/lib/page-metadata.ts and each route's generateMetadata.
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

// Resolved once, at module load during the build's static render — not
// per-request — so every page's footer bakes in the same year the client
// bundle was built with. See Footer's `year` prop for why this must not
// move into the client component.
const buildYear = new Date().getFullYear();

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
            {children}
            <Footer year={buildYear} />
          </Providers>
        </BodyWrapper>
      </I18nProviderClient>
    </html>
  );
}
