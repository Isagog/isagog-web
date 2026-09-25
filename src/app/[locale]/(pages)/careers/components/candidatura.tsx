import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";

const APPLICATION_EMAIL = "work@isagog.com";

export const Candidatura = async () => {
  const t = await getScopedI18n("careers.candidatura");

  const terms = [
    { label: t("termModeLabel"), value: t("termMode") },
    { label: t("termPayLabel"), value: t("termPay") },
    { label: t("termHoursLabel"), value: t("termHours") },
  ];
  const items = [t("item1"), t("item2"), t("item3"), t("item4")];
  // encodeURIComponent, not URLSearchParams: see buildMailtoHref in contact-mailto.ts.
  const mailtoHref = `mailto:${APPLICATION_EMAIL}?subject=${encodeURIComponent(t("applySubject"))}`;

  return (
    <section id="candidatura" className="scroll-anchor bg-page px-6 py-20">
      <div className="mx-auto grid max-w-[1224px] items-start gap-12 md:grid-cols-2">
        <div>
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
          <p className="mt-6 max-w-[480px] text-[16px] leading-[1.6] text-prose-muted">{t("p1")}</p>

          <dl className="my-7 max-w-[480px] text-forest">
            {terms.map((term, index) => (
              <div
                key={term.label}
                className={`grid gap-1 py-3 sm:grid-cols-[130px_1fr] sm:gap-4 ${index > 0 ? "border-t border-card-border" : ""}`}
              >
                <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-num sm:pt-[3px]">
                  {term.label}
                </dt>
                <dd className="text-[15px] leading-[1.5]">{term.value}</dd>
              </div>
            ))}
          </dl>

          <p className="max-w-[480px] text-[15px] leading-[1.55] text-prose-muted">{t("p2")}</p>
        </div>

        <div className="rounded-[5px] border border-card-border bg-paper p-7 md:p-9">
          <span className="block text-[12px] font-semibold uppercase tracking-[0.1em] text-forest">
            {t("applyEyebrow")}
          </span>
          <h3 className="mt-4 break-words font-serif text-[clamp(24px,2.6vw,31px)] leading-[1.2] text-forest">
            {t("applyTitle")}
          </h3>
          <p className="mt-4 text-[14px] text-prose-muted">
            {t("applySubjectLabel")}:{" "}
            <span className="font-semibold text-forest">«{t("applySubject")}»</span>
          </p>

          <p className="mt-6 text-[14px] font-semibold text-forest">{t("applyIntro")}</p>
          <ol className="mt-2 list-none p-0 text-forest">
            {items.map((item, index) => (
              <li
                key={item}
                className={`flex items-baseline gap-3 py-3 text-[14.5px] leading-[1.5] ${index > 0 ? "border-t border-card-border" : ""}`}
              >
                <span className="min-w-5 font-serif text-[12px] text-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item}
              </li>
            ))}
          </ol>

          <p className="mt-4 text-[14px] leading-[1.55] text-prose-muted">{t("extra")}</p>

          <a
            href={mailtoHref}
            className="mt-7 inline-flex rounded-[5px] bg-forest-deep px-5 py-3 text-[15px] font-medium text-white"
          >
            {t("mailLink")}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-[1224px] gap-10 border-t border-divider pt-8 md:grid-cols-2">
        <p className="text-[16px] leading-[1.6] text-prose-muted">
          <strong className="font-semibold text-forest">{t("interviewStrong")}</strong>
          {t("interview")}
        </p>
        <p className="font-serif text-[19px] italic leading-[1.5] text-forest">{t("closing")}</p>
      </div>
    </section>
  );
};
