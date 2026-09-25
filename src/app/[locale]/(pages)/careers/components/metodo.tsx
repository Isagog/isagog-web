import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";

export const Metodo = async () => {
  const t = await getScopedI18n("careers.metodo");

  const steps = [
    { number: "01", title: t("step1.title"), body: t("step1.body") },
    { number: "02", title: t("step2.title"), body: t("step2.body") },
    { number: "03", title: t("step3.title"), body: t("step3.body") },
    { number: "04", title: t("step4.title"), body: t("step4.body") },
  ];

  return (
    <section id="metodo" className="scroll-anchor bg-tecnologia px-6 py-20">
      <div className="mx-auto max-w-[1224px]">
        <SectionHeading
          as="h2"
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("titleLine1")}
              <br />
              <em className="not-italic text-sage">{t("titleEm")}</em>
            </>
          }
        />

        <p className="mt-10 max-w-[800px] text-[16.5px] leading-[1.6] text-prose-muted">
          {t("intro")}
        </p>

        <ol className="mt-8 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="border-t border-divider pt-6">
              <span className="font-serif text-[12px] text-num">{step.number}</span>
              <h3 className="mt-2 mb-3 font-serif text-[21px] leading-[1.25] text-forest">
                {step.title}
              </h3>
              <p className="text-[15px] leading-[1.55] text-prose-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-10 border-t border-divider pt-8 md:grid-cols-2">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-sage">
              {t("aiEyebrow")}
            </span>
            <h3 className="mt-4 font-serif text-[clamp(24px,2.6vw,31px)] leading-[1.2] text-forest">
              {t("aiTitleLine1")}
              <br />
              <em className="not-italic text-sage">{t("aiTitleEm")}</em>
            </h3>
          </div>
          <div className="text-[16px] leading-[1.6] text-prose-muted">
            <p className="mb-5">
              {t("aiP1a")}
              <strong className="font-semibold text-forest">{t("aiP1Strong")}</strong>
              {t("aiP1b")}
            </p>
            <p className="mb-5">{t("aiP2")}</p>
            <p className="font-serif text-[18px] italic leading-[1.5] text-forest">
              {t("aiClosing")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
