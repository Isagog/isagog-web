import { setStaticParamsLocale } from "@/packages/locales/server";
import { Apertura, Contatto, Hero, Persone, Tecnologia } from "./components";

const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Hero />
      <Apertura />
      <Tecnologia />
      <Persone />
      <Contatto />
    </main>
  );
};

export default HomePage;
