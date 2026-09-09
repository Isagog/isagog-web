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

/**
 * Extracts the text of the first level-1 (`# `) heading from raw MDX/Markdown
 * content. Returns null when the content has no such heading, so callers can
 * fall back to a section title instead of the site title.
 */
export const extractHeading = (content: string): string | null => {
  const match = /^#\s+(.+)$/m.exec(content);
  return match?.[1]?.trim() ?? null;
};

/**
 * Removes a leading level-1 (`# `) heading line from raw MDX/Markdown
 * content, if the content starts with one. Used when a page renders its
 * own `<h1>` (e.g. a case study's title, composed from project-list data
 * rather than the MDX's own generic "# Progetti"/"# Projects" heading) and
 * must avoid also rendering the MDX's leading heading as a second `<h1>`.
 *
 * Only strips a heading at the very start of the content — one that isn't
 * first is left alone, since it isn't the duplicate this exists to remove.
 * Never mutates the source file; this is a render-time transform only.
 */
export const stripLeadingHeading = (content: string): string =>
  content.replace(/^#\s+.*\n+/, "");

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
