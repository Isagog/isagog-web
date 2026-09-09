import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { MarkdownRenderer } from "@/app/_components/custom/markdown-render";
import { locales } from "@/lib/locale-href";
import { extractHeading, getMdxBySlug, getSlugs } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getSlugs("projects", locale).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("meta");
  const post = await getMdxBySlug(slug, "projects", locale);
  const title = (post && extractHeading(post.content)) ?? t("project.title");

  return buildPageMetadata({
    locale,
    path: `/project/${slug}`,
    title,
    description: t("project.description"),
  });
}

const ProjectPostPage = async ({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) => {
  const { slug, locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("project");
  const post = await getMdxBySlug(slug, "projects", locale);

  if (post === null) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl text-forest">{t("notFound")}</h1>
        <Link href="/project" className="text-terracotta">
          {t("backToProjects")}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[780px] px-6 py-16">
      <MarkdownRenderer content={post.content} />
    </main>
  );
};

export default ProjectPostPage;
