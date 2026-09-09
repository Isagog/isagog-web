import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { extractHeading, getMdxBySlug, getSlugs, stripLeadingHeading } from "./mdx";

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

describe("stripLeadingHeading", () => {
  it("removes a leading level-1 heading and its line break", () => {
    expect(stripLeadingHeading("# Progetti\n\n## MAXXIperTUTTI\n\nBody.")).toBe(
      "## MAXXIperTUTTI\n\nBody."
    );
  });

  it("leaves content unchanged when it doesn't start with a level-1 heading", () => {
    expect(stripLeadingHeading("## Only a level-2 heading\n\nBody.")).toBe(
      "## Only a level-2 heading\n\nBody."
    );
    expect(stripLeadingHeading("Just a paragraph, no heading at all.")).toBe(
      "Just a paragraph, no heading at all."
    );
  });

  it("only strips the first line, not a heading found later in the content", () => {
    expect(stripLeadingHeading("Intro line.\n\n# Not first, stays put.")).toBe(
      "Intro line.\n\n# Not first, stays put."
    );
  });
});

/**
 * The blog [slug] page's "next article" link is built by walking
 * getSlugs("articles") and labels each link with extractHeading() on that
 * slug's MDX. That's only correct because getSlugs' order matches the
 * order public/articles-data/list.json is rendered in on the /blog index,
 * and because each article's "# heading" matches that list's `title`.
 * Nothing in the type system enforces either fact — add a sixth article,
 * or let a heading drift from the list, and the "next" link silently
 * mislabels itself with no test failure. These tests make both halves of
 * that assumption explicit and would fail if either broke.
 */
describe("articles list order (blog [slug] next-link invariant)", () => {
  const listPath = path.join(process.cwd(), "public", "articles-data", "list.json");
  const articleList = JSON.parse(fs.readFileSync(listPath, "utf-8")) as Array<{
    slug: string;
    title: string;
  }>;

  it("getSlugs('articles') returns the same sequence as list.json's slugs", () => {
    // Sequence, not set membership: order is what the next-link depends on.
    expect(getSlugs("articles")).toEqual(articleList.map((entry) => entry.slug));
  });

  it("each article's level-1 heading matches list.json's title for that slug", async () => {
    for (const entry of articleList) {
      const post = await getMdxBySlug(entry.slug, "articles");
      expect(post).not.toBeNull();
      expect(extractHeading(post?.content ?? "")).toBe(entry.title);
    }
  });
});
