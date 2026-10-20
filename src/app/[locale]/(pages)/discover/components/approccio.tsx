import { ConceptText } from "@/app/_components/custom/concept-text";
import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getCurrentLocale, getScopedI18n } from "@/packages/locales/server";
import { FileSearch, Network, Server } from "lucide-react";

export const Approccio = async () => {
  const t = await getScopedI18n("discover.approccio");
  const locale = await getCurrentLocale();

  const items = [
    { icon: <Network size={24} strokeWidth={2} />, title: t("item1.title"), body: t("item1.body") },
    { icon: <FileSearch size={24} strokeWidth={2} />, title: t("item2.title"), body: t("item2.body") },
    { icon: <Server size={24} strokeWidth={2} />, title: t("item3.title"), body: t("item3.body") },
  ];

  return (
    <section className="bg-tecnologia px-6 py-20">
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

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-[5px] border border-card-border bg-paper p-7">
              <span className="block text-forest">{item.icon}</span>
              <h3 className="mt-5 font-serif text-[22px] leading-[1.2] text-forest">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.55] text-prose-muted">
                <ConceptText text={item.body} locale={locale} />
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
