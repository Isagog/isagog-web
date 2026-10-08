import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { ONTOLOGY_SITE_URL } from "./ontology-site";

// The ontology IRIs (https://isagog.com/ontology/{top,agents,frame}#Term) are
// served by static stubs in public/ontology/ that forward to the minisite.
// Run each stub's inline script against a fake browser and check where it goes.

const LAYERS = ["top", "agents", "frame"] as const;

const stub = (path: string): string =>
  readFileSync(fileURLToPath(new URL(`../../public/ontology/${path}index.html`, import.meta.url)), "utf-8");

const redirectOf = (path: string, { hash = "", language = "it-IT" } = {}): string => {
  const script = stub(path).match(/<script>([\s\S]*?)<\/script>/)?.[1];
  if (!script) throw new Error(`no inline script in public/ontology/${path}index.html`);
  let target = "";
  runInNewContext(script, {
    navigator: { language },
    window: { location: { hash, replace: (url: string) => (target = url) } },
  });
  return target;
};

describe("ontology IRI stubs", () => {
  it.each(LAYERS)("forwards the bare %s namespace to its section of the layers page", (layer) => {
    expect(redirectOf(`${layer}/`)).toBe(`${ONTOLOGY_SITE_URL}/it/layers/#${layer}`);
  });

  it.each(LAYERS)("forwards a %s term IRI to the term in the explorer", (layer) => {
    expect(redirectOf(`${layer}/`, { hash: "#Agent", language: "en-GB" })).toBe(
      `${ONTOLOGY_SITE_URL}/en/explorer/#${layer}:Agent`
    );
  });

  it("does not double the prefix when the fragment is already a prefixed id", () => {
    expect(redirectOf("frame/", { hash: "#frame:Role" })).toBe(`${ONTOLOGY_SITE_URL}/it/explorer/#frame:Role`);
  });

  it("falls back to Italian for unsupported browser languages", () => {
    expect(redirectOf("top/", { language: "fr-FR" })).toBe(`${ONTOLOGY_SITE_URL}/it/layers/#top`);
  });

  it("forwards /ontology/ itself to the minisite home", () => {
    expect(redirectOf("", { language: "en-US" })).toBe(`${ONTOLOGY_SITE_URL}/en/`);
  });

  it.each(LAYERS)("has a no-JS fallback to the %s layer", (layer) => {
    expect(stub(`${layer}/`)).toContain(`url=${ONTOLOGY_SITE_URL}/it/layers/#${layer}"`);
  });
});
