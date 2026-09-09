import { describe, expect, it } from "vitest";
import { buildSitemapEntries } from "./sitemap-entries";

const SITE_URL = "https://isagog.com";
const LOCALES = ["it", "en"] as const;
const TOP_LEVEL_PATHS = [
  { path: "", priority: 1, changeFrequency: "monthly" as const },
  { path: "/approach", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/platform", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/project", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
];
const LAST_MODIFIED = new Date("2026-01-01T00:00:00Z");

describe("buildSitemapEntries", () => {
  it("produces 30 entries for 7 routes, 5 shared articles and 3 per-locale projects across 2 locales", () => {
    const entries = buildSitemapEntries({
      siteUrl: SITE_URL,
      locales: LOCALES,
      topLevelPaths: TOP_LEVEL_PATHS,
      lastModified: LAST_MODIFIED,
      getArticleSlugs: () => ["a1", "a2", "a3", "a4", "a5"],
      getProjectSlugs: () => ["p1", "p2", "p3"],
    });

    expect(entries).toHaveLength(30);
  });

  it("gives every URL a trailing slash, including the home path", () => {
    const entries = buildSitemapEntries({
      siteUrl: SITE_URL,
      locales: LOCALES,
      topLevelPaths: TOP_LEVEL_PATHS,
      lastModified: LAST_MODIFIED,
      getArticleSlugs: () => ["a1"],
      getProjectSlugs: () => ["p1"],
    });

    for (const entry of entries) {
      expect(entry.url.endsWith("/")).toBe(true);
    }
    expect(entries.map((entry) => entry.url)).toContain(`${SITE_URL}/it/`);
    expect(entries.map((entry) => entry.url)).toContain(`${SITE_URL}/en/`);
  });

  it("reuses the same article slug list for every locale (articles are locale-independent)", () => {
    const entries = buildSitemapEntries({
      siteUrl: SITE_URL,
      locales: LOCALES,
      topLevelPaths: [],
      lastModified: LAST_MODIFIED,
      getArticleSlugs: () => ["shared-article"],
      getProjectSlugs: () => [],
    });

    const urls = entries.map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}/it/blog/shared-article/`);
    expect(urls).toContain(`${SITE_URL}/en/blog/shared-article/`);
  });

  it("requests a distinct project slug list per locale (projects are per-locale)", () => {
    const entries = buildSitemapEntries({
      siteUrl: SITE_URL,
      locales: LOCALES,
      topLevelPaths: [],
      lastModified: LAST_MODIFIED,
      getArticleSlugs: () => [],
      getProjectSlugs: (locale) => (locale === "it" ? ["studio-caso-it"] : ["case-study-en"]),
    });

    const urls = entries.map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}/it/project/studio-caso-it/`);
    expect(urls).toContain(`${SITE_URL}/en/project/case-study-en/`);
    // Getting the asymmetry backwards (treating projects as locale-shared)
    // would leak one locale's slugs into the other's URLs.
    expect(urls).not.toContain(`${SITE_URL}/en/project/studio-caso-it/`);
    expect(urls).not.toContain(`${SITE_URL}/it/project/case-study-en/`);
  });

  it("calls getArticleSlugs without a locale argument", () => {
    let callArgCount = -1;
    buildSitemapEntries({
      siteUrl: SITE_URL,
      locales: LOCALES,
      topLevelPaths: [],
      lastModified: LAST_MODIFIED,
      getArticleSlugs: (...args: unknown[]) => {
        callArgCount = args.length;
        return [];
      },
      getProjectSlugs: () => [],
    });

    expect(callArgCount).toBe(0);
  });

  it("calls getProjectSlugs once per locale with that locale", () => {
    const seenLocales: string[] = [];
    buildSitemapEntries({
      siteUrl: SITE_URL,
      locales: LOCALES,
      topLevelPaths: [],
      lastModified: LAST_MODIFIED,
      getArticleSlugs: () => [],
      getProjectSlugs: (locale) => {
        seenLocales.push(locale);
        return [];
      },
    });

    expect(seenLocales).toEqual(["it", "en"]);
  });
});
