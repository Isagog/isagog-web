import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

const REQUIRED = [
  "public/favicon.ico",
  "public/logo-new.png",
  "public/index.html",
  "public/images/tree.avif",
  "public/images/about-images/tree-bonsai.png",
  "public/images/about-images/tree-pine.png",
  "public/images/about-images/tree-cypress.png",
  "public/images/about-images/tree-bushy.png",
  "public/images/about-images/tree-palm.png",
  "public/images/team-images/Guido.avif",
  "public/images/team-images/Robert.avif",
  "public/platform-explorer/it.html",
  "public/platform-explorer/en.html",
  "public/articles-data/list.json",
  "public/projects-data/list.it.json",
  "public/projects-data/list.en.json",
];

describe("required assets", () => {
  it.each(REQUIRED)("%s exists", (path) => {
    expect(existsSync(path)).toBe(true);
  });
});

describe("required content", () => {
  it("has five articles", () => {
    for (let n = 1; n <= 5; n += 1) {
      expect(existsSync(`content/articles/article-${n}.mdx`)).toBe(true);
    }
  });

  it.each(["it", "en"])("has three %s case studies", (locale) => {
    for (const slug of ["maxxi-case-study", "manifesto-case-study", "teleperformance-case-study"]) {
      expect(existsSync(`content/projects/${locale}/${slug}.mdx`)).toBe(true);
    }
  });
});
