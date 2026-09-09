import { SectionHeading } from "@/app/_components/custom/section-heading";
import { asset } from "@/lib/base-path";
import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";
import { DemoSlot } from "./demo-slot";

export const Visione = async () => {
  const t = await getScopedI18n("approach.visione");

  return (
    <section id="visione" className="scroll-anchor bg-visione px-6 py-20">
      <div className="mx-auto max-w-[1224px]">
        <SectionHeading
          tone="dark"
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("titleLine1")}
              <br />
              <em className="not-italic text-em-dark">{t("titleEm")}</em>
            </>
          }
          lead={t("lead")}
        />

        <div className="mt-12 grid gap-x-10 text-[16.5px] leading-[1.6] text-cream-soft md:grid-cols-2">
          <p className="mb-5">{t("p1")}</p>
          <p className="mb-5">{t("p2")}</p>
          <p className="mb-5">{t("p3")}</p>
          <p className="mb-5 overflow-hidden">
            <Image
              src={asset("/images/about-images/tree-bonsai.png")}
              alt={t("bonsaiAlt")}
              width={160}
              height={160}
              className="float-right ml-4 mb-2 h-[72px] w-auto object-contain opacity-90"
            />
            {t("p4a")}
            <em>{t("p4Isagoge")}</em>
            {t("p4b")}
            <em>{t("p4Categorie")}</em>
            {t("p4c")}
          </p>
        </div>

        <div className="mt-10 grid gap-10 border-t border-cream/15 pt-8 md:grid-cols-2 md:items-end">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-cream-soft">
              {t("caseEyebrow")}
            </span>
            <h4 className="mt-4 font-serif text-[clamp(24px,2.6vw,31px)] leading-[1.2] text-cream">
              {t("caseTitleLine1")}
              <br />
              {t("caseTitleLine2")}
            </h4>
          </div>
          <p className="text-[15.5px] leading-[1.55] text-cream-soft">{t("caseBody")}</p>
        </div>

        <DemoSlot />
      </div>
    </section>
  );
};
