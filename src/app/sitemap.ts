import { SITE_URL } from "@/lib/base-path";
import { locales } from "@/lib/locale-href";
import { getSlugs } from "@/lib/mdx";
import { buildSitemapEntries } from "@/lib/sitemap-entries";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const TOP_LEVEL_PATHS = [
  { path: "", priority: 1, changeFrequency: "monthly" as const },
  { path: "/approach", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/platform", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/project", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries({
    siteUrl: SITE_URL,
    locales,
    topLevelPaths: TOP_LEVEL_PATHS,
    lastModified: new Date(),
    // Articles are shared across locales; projects (case studies) are
    // authored per locale — mirrors generateStaticParams in the two
    // [slug] routes. See src/lib/sitemap-entries.test.ts.
    getArticleSlugs: () => getSlugs("articles"),
    getProjectSlugs: (locale) => getSlugs("projects", locale),
  });
}
