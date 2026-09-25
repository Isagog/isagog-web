import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";

export const Invito = async () => {
  const t = await getScopedI18n("careers.invito");
  const facts = [t("factRemote"), t("factContract"), t("factPay")];

  return (
    <section id="lavora-con-noi" className="scroll-anchor bg-visione px-6 py-20">
      <div className="mx-auto max-w-[1224px]">
        <SectionHeading
          as="h1"
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

        <ul aria-label={t("factsLabel")} className="mt-10 flex flex-wrap gap-3">
          {facts.map((fact) => (
            <li
              key={fact}
              className="rounded-[5px] border border-cream/25 px-4 py-2 text-[14px] font-medium text-cream"
            >
              {fact}
            </li>
          ))}
        </ul>

        <div className="mt-12 border-t border-cream/15 pt-8">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-cream-soft">
            {t("whyLabel")}
          </h2>
          <div className="mt-6 grid gap-x-10 text-[16.5px] leading-[1.6] text-cream-soft md:grid-cols-3">
            <p className="mb-5">{t("why1")}</p>
            <p className="mb-5">{t("why2")}</p>
            <p className="mb-5">{t("why3")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
