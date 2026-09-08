import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";

const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("nav");

  return <main>{t("wordmark")}</main>;
};

export default HomePage;
