"use client";

import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { asset } from "@/lib/base-path";
import { fetchArticles } from "@/packages/action/articles/article.action";
import { useScopedI18n } from "@/packages/locales/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export const BlogCard = () => {
  const t = useScopedI18n("blog");
  const {
    data: articles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-5">
        {[0, 1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="h-44 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-[15px] text-prose-muted">{t("loadError")}</p>;
  }

  return (
    <div className="flex w-full flex-col gap-5">
      {articles?.map((article) => (
        <Link
          key={article.slug}
          href={`/blog/${article.slug}`}
          className="group flex flex-col overflow-hidden rounded-[5px] border border-card-border bg-paper sm:flex-row"
        >
          <Image
            src={asset(article.image)}
            alt={article.title}
            width={352}
            height={352}
            className="h-44 w-full shrink-0 object-cover sm:w-44"
          />
          <span className="flex w-full items-center p-6">
            <span className="font-serif text-[22px] leading-[1.25] text-forest transition-colors group-hover:text-terracotta">
              {article.title}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
};
