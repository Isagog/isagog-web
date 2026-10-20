import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";

export const Settori = async () => {
  const t = await getScopedI18n("discover.settori");

  const sectors = [
    { title: t("cultura.title"), body: t("cultura.body") },
    { title: t("pa.title"), body: t("pa.body") },
    { title: t("sanita.title"), body: t("sanita.body") },
    { title: t("editoria.title"), body: t("editoria.body") },
    { title: t("enti.title"), body: t("enti.body") },
    { title: t("altro.title"), body: t("altro.body") },
  ];

  return (
    <section className="bg-persone px-6 py-20">
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

        <dl className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector) => (
            <div key={sector.title} className="border-t border-divider py-6">
              <dt className="font-serif text-[21px] leading-[1.25] text-forest">{sector.title}</dt>
              <dd className="mt-2 text-[15px] leading-[1.55] text-prose-muted">{sector.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
