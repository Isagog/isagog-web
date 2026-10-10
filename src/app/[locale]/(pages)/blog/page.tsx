import { buildPageMetadata } from "@/lib/page-metadata";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import type { Metadata } from "next";
import { BlogCard } from "./_components/blog-card";
import { TechnicalInsights } from "./_components/technical-insights";

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
  const t = await getScopedI18n("blog");

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[900px] flex-col items-center gap-6 px-6 py-16">
      <h1 className="self-start font-serif text-[clamp(28px,3.4vw,39px)] leading-[1.15] text-forest">
        {t("heading")}
      </h1>
      <section className="flex w-full flex-col gap-5">
        <h2 className="font-serif text-[clamp(22px,2.4vw,28px)] leading-[1.2] text-forest">
          {t("technical.heading")}
        </h2>
        <TechnicalInsights />
      </section>
      <section className="mt-6 flex w-full flex-col gap-5">
        <h2 className="font-serif text-[clamp(22px,2.4vw,28px)] leading-[1.2] text-forest">
          {t("articles.heading")}
        </h2>
        <BlogCard />
      </section>
    </main>
  );
};

export default BlogPage;
