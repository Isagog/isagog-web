import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";
import { Brain, Database, Server, ShieldCheck } from "lucide-react";

export const Competenze = async () => {
  const t = await getScopedI18n("careers.competenze");

  const skills = [
    { number: "01", icon: <Server size={24} strokeWidth={2} />, title: t("skill1.title"), body: t("skill1.body") },
    { number: "02", icon: <Brain size={24} strokeWidth={2} />, title: t("skill2.title"), body: t("skill2.body") },
    { number: "03", icon: <Database size={24} strokeWidth={2} />, title: t("skill3.title"), body: t("skill3.body") },
    { number: "04", icon: <ShieldCheck size={24} strokeWidth={2} />, title: t("skill4.title"), body: t("skill4.body") },
  ];

  return (
    <section id="competenze" className="scroll-anchor bg-page px-6 py-20">
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
          lead={t("lead")}
        />

        <div className="mt-10 grid gap-x-10 text-[16.5px] leading-[1.6] text-prose-muted md:grid-cols-2">
          <p className="mb-5">{t("p1")}</p>
          <p className="mb-5">{t("p2")}</p>
        </div>

        <div className="mt-6 border-t border-divider pt-7">
          <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.1em] text-sage">
            {t("skillsLabel")}
          </h3>
          <p className="max-w-[800px] text-[16.5px] leading-[1.6] text-prose-muted">
            {t("skillsIntroA")}
            <strong className="font-semibold text-forest">{t("skillsIntroStrong")}</strong>
            {t("skillsIntroB")}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill) => (
              <article
                key={skill.number}
                className="rounded-[5px] border border-card-border bg-paper p-7"
              >
                <span className="block text-forest">{skill.icon}</span>
                <span className="mt-4 block text-[12px] tracking-[0.1em] text-num">
                  {skill.number}
                </span>
                <h4 className="mt-3 font-serif text-[22px] leading-[1.2] text-forest">
                  {skill.title}
                </h4>
                <p className="mt-3 text-[15px] leading-[1.5] text-prose-muted">{skill.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-x-10 text-[16px] leading-[1.6] text-prose-muted md:grid-cols-2">
            <p className="mb-5">
              {t("optionalA")}
              <strong className="font-semibold text-forest">{t("optionalStrong")}</strong>
              {t("optionalB")}
            </p>
            <p className="mb-5">{t("learning")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
