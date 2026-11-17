import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";
import { Compass, Globe, Landmark, MessageCircleHeart, Sparkles, Ticket } from "lucide-react";

export const Agenti = async () => {
  const t = await getScopedI18n("musei.agenti");

  const items = [
    { icon: Compass, title: t("item1.title"), body: t("item1.body"), example: t("item1.example") },
    { icon: Landmark, title: t("item2.title"), body: t("item2.body"), example: t("item2.example") },
    { icon: Ticket, title: t("item3.title"), body: t("item3.body"), example: t("item3.example") },
    { icon: Sparkles, title: t("item4.title"), body: t("item4.body"), example: t("item4.example") },
    { icon: MessageCircleHeart, title: t("item5.title"), body: t("item5.body"), example: t("item5.example") },
    { icon: Globe, title: t("item6.title"), body: t("item6.body"), example: t("item6.example") },
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
        <p className="mt-6 max-w-[680px] text-[16.5px] leading-[1.6] text-prose-muted">{t("lead")}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, body, example }) => (
            <article key={title} className="flex flex-col rounded-[8px] border border-card-border bg-paper p-7">
              <Icon size={24} strokeWidth={1.8} aria-hidden="true" className="text-olive" />
              <h3 className="mt-4 font-serif text-[22px] leading-[1.2] text-forest">{title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-[1.55] text-prose-muted">{body}</p>
              <p className="mt-5 border-t border-card-border pt-4 text-[14px] italic leading-[1.45] text-forest">
                {example}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
