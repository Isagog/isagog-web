import { asset } from "@/lib/base-path";
import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";

export const Persone = async () => {
  const t = await getScopedI18n("home.persone");

  return (
    <section id="persone" className="scroll-anchor bg-persone px-6 py-20">
      <div className="mx-auto max-w-[1224px]">
        <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-forest">
          {t("eyebrow")}
        </span>
        <h3 className="mt-4 text-[clamp(28px,3.4vw,39px)] leading-[1.15] text-forest">
          {t("titleLine1")}
          <br />
          <em className="not-italic text-sage">{t("titleEm")}</em>
        </h3>
        <p className="mt-5 max-w-[640px] text-[19px] leading-[1.5] text-forest/85">{t("lead")}</p>

        <div className="mt-10 grid gap-9 md:grid-cols-2">
          <div className="flex items-start gap-6">
            <Image
              src={asset("/images/team-images/Guido.avif")}
              alt={t("guido.name")}
              width={240}
              height={240}
              className="h-[120px] w-[120px] shrink-0 rounded-[4px] object-cover"
            />
            <div>
              <h4 className="font-serif text-[23px] text-forest">{t("guido.name")}</h4>
              <p className="mt-1.5 mb-3 text-[13.5px] font-semibold leading-[1.4] text-sage">
                {t("guido.role")}
              </p>
              <p className="text-[15px] leading-[1.55] text-muted-ink">{t("guido.bio")}</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Image
              src={asset("/images/team-images/Robert.avif")}
              alt={t("robert.name")}
              width={240}
              height={240}
              className="h-[120px] w-[120px] shrink-0 rounded-[4px] object-cover"
            />
            <div>
              <h4 className="font-serif text-[23px] text-forest">{t("robert.name")}</h4>
              <p className="mt-1.5 mb-3 text-[13.5px] font-semibold leading-[1.4] text-sage">
                {t("robert.role")}
              </p>
              <p className="text-[15px] leading-[1.55] text-muted-ink">{t("robert.bio")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
