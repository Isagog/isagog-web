import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import en from "@/packages/locales/lang/en";
import it_ from "@/packages/locales/lang/it";
import { CONCEPT_PAGES, conceptHref, parseConceptLinks } from "./concept-links";

describe("conceptHref", () => {
  it("targets the minisite home or one of its pages, in the given locale", () => {
    expect(conceptHref("it", "")).toBe("https://ontology.isagog.com/it/");
    expect(conceptHref("en", "reasoning")).toBe("https://ontology.isagog.com/en/reasoning/");
  });
});

describe("parseConceptLinks", () => {
  it("leaves copy without markup as a single text segment", () => {
    expect(parseConceptLinks("Nessun concetto qui.", "it")).toEqual(["Nessun concetto qui."]);
  });

  it("splits text and links, keeping the surrounding text intact", () => {
    expect(parseConceptLinks("l'[ontologia](onto:) e il [grafo](onto:reasoning).", "it")).toEqual([
      "l'",
      { label: "ontologia", href: "https://ontology.isagog.com/it/" },
      " e il ",
      { label: "grafo", href: "https://ontology.isagog.com/it/reasoning/" },
      ".",
    ]);
  });

  it("rejects a page the minisite does not have", () => {
    expect(() => parseConceptLinks("[x](onto:glossary)", "en")).toThrow(/onto:glossary/);
  });
});

// Every concept link in the copy must parse, and it/en must link the same
// concepts in the same strings — a link missing in one language is a bug.
type Tree = { [key: string]: string | Tree };

const linkTargets = (tree: Tree, prefix = ""): Map<string, string[]> => {
  const out = new Map<string, string[]>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      const hrefs = parseConceptLinks(value, "it").flatMap((s) => (typeof s === "string" ? [] : [s.href]));
      if (hrefs.length > 0) out.set(path, hrefs);
    } else {
      for (const [p, hrefs] of linkTargets(value, path)) out.set(p, hrefs);
    }
  }
  return out;
};

describe("concept links in the copy", () => {
  it("are present, and identical in Italian and English", () => {
    const itLinks = linkTargets(it_ as unknown as Tree);
    expect(itLinks.size).toBeGreaterThan(0);
    expect(Object.fromEntries(linkTargets(en as unknown as Tree))).toEqual(Object.fromEntries(itLinks));
  });
});

// Case studies, articles and the platform explorer are not locale-file copy:
// they link the minisite with plain absolute URLs. Each must be a page the
// minisite has, in the language the file is written in.
const filesWithLanguage = (): Array<[string, "it" | "en"]> => [
  ...(["it", "en"] as const).flatMap((lang) =>
    readdirSync(join("content", "projects", lang)).map((f): [string, "it" | "en"] => [join("content", "projects", lang, f), lang])
  ),
  // Articles exist once, written in Italian, whatever the page locale.
  ...readdirSync(join("content", "articles")).map((f): [string, "it" | "en"] => [join("content", "articles", f), "it"]),
  [join("public", "platform-explorer", "it.html"), "it"],
  [join("public", "platform-explorer", "en.html"), "en"],
];

describe("minisite links in content files", () => {
  const links = filesWithLanguage().flatMap(([file, lang]) =>
    [...readFileSync(file, "utf-8").matchAll(/https:\/\/ontology\.isagog\.com[^\s)"'<>]*/g)].map((m) => ({
      file,
      lang,
      url: m[0],
    }))
  );

  it("exist", () => {
    expect(links.length).toBeGreaterThan(0);
  });

  it("point at a minisite page in the file's own language", () => {
    const valid = (lang: "it" | "en") => new Set(CONCEPT_PAGES.map((page) => conceptHref(lang, page)));
    const wrong = links.filter(({ lang, url }) => !valid(lang).has(url));
    expect(wrong).toEqual([]);
  });
});
