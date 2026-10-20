import { buildPageMetadata } from "@/lib/page-metadata";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import type { Metadata } from "next";
import { Approccio, Call, Casi, Hero, Problema, Settori } from "./components";

// Campaign landing page: reached from ads, so it stays out of the header,
// the footer and the sitemap.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("meta");
  return buildPageMetadata({
    locale,
    path: "/discover",
    title: t("discover.title"),
    description: t("discover.description"),
  });
}

const DiscoverPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Hero />
      <Problema />
      <Approccio />
      <Casi />
      <Settori />
      <Call />
    </main>
  );
};

export default DiscoverPage;
