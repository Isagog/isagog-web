import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";
import { ContactForm } from "./contact-form";

const TREES = [
  { src: "/images/about-images/tree-pine.png", className: "-left-8 h-[280px]" },
  {
    src: "/images/about-images/tree-cypress.png",
    className: "left-[16%] h-[200px] hidden min-[760px]:block",
  },
  {
    src: "/images/about-images/tree-bushy.png",
    className: "right-[16%] h-[190px] hidden min-[760px]:block",
  },
  { src: "/images/about-images/tree-palm.png", className: "-right-6 h-[300px]" },
] as const;

export const Contatto = async () => {
  const t = await getScopedI18n("home.contatto");

  return (
    <section id="contatto" className="scroll-anchor relative overflow-hidden bg-page px-6 py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {TREES.map((tree) => (
          <Image
            key={tree.src}
            src={tree.src}
            alt=""
            width={400}
            height={500}
            className={`absolute bottom-0 w-auto object-contain opacity-10 ${tree.className}`}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1224px] items-start gap-12 md:grid-cols-2">
        <div>
          <span className="block max-w-[400px] text-[12px] font-semibold uppercase tracking-[0.1em] text-forest">
            {t("eyebrow")}
          </span>
          <h3 className="mt-4 text-[clamp(28px,3.4vw,39px)] leading-[1.15] text-forest">
            {t("titleLine1")}
            <br />
            {t("titleLine2")} <em className="not-italic text-sage">{t("titleEm")}</em>
          </h3>
          <p className="mt-6 max-w-[425px] text-[16px] text-prose-muted">{t("p1")}</p>
          <p className="mt-6 max-w-[425px] text-[16px] text-prose-muted">
            <strong className="font-bold text-forest">{t("p2Strong")}</strong>
            <br />
            {t("p2")}
          </p>

          <ol className="my-7 list-none p-0 text-forest">
            <li className="flex items-baseline gap-3 py-3 text-[14px]">
              <span className="min-w-5 font-serif text-[12px] text-num">01</span>
              {t("step1")}
            </li>
            <li className="flex items-baseline gap-3 border-t border-card-border py-3 text-[14px]">
              <span className="min-w-5 font-serif text-[12px] text-num">02</span>
              {t("step2")}
            </li>
            <li className="flex items-baseline gap-3 border-t border-card-border py-3 text-[14px]">
              <span className="min-w-5 font-serif text-[12px] text-num">03</span>
              {t("step3")}
            </li>
          </ol>

          <a
            href="mailto:info@isagog.com"
            className="inline-flex items-center gap-1.5 py-2 text-[14px] font-semibold text-forest"
          >
            {t("mailLink")}
          </a>
        </div>

        <ContactForm />
      </div>
    </section>
  );
};
