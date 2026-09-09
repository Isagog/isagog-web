import { setStaticParamsLocale } from "@/packages/locales/server";
import { Metodologia, Visione } from "./components";

const ApproachPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Visione />
      <Metodologia />
    </main>
  );
};

export default ApproachPage;
