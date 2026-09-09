import { setStaticParamsLocale } from "@/packages/locales/server";
import { Apertura, Hero } from "./components";

const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Hero />
      <Apertura />
    </main>
  );
};

export default HomePage;
