import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { asset } from "@/lib/base-path";
import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";

export const Hero = async () => {
  const t = await getScopedI18n("discover.hero");

  return (
    <section className="relative overflow-hidden bg-visione px-6 py-20 md:py-24">
      <Image
        src={asset("/images/about-images/tree-canopy.png")}
        alt=""
        aria-hidden="true"
        width={400}
        height={500}
        className="pointer-events-none absolute -right-10 bottom-0 hidden h-[340px] w-auto object-contain opacity-15 md:block"
      />
      <div className="relative z-10 mx-auto max-w-[1224px]">
        <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-cream-soft">
          <span className="h-2 w-2 shrink-0 rounded-full bg-terracotta" aria-hidden="true" />
          {t("eyebrow")}
        </span>
        <h1 className="mt-6 max-w-[760px] text-[clamp(34px,4.6vw,54px)] leading-[1.1] text-cream">
          {t("titleLine1")}
          <br />
          <em className="not-italic text-em-dark">{t("titleEm")}</em>
          <br />
          {t("titleLine2")}
        </h1>
        <p className="mt-7 max-w-[600px] text-[17px] leading-[1.6] text-cream-soft">{t("sub")}</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <a
            href="#call"
            className="rounded-[5px] bg-terracotta px-5 py-3.5 text-[15px] font-medium text-white"
          >
            {t("ctaPrimary")}
          </a>
          <Link
            href="/project"
            className="rounded-[5px] border border-cream/30 px-5 py-3.5 text-[15px] text-cream"
          >
            {t("ctaSecondary")}
          </Link>
        </div>
      </div>
    </section>
  );
};
