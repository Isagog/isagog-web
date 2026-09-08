import { setStaticParamsLocale } from "@/packages/locales/server";
import { ProjectSection } from "./_components/project-section";

const ProjectPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main className="mx-auto max-w-[1224px] px-6 py-16">
      <ProjectSection />
    </main>
  );
};

export default ProjectPage;
