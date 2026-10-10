import { ONTOLOGY_SITE_URL, ontologySiteUrl } from "@/lib/ontology-site";
import { getCurrentLocale, getScopedI18n } from "@/packages/locales/server";
import { ArrowUpRight } from "lucide-react";

/**
 * Technical deep dives: resources that live outside the article list, such
 * as the ontology minisite. Links to other origins, so plain anchors.
 */
export const TechnicalInsights = async () => {
  const t = await getScopedI18n("blog.technical");
  const locale = await getCurrentLocale();

  const items = [
    {
      href: ontologySiteUrl(locale),
      host: new URL(ONTOLOGY_SITE_URL).host,
      title: t("ontology.title"),
      description: t("ontology.description"),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-5">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="group flex flex-col gap-3 rounded-[5px] border border-card-border bg-paper p-6"
        >
          <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-prose-muted">
            {item.host}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span className="font-serif text-[22px] leading-[1.25] text-forest transition-colors group-hover:text-terracotta">
            {item.title}
          </span>
          <span className="text-[15px] leading-[1.55] text-prose-muted">{item.description}</span>
        </a>
      ))}
    </div>
  );
};
