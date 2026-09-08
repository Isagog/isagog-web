import { existsSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const LOCALES = ["it", "en"];
const ROUTES = [""];

const missing = [];
for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const file = join(OUT, locale, route, "index.html");
    if (!existsSync(file)) missing.push(file);
  }
}
if (!existsSync(join(OUT, "index.html"))) missing.push(join(OUT, "index.html"));

if (missing.length > 0) {
  console.error(`check-export: ${missing.length} expected file(s) missing:`);
  for (const file of missing) console.error(`  - ${file}`);
  process.exit(1);
}
console.error(`check-export: ok (${LOCALES.length * ROUTES.length + 1} files)`);
