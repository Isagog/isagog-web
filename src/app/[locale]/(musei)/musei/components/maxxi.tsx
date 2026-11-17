import { asset } from "@/lib/base-path";
import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";

export const Maxxi = async () => {
  const t = await getScopedI18n("musei.maxxi");
  const facts = [
    { title: t("fact1.title"), body: t("fact1.body") },
    { title: t("fact2.title"), body: t("fact2.body") },
    { title: t("fact3.title"), body: t("fact3.body") },
  ];

  return (
    <section className="bg-visione px-6 py-20">
      <div className="mx-auto grid max-w-[1224px] items-center gap-12 md:grid-cols-2">
        <div>
          <span className="block text-[12px] font-semibold uppercase tracking-[0.1em] text-cream-soft">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.4vw,39px)] leading-[1.15] text-cream">
            {t("titleLine1")}
            <br />
            <em className="not-italic text-em-dark">{t("titleEm")}</em>
          </h2>
          <p className="mt-6 text-[16.5px] leading-[1.6] text-cream-soft">{t("body")}</p>
          <dl className="mt-8 space-y-5">
            {facts.map((fact) => (
              <div key={fact.title} className="border-t border-cream/20 pt-4">
                <dt className="font-serif text-[20px] leading-[1.25] text-cream">{fact.title}</dt>
                <dd className="mt-1 text-[15px] leading-[1.55] text-cream-soft">{fact.body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Image
          src={asset("/images/project-images/maxxi-museum-interior.jpg")}
          alt={t("imageAlt")}
          width={670}
          height={447}
          className="h-auto w-full rounded-[8px] object-cover"
        />
      </div>
    </section>
  );
};
