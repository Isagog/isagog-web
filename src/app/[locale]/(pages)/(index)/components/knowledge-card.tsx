import { LocaleLink } from "@/app/_components/custom/locale-link";
import { getScopedI18n } from "@/packages/locales/server";
import { ArrowUpRight, Check, Network, Palette, User } from "lucide-react";

const Node = ({
  kind,
  name,
  variant = "plain",
}: {
  kind?: string;
  name: string;
  variant?: "plain" | "origin" | "person";
}) => (
  <div
    className={
      variant === "origin"
        ? "flex items-center gap-3 rounded-[5px] bg-forest px-5 py-4 text-cream"
        : variant === "person"
          ? "flex items-center gap-3 rounded-[5px] border border-card-border bg-persone px-4 py-3 text-forest"
          : "flex items-center gap-3 rounded-[5px] border border-card-border bg-paper px-4 py-3 text-forest"
    }
  >
    {variant === "person" ? (
      <User size={16} strokeWidth={2} />
    ) : variant === "origin" ? (
      <Network size={19} strokeWidth={2} />
    ) : (
      <Palette size={17} strokeWidth={2} />
    )}
    <span className="flex flex-col leading-tight">
      {kind !== undefined && (
        <small className="text-[11px] uppercase tracking-[0.08em] opacity-70">{kind}</small>
      )}
      <strong className="font-serif text-[18px] font-normal">{name}</strong>
    </span>
  </div>
);

const Edge = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center py-2 text-[13px] text-sage">
    <span>{label}</span>
    <span aria-hidden="true">↓</span>
  </div>
);

export const KnowledgeCard = async () => {
  const t = await getScopedI18n("home.card");

  return (
    <div className="rounded-[8px] bg-tecnologia p-6 sm:p-8">
      <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.1em] text-forest">
        <span className="flex items-center gap-2">
          <Network size={18} strokeWidth={2} />
          {t("org")}
        </span>
        <span className="text-num">{t("sample")}</span>
      </div>

      <div className="mt-8">
        <span className="text-[12px] uppercase tracking-[0.1em] text-num">
          {t("questionLabel")}
        </span>
        <p className="mt-3 font-serif text-[clamp(24px,2.6vw,31px)] leading-[1.2] text-forest">
          {t("questionLine1")}
          <br />
          {t("questionLine2")}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <Node kind={t("originKind")} name={t("originName")} variant="origin" />
        <Edge label={t("edgeComprende")} />
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col">
            <Node kind={t("workKind")} name={t("work1")} />
            <Edge label={t("edgeRealizzata")} />
            <Node name={t("author1")} variant="person" />
          </div>
          <div className="flex flex-col">
            <Node kind={t("workKind")} name={t("work2")} />
            <Edge label={t("edgeRealizzata")} />
            <Node name={t("author2")} variant="person" />
          </div>
        </div>
      </div>

      <LocaleLink
        href="/approach"
        className="mt-8 flex items-center gap-4 rounded-[5px] bg-paper px-5 py-4 text-forest"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-persone">
          <Check size={15} strokeWidth={2} />
        </span>
        <span className="flex flex-1 flex-col">
          <strong className="text-[16px]">{t("answerTitle")}</strong>
          <span className="text-[14px] text-prose-muted">{t("answerLink")}</span>
        </span>
        <ArrowUpRight size={20} strokeWidth={2} />
      </LocaleLink>

      <p className="mt-4 text-[13px] text-prose-muted">{t("disclaimer")}</p>
    </div>
  );
};
