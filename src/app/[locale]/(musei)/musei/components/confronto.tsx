import { SectionHeading } from "@/app/_components/custom/section-heading";
import { cn } from "@/lib/utils";
import { getScopedI18n } from "@/packages/locales/server";

export const Confronto = async () => {
  const t = await getScopedI18n("musei.confronto");

  const columns = [
    { key: "scripted", name: t("scripted.name"), tagline: t("scripted.tagline"), ask: t("scripted.ask"), source: t("scripted.source"), unknown: t("scripted.unknown"), featured: false },
    { key: "generic", name: t("generic.name"), tagline: t("generic.tagline"), ask: t("generic.ask"), source: t("generic.source"), unknown: t("generic.unknown"), featured: false },
    { key: "isagog", name: t("isagog.name"), tagline: t("isagog.tagline"), ask: t("isagog.ask"), source: t("isagog.source"), unknown: t("isagog.unknown"), featured: true },
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

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {columns.map((column) => {
            const rows = [
              { label: t("labelAsk"), value: column.ask },
              { label: t("labelSource"), value: column.source },
              { label: t("labelUnknown"), value: column.unknown },
            ];
            return (
              <article
                key={column.key}
                className={cn(
                  "rounded-[8px] border p-7",
                  column.featured ? "border-visione bg-visione" : "border-card-border bg-paper"
                )}
              >
                <h3 className={cn("font-serif text-[23px] leading-[1.2]", column.featured ? "text-cream" : "text-forest")}>
                  {column.name}
                </h3>
                <p className={cn("mt-1 text-[14.5px] font-semibold", column.featured ? "text-em-dark" : "text-sage")}>
                  {column.tagline}
                </p>
                <dl className="mt-5 space-y-4">
                  {rows.map((row) => (
                    <div key={row.label}>
                      <dt className={cn("text-[11.5px] font-semibold uppercase tracking-[0.08em]", column.featured ? "text-cream-soft" : "text-num")}>
                        {row.label}
                      </dt>
                      <dd className={cn("mt-1 text-[15px] leading-[1.5]", column.featured ? "text-cream" : "text-prose-muted")}>
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
