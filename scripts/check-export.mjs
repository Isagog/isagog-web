import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Next (16.3.4, output: "export") always writes the export to ./out
// regardless of `basePath` — basePath only rewrites the href/src values
// baked into the emitted HTML/JS, it does not nest the output directory.
// Confirmed empirically: a fresh `NEXT_PUBLIC_BASE_PATH=/isagog-web pnpm
// build` still produced out/it/index.html, not out/isagog-web/it/index.html.
const OUT = "out";
const LOCALES = ["it", "en"];
const ROUTES = ["", "approach", "platform", "project", "blog", "contact"];

const SLUG_ROUTES = [
  ["project", ["maxxi-case-study", "manifesto-case-study", "teleperformance-case-study"]],
  ["blog", ["article-1", "article-2", "article-3", "article-4", "article-5"]],
];

const missing = [];
for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const file = join(OUT, locale, route, "index.html");
    if (!existsSync(file)) missing.push(file);
  }
}
for (const locale of LOCALES) {
  for (const [base, slugs] of SLUG_ROUTES) {
    for (const slug of slugs) {
      const file = join(OUT, locale, base, slug, "index.html");
      if (!existsSync(file)) missing.push(file);
    }
  }
}
if (!existsSync(join(OUT, "index.html"))) missing.push(join(OUT, "index.html"));

// Old-site URL stubs: outside the locale segments, matching the dropped
// live-site paths they redirect from (/service, /work-with-us).
const OLD_URL_STUBS = ["service", "work-with-us"];
for (const stub of OLD_URL_STUBS) {
  const file = join(OUT, stub, "index.html");
  if (!existsSync(file)) missing.push(file);
}

// Ontology IRI stubs: https://isagog.com/ontology/{top,agents,frame}[#Term]
// forward to the ontology minisite (ontology.isagog.com).
const IRI_STUBS = ["ontology", "ontology/top", "ontology/agents", "ontology/frame"];
for (const stub of IRI_STUBS) {
  const file = join(OUT, stub, "index.html");
  if (!existsSync(file)) missing.push(file);
}

// Concept-link markup ("[ontologia](onto:)", src/lib/concept-links.ts) must
// be rendered by <ConceptText>; raw markup in a page's visible HTML means a
// string reached the page some other way. Scripts are skipped: the inlined
// RSC payload may legitimately carry the raw copy.
const leaks = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith(".html")) {
      const visible = readFileSync(path, "utf-8").replace(/<script[\s\S]*?<\/script>/g, "");
      if (visible.includes("](onto:")) leaks.push(path);
    }
  }
};
if (existsSync(OUT)) walk(OUT);
if (leaks.length > 0) {
  console.error(`check-export: unrendered concept-link markup in ${leaks.length} file(s):`);
  for (const file of leaks) console.error(`  - ${file}`);
  process.exit(1);
}

if (missing.length > 0) {
  console.error(`check-export: ${missing.length} expected file(s) missing:`);
  for (const file of missing) console.error(`  - ${file}`);
  process.exit(1);
}
console.error("check-export: ok");
