import { buildPageMetadata } from "@/lib/page-metadata";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import type { Metadata } from "next";
import { Agenti, Call, Confronto, Conversazioni, Domande, Hero, Idee, Maxxi, Staff } from "./components";

// Non-technical page for museum staff, linked from outreach emails. It stays
// out of the header and footer, but is in the sitemap so museums can find it.
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
    path: "/musei",
    title: t("musei.title"),
    description: t("musei.description"),
  });
}

const MuseiPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Hero />
      <Conversazioni />
      <Agenti />
      <Confronto />
      <Maxxi />
      <Staff />
      <Idee />
      <Domande />
      <Call />
    </main>
  );
};

export default MuseiPage;
