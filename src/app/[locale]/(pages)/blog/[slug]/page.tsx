import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { MarkdownRenderer } from "@/app/_components/custom/markdown-render";
import { locales } from "@/lib/locale-href";
import { extractHeading, getMdxBySlug, getSlugs } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => getSlugs("articles").map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("meta");
  const post = await getMdxBySlug(slug, "articles");
  const title = (post && extractHeading(post.content)) ?? t("blog.title");

  return buildPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title,
    description: t("blog.description"),
  });
}

const BlogPostPage = async ({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) => {
  const { slug, locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("blog");
  const post = await getMdxBySlug(slug, "articles");

  if (post === null) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl text-forest">{t("notFound")}</h1>
        <Link href="/blog" className="text-terracotta">
          {t("backToBlog")}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[780px] px-6 py-16">
      <MarkdownRenderer
        content={post.content}
        imageClassName="mx-auto h-auto max-h-[70vh] w-auto rounded-[8px] object-contain"
      />
    </main>
  );
};

export default BlogPostPage;
