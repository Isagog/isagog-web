import { setStaticParamsLocale } from "@/packages/locales/server";
import { BlogCard } from "./_components/blog-card";

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
