import { asset } from "@/lib/base-path";
import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";
import { ContactForm } from "../../contact/components/contact-form";

const TREES = [
  { src: "/images/about-images/tree-cypress.png", className: "-left-6 h-[260px]" },
  { src: "/images/about-images/tree-bushy.png", className: "-right-6 h-[220px]" },
] as const;

export const Call = async () => {
  const t = await getScopedI18n("discover.call");
  const steps = [t("step1"), t("step2"), t("step3")];

  return (
    <section id="call" className="scroll-anchor relative overflow-hidden bg-page px-6 py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {TREES.map((tree) => (
          <Image
            key={tree.src}
            src={asset(tree.src)}
            alt=""
            width={400}
            height={500}
            className={`absolute bottom-0 w-auto object-contain opacity-10 ${tree.className}`}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1224px] items-start gap-12 md:grid-cols-2">
        <div>
          <span className="block text-[12px] font-semibold uppercase tracking-[0.1em] text-forest">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.4vw,39px)] leading-[1.15] text-forest">
            {t("titleLine1")}
            <br />
            <em className="not-italic text-sage">{t("titleEm")}</em>
          </h2>
          <p className="mt-6 max-w-[440px] text-[16px] leading-[1.6] text-prose-muted">{t("p1")}</p>

          <h3 className="mt-8 text-[12px] font-semibold uppercase tracking-[0.1em] text-sage">
            {t("stepsLabel")}
          </h3>
          <ol className="mt-2 list-none p-0 text-forest">
            {steps.map((step, index) => (
              <li
                key={step}
                className={`flex items-baseline gap-3 py-3 text-[14.5px] ${index > 0 ? "border-t border-card-border" : ""}`}
              >
                <span className="min-w-5 font-serif text-[12px] text-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <ContactForm
          copy={{
            formTitle: t("formTitle"),
            formSub: t("formSub"),
            fieldMessage: t("fieldMessage"),
            fieldMessagePlaceholder: t("fieldMessagePlaceholder"),
            mailSubject: t("mailSubject"),
          }}
        />
      </div>
    </section>
  );
};
