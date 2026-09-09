import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { getScopedI18n } from "@/packages/locales/server";
import { KnowledgeDemo } from "./knowledge-demo/knowledge-demo";
import { Persone } from "./persone";

export const Apertura = async () => {
  const t = await getScopedI18n("home.apertura");

  return (
    <section className="bg-page px-6 py-16">
      <div className="mx-auto grid max-w-[1224px] items-start gap-x-12 gap-y-14 min-[900px]:grid-cols-2 min-[900px]:grid-rows-[auto_1fr]">
        <div className="min-w-0">
          <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-forest">
            <span className="h-2 w-2 rounded-full bg-terracotta" aria-hidden="true" />
            {t("eyebrow")}
          </span>
          <h2 className="mt-6 text-[clamp(32px,4vw,46px)] leading-[1.15] text-forest">
            {t("titleLine1")}
            <br />
            <em className="not-italic text-sage">{t("titleEm")}</em>
            <br />
            {t("titleLine2")}
          </h2>
          <p className="mt-6 max-w-[520px] text-[16.5px] leading-[1.6] text-prose-muted">
            {t("sub")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-[5px] bg-forest-deep px-5 py-3.5 text-[15px] font-medium text-white"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/approach"
              className="rounded-[5px] border border-forest/25 px-5 py-3.5 text-[15px] text-forest"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        <div className="min-w-0 min-[900px]:col-start-2 min-[900px]:row-span-2 min-[900px]:row-start-1">
          <KnowledgeDemo />
        </div>
        <Persone />
      </div>
    </section>
  );
};
