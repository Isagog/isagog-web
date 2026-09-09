import { setStaticParamsLocale } from "@/packages/locales/server";
import { Apertura, Contatto, Hero } from "./components";

const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Hero />
      <Apertura />
      <Contatto />
    </main>
  );
};

export default HomePage;
