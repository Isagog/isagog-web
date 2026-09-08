import { describe, expect, it } from "vitest";
import { getMdxBySlug, getSlugs } from "./mdx";

describe("getSlugs", () => {
  it("lists every article", () => {
    expect(getSlugs("articles").sort()).toEqual([
      "article-1",
      "article-2",
      "article-3",
      "article-4",
      "article-5",
    ]);
  });

  it("lists projects per locale", () => {
    expect(getSlugs("projects", "it").sort()).toEqual([
      "manifesto-case-study",
      "maxxi-case-study",
      "teleperformance-case-study",
    ]);
    expect(getSlugs("projects", "en").sort()).toEqual([
      "manifesto-case-study",
      "maxxi-case-study",
      "teleperformance-case-study",
    ]);
  });

  it("defaults projects to the en directory", () => {
    expect(getSlugs("projects")).toEqual(getSlugs("projects", "en"));
  });
});

describe("getMdxBySlug", () => {
  it("returns the body and slug of an article", async () => {
    const post = await getMdxBySlug("article-1", "articles");
    expect(post).not.toBeNull();
    expect(post?.slug).toBe("article-1");
    expect(post?.content).toContain("Il linguaggio non è algebra");
  });

  it("returns the locale-specific project body", async () => {
    const it = await getMdxBySlug("maxxi-case-study", "projects", "it");
    const en = await getMdxBySlug("maxxi-case-study", "projects", "en");
    expect(it?.content).not.toBe(en?.content);
  });

  it("returns null for an unknown slug instead of throwing", async () => {
    expect(await getMdxBySlug("does-not-exist", "articles")).toBeNull();
  });
});
