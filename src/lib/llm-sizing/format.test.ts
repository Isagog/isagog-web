import { describe, expect, it } from "vitest";
import { HARDWARE, MODELS } from "./data";
import { fmtBW, fmtGB, fmtParams, fmtTps, localizeHardware, localizeModels } from "./format";

describe("number formatting", () => {
  it("uses a decimal comma in Italian and a point in English", () => {
    expect(fmtGB("it", 1613.475)).toBe("1,6 TB");
    expect(fmtGB("en", 1613.475)).toBe("1.6 TB");
    expect(fmtTps("it", 5.49)).toBe("5,5");
    expect(fmtBW("it", 1792)).toBe("1,79 TB/s");
    expect(fmtParams("en", 6.5)).toBe("6.5B");
  });

  it("rounds by magnitude", () => {
    expect(fmtGB("en", 9.82)).toBe("9.8 GB");
    expect(fmtGB("en", 74.08)).toBe("74 GB");
    expect(fmtGB("en", 132.79)).toBe("133 GB");
    expect(fmtTps("en", 0.5)).toBe("0.50");
    expect(fmtTps("en", 46.75)).toBe("47");
    expect(fmtBW("en", 8000)).toBe("8 TB/s");
    expect(fmtBW("en", 448)).toBe("448 GB/s");
    expect(fmtParams("en", 2800)).toBe("2.8T");
    expect(fmtParams("en", 1600)).toBe("1.6T");
  });
});

describe("localisation", () => {
  it("translates notes, prices and node names into Italian without touching the source data", () => {
    const it8b300 = localizeHardware("it", "su preventivo").find((h) => h.id === "8b300");
    expect(it8b300?.name).toBe("Nodo 8× B300");
    expect(it8b300?.price).toBe("su preventivo");
    expect(localizeHardware("it", "su preventivo").find((h) => h.id === "5090")?.price).toBe("$2,5–4k");
    expect(localizeModels("it")[0]?.note).toMatch(/^Il più grande rilascio open/);

    expect(HARDWARE.find((h) => h.id === "8b300")?.name).toBe("8× B300 node");
    expect(MODELS[0]?.note).toMatch(/^Largest open release/);
  });

  it("keeps English notes and only localises the on-quote price", () => {
    const en = localizeHardware("en", "on quote");
    expect(en.find((h) => h.id === "8b300")?.price).toBe("on quote");
    expect(en.map((h) => h.note)).toEqual(HARDWARE.map((h) => h.note));
  });

  it("has an Italian note for every model and hardware entry", () => {
    expect(localizeModels("it").every((m, i) => m.note !== MODELS[i]?.note)).toBe(true);
    expect(localizeHardware("it", "").every((h, i) => h.note !== HARDWARE[i]?.note)).toBe(true);
  });
});
