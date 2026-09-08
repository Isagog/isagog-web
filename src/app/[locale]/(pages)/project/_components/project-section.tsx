"use client";

import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { asset } from "@/lib/base-path";
import { fetchProjects } from "@/packages/action/projects/project.action";
import { useCurrentLocale } from "@/packages/locales/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export const ProjectSection = () => {
  const locale = useCurrentLocale();
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", locale],
    queryFn: () => fetchProjects(locale),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-12">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex flex-col gap-6 md:flex-row">
            <Skeleton className="h-64 w-full md:w-[320px]" />
            <div className="flex w-full flex-col gap-4">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-14">
      {projects?.map((project) => (
        <article
          key={project.slug}
          className="flex flex-col gap-8 rounded-[5px] border border-card-border bg-paper p-7 md:flex-row"
        >
          <Image
            src={asset(project.image)}
            alt={project.title}
            width={640}
            height={480}
            className="h-64 w-full shrink-0 rounded-[4px] object-cover md:w-[320px]"
          />
          <div className="flex flex-col">
            <h2 className="font-serif text-[28px] text-forest">{project.title}</h2>
            <p className="mt-1 text-[13.5px] font-semibold uppercase tracking-[0.08em] text-sage">
              {project.secondTitle}
            </p>
            <p className="mt-4 text-[16px] leading-[1.6] text-prose-muted">
              {project.description}
            </p>
            <dl className="mt-6 flex flex-wrap gap-8 text-[13px] text-num">
              <div>
                <dt className="uppercase tracking-[0.08em]">{project.valueName}</dt>
                <dd className="mt-1 font-serif text-[18px] text-forest">{project.value}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.08em]">{project.name}</dt>
                <dd className="mt-1 font-serif text-[18px] text-forest">{project.sector}</dd>
              </div>
            </dl>
            <Link
              href={`/project/${project.slug}`}
              className="mt-6 inline-flex w-fit items-center gap-2 text-[15px] font-semibold text-terracotta"
            >
              {project.title} →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};
