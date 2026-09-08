import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { zArticlesSchema } from "./article.model";

describe("zArticlesSchema", () => {
  it("accepts the shipped article list", () => {
    const json: unknown = JSON.parse(readFileSync("public/articles-data/list.json", "utf-8"));
    expect(zArticlesSchema.safeParse(json).success).toBe(true);
  });

  it("lists one entry per article file", () => {
    const json: unknown = JSON.parse(readFileSync("public/articles-data/list.json", "utf-8"));
    const parsed = zArticlesSchema.parse(json);
    expect(parsed).toHaveLength(5);
  });

  it("rejects an entry missing its image", () => {
    expect(zArticlesSchema.safeParse([{ title: "A", slug: "a" }]).success).toBe(false);
  });
});
