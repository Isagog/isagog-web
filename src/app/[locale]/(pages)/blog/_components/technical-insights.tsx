import { LocaleLink } from "@/app/_components/custom/locale-link";
import { ONTOLOGY_SITE_URL, ontologySiteUrl } from "@/lib/ontology-site";
import { getCurrentLocale, getScopedI18n } from "@/packages/locales/server";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

const CARD_CLASS = "group flex flex-col gap-3 rounded-[5px] border border-card-border bg-paper p-6";

interface Insight {
  /** Other-origin URL, or a locale-agnostic site path such as "/blog/…". */
  href: string;
  external: boolean;
  eyebrow: string;
  title: string;
  description: string;
}

const CardBody = ({ item }: { item: Insight }): ReactNode => (
  <>
    <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-prose-muted">
      {item.eyebrow}
      {item.external && <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />}
    </span>
    <span className="font-serif text-[22px] leading-[1.25] text-forest transition-colors group-hover:text-terracotta">
      {item.title}
    </span>
    <span className="text-[15px] leading-[1.55] text-prose-muted">{item.description}</span>
  </>
);

/**
 * Technical deep dives: resources that live outside the article list — the
 * ontology minisite (another origin, so a plain anchor with an external-link
 * icon) and the on-prem LLM sizing matrix (a page on this site).
 */
export const TechnicalInsights = async () => {
  const t = await getScopedI18n("blog.technical");
  const locale = await getCurrentLocale();

  const items: Insight[] = [
    {
      href: ontologySiteUrl(locale),
      external: true,
      eyebrow: new URL(ONTOLOGY_SITE_URL).host,
      title: t("ontology.title"),
      description: t("ontology.description"),
    },
    {
      href: "/blog/on-prem-llm-sizing",
      external: false,
      eyebrow: t("llmSizing.eyebrow"),
      title: t("llmSizing.title"),
      description: t("llmSizing.description"),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-5">
      {items.map((item) =>
        item.external ? (
          <a key={item.href} href={item.href} className={CARD_CLASS}>
            <CardBody item={item} />
          </a>
        ) : (
          <LocaleLink key={item.href} href={item.href} className={CARD_CLASS}>
            <CardBody item={item} />
          </LocaleLink>
        )
      )}
    </div>
  );
};
