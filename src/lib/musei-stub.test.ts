import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

// The bare https://isagog.com/musei is served by a static stub in
// public/musei/ (static export has no middleware). Run its inline script
// against a fake browser and check which locale page it opens.

const stub = (): string =>
  readFileSync(fileURLToPath(new URL("../../public/musei/index.html", import.meta.url)), "utf-8");

const redirectOf = (opts: { language?: string; navigator?: object }): string => {
  const script = stub().match(/<script>([\s\S]*?)<\/script>/)?.[1];
  if (!script) throw new Error("no inline script in public/musei/index.html");
  let target = "";
  runInNewContext(script, {
    navigator: opts.navigator ?? { language: opts.language },
    window: { location: { replace: (url: string) => (target = url) } },
  });
  return target;
};

describe("bare /musei stub", () => {
  it.each([
    ["it-IT", "../it/musei/"],
    ["en-GB", "../en/musei/"],
    ["EN-us", "../en/musei/"],
    ["en", "../en/musei/"],
    ["fr-FR", "../it/musei/"],
  ])("sends a %s browser to %s", (language, target) => {
    expect(redirectOf({ language })).toBe(target);
  });

  it("falls back to Italian when the browser reports no language", () => {
    expect(redirectOf({ navigator: {} })).toBe("../it/musei/");
  });

  it("has a no-JS fallback to the Italian page", () => {
    expect(stub()).toMatch(/<noscript>[\s\S]*url=\.\.\/it\/musei\/[\s\S]*<\/noscript>/);
  });

  it("does not load analytics before consent", () => {
    expect(stub()).not.toContain("beacon.min.js");
    expect(stub()).not.toContain("posthog");
  });
});
