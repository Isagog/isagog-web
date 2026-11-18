import { asset } from "@/lib/base-path";
import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";
import { Answer, Question, Steps } from "./chat";

export const Hero = async () => {
  const t = await getScopedI18n("musei.hero");

  return (
    <section className="relative overflow-hidden bg-visione px-6 py-20 md:py-24">
      <Image
        src={asset("/images/about-images/tree-canopy.png")}
        alt=""
        aria-hidden="true"
        width={400}
        height={500}
        className="pointer-events-none absolute -left-16 bottom-0 hidden h-[300px] w-auto object-contain opacity-10 md:block"
      />
      <div className="relative z-10 mx-auto grid max-w-[1224px] items-center gap-12 md:grid-cols-[1.15fr_1fr]">
        <div>
          <span className="block text-[12px] font-semibold uppercase tracking-[0.1em] text-cream-soft">
            {t("eyebrow")}
          </span>
          <h1 className="mt-5 text-[clamp(34px,4.4vw,52px)] leading-[1.1] text-cream">
            Ogni visitatore ha le <em className="not-italic text-em-dark">sue</em> domande.
            <br />
            Risponde il <em className="not-italic text-em-dark">vostro</em> museo.
          </h1>
          <p className="mt-7 max-w-[560px] text-[17px] leading-[1.6] text-cream-soft">{t("sub")}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#call"
              className="rounded-[5px] bg-terracotta px-5 py-3.5 text-[15px] font-medium text-white"
            >
              {t("ctaPrimary")}
            </a>
            <a
              href="#risposte"
              className="rounded-[5px] border border-cream/30 px-5 py-3.5 text-[15px] text-cream"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>

        <figure className="m-0 rounded-[16px] bg-paper p-5 shadow-2xl md:p-6">
          <div className="space-y-3">
            <Question>{t("q1")}</Question>
            <Answer>{t("a1")}</Answer>
            <Question>{t("q2")}</Question>
            <Answer>
              <Steps steps={[t("a2step1"), t("a2step2"), t("a2step3")]} />
            </Answer>
          </div>
          <figcaption className="mt-4 border-t border-card-border pt-3 text-[12.5px] leading-[1.45] text-num">
            {t("caption")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
