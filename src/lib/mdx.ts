import fs from "fs";
import matter from "gray-matter";
import path from "path";

type ContentType = "articles" | "projects";

const contentDir = (type: ContentType, locale?: string) =>
  type === "articles"
    ? path.join(process.cwd(), "content", "articles")
    : path.join(process.cwd(), "content", "projects", locale ?? "en");

export const getSlugs = (type: ContentType, locale?: string): string[] =>
  fs
    .readdirSync(contentDir(type, locale))
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

export const getMdxBySlug = async (
  slug: string,
  type: ContentType,
  locale?: string
): Promise<{ content: string; frontmatter: Record<string, unknown>; slug: string } | null> => {
  const filePath = path.join(contentDir(type, locale), `${slug}.mdx`);

  try {
    const rawContent = await fs.promises.readFile(filePath, "utf-8");
    const { content, data: frontmatter } = matter(rawContent);
    return { content, frontmatter, slug };
  } catch (error) {
    console.error(`Error reading MDX file for slug "${slug}":`, error);
    return null;
  }
};
