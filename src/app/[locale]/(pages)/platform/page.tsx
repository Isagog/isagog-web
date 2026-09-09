import { asset } from "@/lib/base-path";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import { Monitor, Network } from "lucide-react";
import { Tecnologia, TextCarousel } from "./components";

const PlatformPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getScopedI18n("platform");

  return (
    <main className="bg-page">
      <Tecnologia />

      <iframe
        src={asset(`/platform-explorer/${locale === "it" ? "it" : "en"}.html`)}
        title={t("explorerTitle")}
        className="hidden aspect-[1280/886] w-full border-0 sm:block"
      />

      <div className="mx-6 flex flex-col items-center gap-3 border border-forest/25 p-8 text-center sm:hidden">
        <Network className="text-terracotta" size={36} strokeWidth={1.5} />
        <p className="font-serif text-[18px] text-forest">{t("mobileNotice")}</p>
        <p className="flex items-center gap-2 text-[14px] uppercase tracking-wide text-terracotta">
          <Monitor size={18} strokeWidth={1.75} />
          {t("mobileCta")}
        </p>
      </div>

      <TextCarousel />
    </main>
  );
};

export default PlatformPage;
