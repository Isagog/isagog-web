import { setStaticParamsLocale } from "@/packages/locales/server";
import { Apertura, Contatto, Hero, Metodologia, Persone, Tecnologia, Visione } from "./components";

const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Hero />
      <Apertura />
      <Visione />
      <Metodologia />
      <Tecnologia />
      <Persone />
      <Contatto />
    </main>
  );
};

export default HomePage;
