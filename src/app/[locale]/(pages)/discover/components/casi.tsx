import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";

export const Casi = async () => {
  const t = await getScopedI18n("discover.casi");

  const cases = [
    { slug: "maxxi-case-study", tag: t("maxxi.tag"), title: t("maxxi.title"), body: t("maxxi.body") },
    { slug: "manifesto-case-study", tag: t("manifesto.tag"), title: t("manifesto.title"), body: t("manifesto.body") },
    { slug: "teleperformance-case-study", tag: t("voicefirst.tag"), title: t("voicefirst.title"), body: t("voicefirst.body") },
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
          {cases.map((item) => (
            <article
              key={item.slug}
              className="flex flex-col rounded-[5px] border border-card-border bg-paper p-7"
            >
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-sage">
                {item.tag}
              </span>
              <h3 className="mt-3 font-serif text-[26px] leading-[1.2] text-forest">{item.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-[1.55] text-prose-muted">{item.body}</p>
              <Link
                href={`/project/${item.slug}`}
                className="mt-6 text-[14px] font-semibold text-forest"
              >
                {t("readCase")}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
