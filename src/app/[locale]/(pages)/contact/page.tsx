import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";

const ContactPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("footer");

  return (
    <main className="mx-auto max-w-[1224px] px-6 py-20">
      <h1 className="text-[clamp(32px,4vw,46px)] leading-[1.15] text-forest">
        {t("contact")}
      </h1>
    </main>
  );
};

export default ContactPage;
