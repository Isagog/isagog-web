import { setStaticParamsLocale } from "@/packages/locales/server";
import { Contatto } from "./components";

const ContactPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Contatto />
    </main>
  );
};

export default ContactPage;
