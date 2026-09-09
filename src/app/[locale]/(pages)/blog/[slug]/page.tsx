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

  // getSlugs("articles") returns the five article filenames in the same
  // order as public/articles-data/list.json (the order the /blog index
  // renders them in), so walking to the following slug here lines up with
  // what the reader saw on the index. The last article has no successor —
  // slugs[currentIndex + 1] is undefined there — so it renders the
  // back-link only rather than wrapping around to the first article.
  const slugs = getSlugs("articles");
  const currentIndex = slugs.indexOf(slug);
  const nextSlug = currentIndex === -1 ? undefined : slugs[currentIndex + 1];
  const nextPost = nextSlug ? await getMdxBySlug(nextSlug, "articles") : null;
  const nextTitle = nextPost ? extractHeading(nextPost.content) : null;
  const nextArticle = nextSlug && nextTitle ? { slug: nextSlug, title: nextTitle } : null;

  return (
    <main className="mx-auto max-w-[780px] px-6 py-16">
      <MarkdownRenderer
        content={post.content}
        imageClassName="mx-auto h-auto max-h-[70vh] w-auto rounded-[8px] object-contain"
      />
      <footer className="mt-16 flex flex-col gap-6 border-t border-card-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/blog" className="text-[15px] font-semibold text-terracotta">
          ← {t("backToBlog")}
        </Link>
        {nextArticle && (
          <Link
            href={`/blog/${nextArticle.slug}`}
            className="flex flex-col gap-1 sm:items-end sm:text-right"
          >
            <span className="text-[13px] uppercase tracking-[0.08em] text-prose-muted">
              {t("nextArticle")}
            </span>
            <span className="font-serif text-[18px] text-forest">{nextArticle.title} →</span>
          </Link>
        )}
      </footer>
    </main>
  );
};

export default BlogPostPage;
