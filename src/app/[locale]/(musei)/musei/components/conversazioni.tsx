import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";
import { Answer, Question, Steps } from "./chat";

export const Conversazioni = async () => {
  const t = await getScopedI18n("musei.conversazioni");

  return (
    <section id="risposte" className="scroll-anchor bg-page px-6 py-20">
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

        <article className="mt-10 rounded-[8px] border border-card-border bg-paper p-6 md:p-8">
          <h3 className="font-serif text-[24px] leading-[1.2] text-forest">{t("easy.title")}</h3>
          <p className="mt-2 max-w-[640px] text-[15.5px] leading-[1.55] text-prose-muted">{t("easy.body")}</p>
          <div className="mt-6 space-y-3">
            <Question>{t("easy.q")}</Question>
            <div className="grid gap-4 md:grid-cols-2">
              <Answer label={t("easy.labelStandard")}>
                <p>{t("easy.standard1")}</p>
                <p className="mt-2">{t("easy.standard2")}</p>
              </Answer>
              <Answer label={t("easy.labelEasy")}>
                <p>{t("easy.simple1")}</p>
                <p className="mt-2">{t("easy.simple2")}</p>
                <p className="mt-2">{t("easy.simple3")}</p>
              </Answer>
            </div>
          </div>
        </article>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <article className="rounded-[8px] border border-card-border bg-paper p-6 md:p-8">
            <h3 className="font-serif text-[24px] leading-[1.2] text-forest">{t("route.title")}</h3>
            <p className="mt-2 text-[15.5px] leading-[1.55] text-prose-muted">{t("route.body")}</p>
            <div className="mt-6 space-y-3">
              <Question>{t("route.q")}</Question>
              <Answer>
                <Steps steps={[t("route.step1"), t("route.step2"), t("route.step3"), t("route.step4")]} />
              </Answer>
            </div>
          </article>

          <article className="rounded-[8px] border border-card-border bg-paper p-6 md:p-8">
            <h3 className="font-serif text-[24px] leading-[1.2] text-forest">{t("unknown.title")}</h3>
            <p className="mt-2 text-[15.5px] leading-[1.55] text-prose-muted">{t("unknown.body")}</p>
            <div className="mt-6 space-y-3">
              <Question>{t("unknown.q")}</Question>
              <Answer>
                <p>{t("unknown.a1")}</p>
                <p className="mt-2">{t("unknown.a2")}</p>
                <p className="mt-2">{t("unknown.a3")}</p>
              </Answer>
            </div>
          </article>
        </div>

        <p className="mt-5 text-[13px] leading-[1.5] text-num">{t("note")}</p>
      </div>
    </section>
  );
};
