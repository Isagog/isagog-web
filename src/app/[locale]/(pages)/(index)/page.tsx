import { setStaticParamsLocale } from "@/packages/locales/server";
import { Apertura, Hero, Teasers } from "./components";

const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Hero />
      <Apertura />
      <Teasers />
    </main>
  );
};

export default HomePage;
