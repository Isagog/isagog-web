import { setStaticParamsLocale } from "@/packages/locales/server";
import { Persone } from "./components";

const AboutPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Persone />
    </main>
  );
};

export default AboutPage;
