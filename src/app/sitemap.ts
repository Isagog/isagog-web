import { SITE_URL } from "@/lib/base-path";
import { locales } from "@/lib/locale-href";
import { getSlugs } from "@/lib/mdx";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE = SITE_URL;

const TOP_LEVEL_PATHS = [
  { path: "", priority: 1, changeFrequency: "monthly" as const },
  { path: "/platform", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/project", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "monthly" as const },
];

// Detail pages rank below their index and change less often than the
// hand-curated top-level paths — the content itself is static once
// published, but review copy on the same slug can still be revised.
const DETAIL_PAGE_PRIORITY = 0.6;
const DETAIL_PAGE_CHANGE_FREQUENCY = "yearly" as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const topLevelEntries = locales.flatMap((locale) =>
    TOP_LEVEL_PATHS.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE}/${locale}${path}/`,
      lastModified,
      changeFrequency,
      priority,
    }))
  );

  // Articles are shared across locales; projects (case studies) are
  // authored per locale — mirrors generateStaticParams in the two
  // [slug] routes.
  const articleEntries = locales.flatMap((locale) =>
    getSlugs("articles").map((slug) => ({
      url: `${SITE}/${locale}/blog/${slug}/`,
      lastModified,
      changeFrequency: DETAIL_PAGE_CHANGE_FREQUENCY,
      priority: DETAIL_PAGE_PRIORITY,
    }))
  );

  const projectEntries = locales.flatMap((locale) =>
    getSlugs("projects", locale).map((slug) => ({
      url: `${SITE}/${locale}/project/${slug}/`,
      lastModified,
      changeFrequency: DETAIL_PAGE_CHANGE_FREQUENCY,
      priority: DETAIL_PAGE_PRIORITY,
    }))
  );

  return [...topLevelEntries, ...articleEntries, ...projectEntries];
}
