import { CapabilityCard } from "@/app/_components/custom/capability-card";
import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";
import { Brain, Database, ScanText } from "lucide-react";

export const Metodologia = async () => {
  const t = await getScopedI18n("home.metodologia");

  const capabilities = [
    { number: "01", key: "cap1", icon: <ScanText size={24} strokeWidth={2} /> },
    { number: "02", key: "cap2", icon: <Database size={24} strokeWidth={2} /> },
    { number: "03", key: "cap3", icon: <Brain size={24} strokeWidth={2} /> },
  ] as const;

  return (
    <section id="metodologia" className="scroll-anchor bg-page px-6 py-20">
      <div className="mx-auto max-w-[1224px]">
        <SectionHeading
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

        <div className="grid gap-6 md:grid-cols-3">
          <CapabilityCard
            number="01"
            icon={capabilities[0].icon}
            title={t("cap1.title")}
            body={t("cap1.body")}
            result={t("cap1.result")}
          />
          <CapabilityCard
            number="02"
            icon={capabilities[1].icon}
            title={t("cap2.title")}
            body={t("cap2.body")}
            result={t("cap2.result")}
          />
          <CapabilityCard
            number="03"
            icon={capabilities[2].icon}
            title={t("cap3.title")}
            body={t("cap3.body")}
            result={t("cap3.result")}
          />
        </div>

        <p className="mt-9 max-w-[800px] font-serif text-[19px] italic leading-[1.5] text-forest">
          {t("closing")}
        </p>
      </div>
    </section>
  );
};
