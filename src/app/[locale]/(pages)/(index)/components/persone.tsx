import { asset } from "@/lib/base-path";
import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";

export const Persone = async () => {
  const t = await getScopedI18n("home.persone");

  return (
    <section id="persone" aria-labelledby="persone-title" className="scroll-anchor min-w-0 border-t border-divider pt-8 min-[900px]:col-start-1 min-[900px]:row-start-2">
      <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-forest">
        {t("eyebrow")}
      </span>
      <h2 id="persone-title" className="mt-3 text-[30px] leading-[1.15] text-forest">
        {t("titleLine1")}
        <br />
        <em className="not-italic text-sage">{t("titleEm")}</em>
      </h2>
      <div className="mt-8 grid gap-8">
        <article className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-5 gap-y-4 sm:grid-cols-[112px_minmax(0,1fr)]">
          <Image
            src={asset("/images/team-images/Guido.avif")}
            alt={t("guido.name")}
            width={240}
            height={240}
            className="h-24 w-24 rounded-[4px] object-cover sm:h-28 sm:w-28"
          />
          <div>
            <h3 className="font-serif text-[23px] leading-tight text-forest">{t("guido.name")}</h3>
            <p className="mt-2 text-[14px] font-medium leading-[1.4] text-sage">
              {t("guido.role")}
            </p>
          </div>
          <p className="col-span-2 text-[16px] leading-[1.6] text-muted-ink">{t("guido.bio")}</p>
        </article>

        <article className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-5 gap-y-4 sm:grid-cols-[112px_minmax(0,1fr)]">
          <Image
            src={asset("/images/team-images/Robert.avif")}
            alt={t("robert.name")}
            width={240}
            height={240}
            className="h-24 w-24 rounded-[4px] object-cover sm:h-28 sm:w-28"
          />
          <div>
            <h3 className="font-serif text-[23px] leading-tight text-forest">{t("robert.name")}</h3>
            <p className="mt-2 text-[14px] font-medium leading-[1.4] text-sage">
              {t("robert.role")}
            </p>
          </div>
          <p className="col-span-2 text-[16px] leading-[1.6] text-muted-ink">{t("robert.bio")}</p>
        </article>
      </div>
    </section>
  );
};
