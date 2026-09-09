import { describe, expect, it } from "vitest";
import { getProjectListEntry } from "./project-list";

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
