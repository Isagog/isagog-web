import { describe, expect, it } from "vitest";
import { localeHref } from "./locale-href";
import { ONTOLOGY_SITE_URL, ontologySiteUrl } from "./ontology-site";

describe("ontologySiteUrl", () => {
  it("points at the minisite's locale home, with the trailing slash its static export needs", () => {
    expect(ontologySiteUrl("it")).toBe("https://ontology.isagog.com/it/");
    expect(ontologySiteUrl("en")).toBe("https://ontology.isagog.com/en/");
  });

  it("is an absolute URL, so LocaleLink passes it through without a locale prefix", () => {
    expect(ONTOLOGY_SITE_URL).toMatch(/^https:\/\//);
    expect(localeHref("en", ontologySiteUrl("en"))).toBe(ontologySiteUrl("en"));
  });
});
