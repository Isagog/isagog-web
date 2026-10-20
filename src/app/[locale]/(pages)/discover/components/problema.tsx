import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";

export const Problema = async () => {
  const t = await getScopedI18n("discover.problema");

  const items = [
    { number: "01", title: t("item1.title"), body: t("item1.body") },
    { number: "02", title: t("item2.title"), body: t("item2.body") },
    { number: "03", title: t("item3.title"), body: t("item3.body") },
  ];

  return (
    <section className="bg-page px-6 py-20">
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

        <ol className="mt-10 grid list-none gap-8 p-0 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.number} className="border-t border-divider pt-6">
              <span className="font-serif text-[12px] text-num">{item.number}</span>
              <h3 className="mt-2 mb-3 font-serif text-[21px] leading-[1.25] text-forest">
                {item.title}
              </h3>
              <p className="text-[15.5px] leading-[1.6] text-prose-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
