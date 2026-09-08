import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { zProjectsSchema } from "./project.model";

describe("zProjectsSchema", () => {
  it.each(["it", "en"])("accepts the shipped %s list", (locale) => {
    const json: unknown = JSON.parse(
      readFileSync(`public/projects-data/list.${locale}.json`, "utf-8")
    );
    expect(zProjectsSchema.safeParse(json).success).toBe(true);
  });

  it("rejects a list whose entry is missing a slug", () => {
    const result = zProjectsSchema.safeParse([{ title: "A", image: "/a.png" }]);
    expect(result.success).toBe(false);
  });

  it("rejects a bare object", () => {
    expect(zProjectsSchema.safeParse({ title: "A" }).success).toBe(false);
  });
});
