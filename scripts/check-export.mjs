import { existsSync } from "node:fs";
import { join } from "node:path";

// Next (16.3.4, output: "export") always writes the export to ./out
// regardless of `basePath` — basePath only rewrites the href/src values
// baked into the emitted HTML/JS, it does not nest the output directory.
// Confirmed empirically: a fresh `NEXT_PUBLIC_BASE_PATH=/isagog-web pnpm
// build` still produced out/it/index.html, not out/isagog-web/it/index.html.
const OUT = "out";
const LOCALES = ["it", "en"];
const ROUTES = ["", "approach", "platform", "project", "blog", "about", "contact"];

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

if (missing.length > 0) {
  console.error(`check-export: ${missing.length} expected file(s) missing:`);
  for (const file of missing) console.error(`  - ${file}`);
  process.exit(1);
}
console.error("check-export: ok");
