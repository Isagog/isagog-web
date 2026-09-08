import { asset } from "@/lib/base-path";
import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";

export const Hero = async () => {
  const t = await getScopedI18n("home.hero");

  return (
    <section className="flex flex-col items-center px-6 pt-16 pb-10 text-center">
      <Image
        src={asset("/images/tree.avif")}
        alt={t("imageAlt")}
        width={320}
        height={320}
        preload
        className="h-auto w-[220px] sm:w-[280px]"
      />
      <h1 className="mt-8 text-[clamp(34px,5vw,56px)] leading-[1.1] text-forest">
        {t("title")}
      </h1>
      <p className="mt-4 text-[18px] text-prose-muted">{t("tagline")}</p>
    </section>
  );
};
