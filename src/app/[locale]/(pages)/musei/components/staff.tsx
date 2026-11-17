import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";

export const Staff = async () => {
  const t = await getScopedI18n("musei.staff");
  const steps = [
    { title: t("step1.title"), body: t("step1.body") },
    { title: t("step2.title"), body: t("step2.body") },
    { title: t("step3.title"), body: t("step3.body") },
    { title: t("step4.title"), body: t("step4.body") },
  ];

  return (
    <section className="bg-persone px-6 py-20">
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

        <ol className="mt-10 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t border-divider pt-6">
              <span className="font-serif text-[12px] text-num">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 mb-3 font-serif text-[21px] leading-[1.25] text-forest">{step.title}</h3>
              <p className="text-[15.5px] leading-[1.6] text-prose-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-[760px] text-[16.5px] font-semibold leading-[1.55] text-forest">{t("support")}</p>
      </div>
    </section>
  );
};
