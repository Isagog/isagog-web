import { describe, expect, it } from "vitest";
import { SECTIONS, computeActiveSection } from "./sections";
import type { SectionId } from "./sections";

const tops: ReadonlyArray<{ id: SectionId; top: number }> = [
  { id: "visione", top: 800 },
  { id: "metodologia", top: 1900 },
  { id: "tecnologia", top: 3000 },
  { id: "persone", top: 4100 },
  { id: "contatto", top: 5000 },
];

describe("SECTIONS", () => {
  it("lists the five homepage sections in reading order", () => {
    expect(SECTIONS.map((s) => s.id)).toEqual([
      "visione",
      "metodologia",
      "tecnologia",
      "persone",
      "contatto",
    ]);
  });

  it("numbers only the four numbered sections, leaving persone unnumbered", () => {
    expect(SECTIONS.map((s) => s.number)).toEqual(["01", "02", "03", "", "04"]);
  });
});

describe("computeActiveSection", () => {
  it("returns null above the first section", () => {
    expect(computeActiveSection(tops, 0)).toBeNull();
    expect(computeActiveSection(tops, 500)).toBeNull();
  });

  it("activates a section once its top passes the offset", () => {
    expect(computeActiveSection(tops, 700)).toBe("visione");
    expect(computeActiveSection(tops, 1000)).toBe("visione");
  });

  it("returns the last section whose top has passed", () => {
    expect(computeActiveSection(tops, 2000)).toBe("metodologia");
    expect(computeActiveSection(tops, 4500)).toBe("persone");
    expect(computeActiveSection(tops, 9000)).toBe("contatto");
  });

  it("respects a custom offset", () => {
    expect(computeActiveSection(tops, 700, 0)).toBeNull();
    expect(computeActiveSection(tops, 800, 0)).toBe("visione");
  });

  it("returns null for an empty list", () => {
    expect(computeActiveSection([], 1000)).toBeNull();
  });
});
