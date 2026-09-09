import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

export const Tecnologia = async () => {
  const t = await getScopedI18n("home.tecnologia");

  return (
    <section id="tecnologia" className="scroll-anchor bg-tecnologia px-6 py-20">
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

        <div className="mb-10 border-t border-divider pt-7">
          <span className="mb-5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-sage">
            {t("usecasesLabel")}
          </span>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-2 font-serif text-[18px] text-forest">{t("uc1.title")}</h4>
              <p className="text-[14.5px] leading-[1.5] text-prose-muted">{t("uc1.body")}</p>
            </div>
            <div>
              <h4 className="mb-2 font-serif text-[18px] text-forest">{t("uc2.title")}</h4>
              <p className="text-[14.5px] leading-[1.5] text-prose-muted">{t("uc2.body")}</p>
            </div>
            <div>
              <h4 className="mb-2 font-serif text-[18px] text-forest">{t("uc3.title")}</h4>
              <p className="text-[14.5px] leading-[1.5] text-prose-muted">{t("uc3.body")}</p>
            </div>
            <div>
              <h4 className="mb-2 font-serif text-[18px] text-forest">{t("uc4.title")}</h4>
              <p className="text-[14.5px] leading-[1.5] text-prose-muted">{t("uc4.body")}</p>
            </div>
          </div>
          <p className="mt-7 max-w-[800px] text-[16px] leading-[1.55] text-prose-muted">
            {t("usecasesClose")}
          </p>
        </div>

        <div className="my-9 grid gap-8 md:grid-cols-3">
          <article className="border-t border-divider pt-6">
            <h4 className="mb-3 font-serif text-[24px] text-forest">{t("ctrl1.title")}</h4>
            <p className="text-[16px] text-prose-muted">{t("ctrl1.body")}</p>
          </article>
          <article className="border-t border-divider pt-6">
            <h4 className="mb-3 font-serif text-[24px] text-forest">{t("ctrl2.title")}</h4>
            <p className="text-[16px] text-prose-muted">{t("ctrl2.body")}</p>
          </article>
          <article className="border-t border-divider pt-6">
            <h4 className="mb-3 font-serif text-[24px] text-forest">{t("ctrl3.title")}</h4>
            <p className="text-[16px] text-prose-muted">{t("ctrl3.body")}</p>
          </article>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-divider pt-6">
          <span className="flex items-center gap-2 text-[14px] text-forest">
            <ShieldCheck size={18} strokeWidth={2} />
            {t("badge")}
          </span>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 rounded-[5px] bg-forest-deep px-5 py-3.5 text-[15px] font-medium text-white"
          >
            {t("cta")}
            <ArrowUpRight size={18} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
};
