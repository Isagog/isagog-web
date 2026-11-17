import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";

export const Idee = async () => {
  const t = await getScopedI18n("musei.idee");
  const ideas = [
    { title: t("idea1.title"), body: t("idea1.body") },
    { title: t("idea2.title"), body: t("idea2.body") },
    { title: t("idea3.title"), body: t("idea3.body") },
    { title: t("idea4.title"), body: t("idea4.body") },
    { title: t("idea5.title"), body: t("idea5.body") },
    { title: t("idea6.title"), body: t("idea6.body") },
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
        <p className="mt-6 max-w-[680px] text-[16.5px] leading-[1.6] text-prose-muted">{t("lead")}</p>

        <ul className="mt-10 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <li key={idea.title} className="rounded-[8px] border border-dashed border-divider p-6">
              <h3 className="font-serif text-[20px] leading-[1.25] text-forest">{idea.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.55] text-prose-muted">{idea.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
