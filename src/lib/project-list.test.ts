import { describe, expect, it } from "vitest";
import { buildCaseStudyTitle, getProjectListEntry } from "./project-list";

describe("getProjectListEntry", () => {
  it.each(["it", "en"] as const)(
    "returns the title and secondTitle for a known slug in %s",
    (locale) => {
      expect(getProjectListEntry("maxxi-case-study", locale)).toEqual({
        title: "MAXXI",
        secondTitle: "MAXXIperTUTTI",
      });
    }
  );

  it("returns the locale-specific entry for a different slug", () => {
    expect(getProjectListEntry("teleperformance-case-study", "it")).toEqual({
      title: "Teleperformance",
      secondTitle: "Voice First",
    });
  });

  it("returns null for a slug that is not in the list", () => {
    expect(getProjectListEntry("does-not-exist", "it")).toBeNull();
  });

  it("returns null instead of throwing for an unknown locale file", () => {
    expect(getProjectListEntry("maxxi-case-study", "does-not-exist")).toBeNull();
  });
});

describe("buildCaseStudyTitle", () => {
  it("composes the list entry's title and secondTitle when a list entry is present", () => {
    const title = buildCaseStudyTitle(
      { title: "MAXXI", secondTitle: "MAXXIperTUTTI" },
      "# Progetti\n\n## MAXXIperTUTTI",
      "Progetti — Isagog"
    );
    expect(title).toBe("MAXXI — MAXXIperTUTTI");
  });

  it("ignores the MDX content entirely when a list entry is present", () => {
    // Guards against a regression to the old bug: even if the MDX's own
    // heading is the generic collection title ("Progetti"), the list entry
    // must win, never the heading.
    const title = buildCaseStudyTitle(
      { title: "MAXXI", secondTitle: "MAXXIperTUTTI" },
      "# Progetti\n\nBody.",
      "Progetti — Isagog"
    );
    expect(title).not.toBe("Progetti");
    expect(title).toBe("MAXXI — MAXXIperTUTTI");
  });

  it("falls back to the MDX heading when there is no list entry", () => {
    const title = buildCaseStudyTitle(null, "# A Real Heading\n\nBody.", "Progetti — Isagog");
    expect(title).toBe("A Real Heading");
  });

  it("falls back to the supplied fallback, never the site title, when neither is available", () => {
    const title = buildCaseStudyTitle(null, null, "Progetti — Isagog");
    expect(title).toBe("Progetti — Isagog");
    expect(title).not.toBe("Isagog — Un'IA che sa dire cosa sa");
  });

  it("falls back to the supplied fallback when the MDX has no heading", () => {
    const title = buildCaseStudyTitle(null, "Just a paragraph, no heading.", "Progetti — Isagog");
    expect(title).toBe("Progetti — Isagog");
  });
});
