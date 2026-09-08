import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { MarkdownRenderer } from "@/app/_components/custom/markdown-render";
import { locales } from "@/lib/locale-href";
import { getMdxBySlug, getSlugs } from "@/lib/mdx";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getSlugs("projects", locale).map((slug) => ({ locale, slug }))
  );
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
