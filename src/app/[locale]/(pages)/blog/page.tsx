import { buildPageMetadata } from "@/lib/page-metadata";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import type { Metadata } from "next";
import { BlogCard } from "./_components/blog-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("meta");
  return buildPageMetadata({
    locale,
    path: "/blog",
    title: t("blog.title"),
    description: t("blog.description"),
  });
}

const BlogPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[900px] flex-col items-center gap-6 px-6 py-16">
      <BlogCard />
    </main>
  );
};

export default BlogPage;
