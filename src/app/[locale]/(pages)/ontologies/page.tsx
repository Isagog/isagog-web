import { buildPageMetadata } from "@/lib/page-metadata";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import type { Metadata } from "next";
import { Esplora, Introduzione, Livelli, Prospettive, Ragionamento } from "./components";

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
    path: "/ontologies",
    title: t("ontologies.title"),
    description: t("ontologies.description"),
  });
}

const OntologiesPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Introduzione />
      <Prospettive />
      <Livelli />
      <Ragionamento />
      <Esplora />
    </main>
  );
};

export default OntologiesPage;
