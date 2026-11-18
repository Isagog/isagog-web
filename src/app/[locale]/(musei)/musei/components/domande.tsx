import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";

export const Domande = async () => {
  const t = await getScopedI18n("musei.domande");
  const faqs = [
    { q: t("faq1.q"), a: t("faq1.a") },
    { q: t("faq2.q"), a: t("faq2.a") },
    { q: t("faq3.q"), a: t("faq3.a") },
    { q: t("faq4.q"), a: t("faq4.a") },
    { q: t("faq5.q"), a: t("faq5.a") },
    { q: t("faq6.q"), a: t("faq6.a") },
  ];

  return (
    <section className="bg-tecnologia px-6 py-20">
      <div className="mx-auto max-w-[860px]">
        <SectionHeading
          as="h2"
          eyebrow={t("eyebrow")}
          title={<em className="not-italic text-forest">{t("title")}</em>}
        />
        <div className="mt-8 border-b border-divider">
          {faqs.map((faq) => (
            <details key={faq.q} className="group border-t border-divider py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[20px] leading-[1.3] text-forest">
                {faq.q}
                <span aria-hidden="true" className="text-[22px] text-olive transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[740px] text-[15.5px] leading-[1.6] text-prose-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
