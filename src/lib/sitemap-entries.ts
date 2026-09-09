/**
 * Pure sitemap entry builder, extracted from `src/app/sitemap.ts` so the
 * locale-fan-out logic — and in particular the asymmetry between shared
 * articles and per-locale projects — can be unit tested. Route files
 * (`src/app/**`) aren't covered by this repo's test setup; this module is.
 */

export type SitemapChangeFrequency = "monthly" | "yearly";

export interface SitemapPathConfig {
  path: string;
  priority: number;
  changeFrequency: SitemapChangeFrequency;
}

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: SitemapChangeFrequency;
  priority: number;
}

// Detail pages rank below their index and change less often than the
// hand-curated top-level paths — the content itself is static once
// published, but review copy on the same slug can still be revised.
const DETAIL_PAGE_PRIORITY = 0.6;
const DETAIL_PAGE_CHANGE_FREQUENCY: SitemapChangeFrequency = "yearly";

export interface BuildSitemapEntriesOptions {
  siteUrl: string;
  locales: readonly string[];
  topLevelPaths: readonly SitemapPathConfig[];
  lastModified: Date;
  /** Articles are shared across locales — no locale argument. */
  getArticleSlugs: () => string[];
  /** Projects (case studies) are authored per locale. */
  getProjectSlugs: (locale: string) => string[];
}

/**
 * Builds the full sitemap entry list: top-level routes fanned out across
 * every locale, plus detail pages for articles (one shared slug list reused
 * for every locale) and projects (a distinct slug list requested per
 * locale). Mirrors `generateStaticParams` in the two `[slug]` routes.
 */
export function buildSitemapEntries({
  siteUrl,
  locales,
  topLevelPaths,
  lastModified,
  getArticleSlugs,
  getProjectSlugs,
}: BuildSitemapEntriesOptions): SitemapEntry[] {
  const topLevelEntries = locales.flatMap((locale) =>
    topLevelPaths.map(({ path, priority, changeFrequency }) => ({
      url: `${siteUrl}/${locale}${path}/`,
      lastModified,
      changeFrequency,
      priority,
    }))
  );

  const articleEntries = locales.flatMap((locale) =>
    getArticleSlugs().map((slug) => ({
      url: `${siteUrl}/${locale}/blog/${slug}/`,
      lastModified,
      changeFrequency: DETAIL_PAGE_CHANGE_FREQUENCY,
      priority: DETAIL_PAGE_PRIORITY,
    }))
  );

  const projectEntries = locales.flatMap((locale) =>
    getProjectSlugs(locale).map((slug) => ({
      url: `${siteUrl}/${locale}/project/${slug}/`,
      lastModified,
      changeFrequency: DETAIL_PAGE_CHANGE_FREQUENCY,
      priority: DETAIL_PAGE_PRIORITY,
    }))
  );

  return [...topLevelEntries, ...articleEntries, ...projectEntries];
}
