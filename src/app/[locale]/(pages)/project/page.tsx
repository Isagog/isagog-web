import { buildPageMetadata } from "@/lib/page-metadata";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import type { Metadata } from "next";
import { ProjectSection } from "./_components/project-section";

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
    path: "/project",
    title: t("project.title"),
    description: t("project.description"),
  });
}

const ProjectPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("project");

  return (
    <main className="mx-auto max-w-[1224px] px-6 py-16">
      <h1 className="mb-10 font-serif text-[clamp(28px,3.4vw,39px)] leading-[1.15] text-forest">
        {t("heading")}
      </h1>
      <ProjectSection />
    </main>
  );
};

export default ProjectPage;
