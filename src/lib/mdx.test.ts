import { describe, expect, it } from "vitest";
import { extractHeading, getMdxBySlug, getSlugs } from "./mdx";

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

describe("extractHeading", () => {
  it("returns the text of the first level-1 heading", () => {
    expect(extractHeading("# Il linguaggio non è algebra\n\nBody text.")).toBe(
      "Il linguaggio non è algebra"
    );
  });

  it("ignores leading blank lines and content before the heading", () => {
    expect(extractHeading("\n\n# Titolo\n\nBody.")).toBe("Titolo");
  });

  it("returns null when there is no level-1 heading", () => {
    expect(extractHeading("## Only a level-2 heading\n\nBody.")).toBeNull();
    expect(extractHeading("Just a paragraph, no heading at all.")).toBeNull();
  });

  it("trims surrounding whitespace from the heading text", () => {
    expect(extractHeading("#   Titolo con spazi   \n")).toBe("Titolo con spazi");
  });
});
