import { LocaleLink } from "@/app/_components/custom/locale-link";
import { getScopedI18n } from "@/packages/locales/server";
import { ArrowUpRight } from "lucide-react";

interface TeaserCardProps {
  href: string;
  title: string;
  body: string;
  className?: string;
}

const TeaserCard = ({ href, title, body, className }: TeaserCardProps) => (
  <LocaleLink
    href={href}
    className={`group flex flex-col justify-between gap-6 rounded-[5px] border border-card-border bg-paper p-7 transition-colors hover:border-forest/30 ${className ?? ""}`}
  >
    <div>
      <h3 className="font-serif text-[22px] leading-[1.2] text-forest transition-colors group-hover:text-terracotta">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-[1.55] text-prose-muted">{body}</p>
    </div>
    <ArrowUpRight
      size={20}
      strokeWidth={2}
      className="text-forest transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  </LocaleLink>
);

export const Teasers = async () => {
  const nav = await getScopedI18n("nav");
  const t = await getScopedI18n("home.teasers");

  return (
    <section className="bg-page px-6 py-16">
      <div className="mx-auto grid max-w-[1224px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
        <TeaserCard
          href="/approach"
          title={nav("approach")}
          body={t("approach")}
          className="lg:col-span-2"
        />
        <TeaserCard
          href="/platform"
          title={nav("platform")}
          body={t("platform")}
          className="lg:col-span-2"
        />
        <TeaserCard
          href="/project"
          title={nav("project")}
          body={t("project")}
          className="lg:col-span-2"
        />
        <TeaserCard
          href="/blog"
          title={nav("blog")}
          body={t("blog")}
          className="lg:col-span-3"
        />
        <TeaserCard
          href="/about"
          title={nav("about")}
          body={t("about")}
          className="lg:col-span-3"
        />
      </div>
    </section>
  );
};
