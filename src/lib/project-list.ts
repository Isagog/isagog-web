import fs from "fs";
import path from "path";
import { zProjectsSchema } from "@/packages/action/projects/project.model";

export interface ProjectListEntry {
  title: string;
  secondTitle: string;
}

/**
 * Reads a single case study's title and secondTitle from this locale's
 * public/projects-data/list.{locale}.json at build time. That file is the
 * same data the project index cards render from, so a case study's detail
 * page title stays in agreement with its index card instead of drifting
 * from the MDX's own (differently-shaped) heading.
 *
 * Returns null when the file is missing/unreadable, malformed, or has no
 * entry for this slug, so callers can fall back rather than throw during
 * a static export build.
 */
export const getProjectListEntry = (slug: string, locale: string): ProjectListEntry | null => {
  const filePath = path.join(process.cwd(), "public", "projects-data", `list.${locale}.json`);

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const json: unknown = JSON.parse(raw);
    const parsed = zProjectsSchema.safeParse(json);
    if (!parsed.success) return null;

    const entry = parsed.data.find((project) => project.slug === slug);
    if (!entry) return null;

    return { title: entry.title, secondTitle: entry.secondTitle };
  } catch (error) {
    console.error(`Error reading project list entry for slug "${slug}" (${locale}):`, error);
    return null;
  }
};
