# Isagog Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new statically-exported Isagog website in `newwweb/` from the `bozzacompleta.html` design draft, carrying over the platform, project and blog pages from the current site, and deploy it to GitHub Pages.

**Architecture:** Next.js 16 App Router with `output: "export"` — no server at runtime. Locale lives in the URL (`/it`, `/en`) via `next-international`; the homepage is one scrolling page whose five numbered sections are deep-linkable and tracked by a sticky rail; blog and project detail pages read MDX from `content/` at build time, while their index pages fetch JSON lists from `public/` at runtime.

**Tech Stack:** Next.js 16, React 19, TypeScript 5 (strict), Tailwind CSS v4 (CSS-first config), next-international, gray-matter + markdown-to-jsx, TanStack Query, Zod, Vitest, pnpm 9 / Node 22.

**Spec:** `docs/superpowers/specs/2026-09-08-isagog-site-redesign-design.md`

## Global Constraints

These apply to every task; each task's requirements implicitly include them.

- **Working directory** is `/Volumes/2TBWDB/code/newwebisagog/newwweb`. The design draft is at `../bozzacompleta.html`; the current site is at `../isagog.github.io/`. Neither is ever modified.
- **Node 22, pnpm 9.** Never `npm install`.
- **Static export only.** No middleware, no server actions, no route handlers, no runtime env vars. Every dynamic route needs `generateStaticParams`; `[slug]` routes also set `export const dynamicParams = false`; `sitemap.ts` and `robots.ts` need `export const dynamic = "force-static"`.
- **TypeScript strict** with `noUncheckedIndexedAccess` — indexed access yields `T | undefined` and must be narrowed.
- **ESLint errors (not warnings):** `@typescript-eslint/no-explicit-any`, `@typescript-eslint/consistent-type-imports` (use `import type`), `eqeqeq`, `no-console` except `console.error`, unused vars unless `_`-prefixed.
- **Every internal link uses `LocaleLink`**, never a bare `next/link`. External links (`http`, `mailto:`, `#…`) pass through unchanged.
- **Copy never lives in components.** All user-visible strings live in `src/packages/locales/lang/{it,en}.ts`. `it.ts` and `en.ts` must stay structurally identical or the typed `t()` keys break. Italian is copied **verbatim** from `bozzacompleta.html`. Verified: the draft uses **plain ASCII apostrophes** (26 of them, zero U+2019) — transcribe them as ASCII `'`, do not "upgrade" them to typographic quotes. Its `·` separators and arrow glyphs (`↗`, `→`, `↓`) are transcribed as-is. English homepage keys are filled with the Italian text for now (deferred translation), except where an English string already exists in `../isagog.github.io/src/packages/locales/lang/en.ts`.
- **Design tokens live in `src/app/globals.css`**, never in `tailwind.config.ts`.
- **Colours are only ever referenced through tokens** (`text-forest`, `bg-visione`), never as raw hex in a component.
- **Commit after every task**, conventional-commits style (`feat:`, `fix:`, `chore:`, `docs:`, `test:`), and end every commit message with these two trailers:

  ```
  Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm
  ```

- **The working-draft banner** (`bozzacompleta.html:234`) and the dashed `.demo-note` working note (`bozzacompleta.html:343`) never ship as-is.

### Draft line map

Cite these when porting markup and copy:

| Lines in `../bozzacompleta.html` | Content |
|---|---|
| 2–232 | `<style>` — all design tokens, layout and breakpoints |
| 234 | working-draft status banner (do not ship) |
| 237–247 | `nav.site` |
| 248–253 | `section.hero1` |
| 254–316 | `section.apertura` (includes `.museum-hero` card) |
| 317–344 | `section.visione` (01) |
| 345–387 | `section.metodo` (02) |
| 388–431 | `section.tecnologia` (03) |
| 432–458 | `section.persone` |
| 459–495 | `section.contatto` (04) |
| 496–505 | `footer.site` |

## File Structure

```
newwweb/
├── .github/workflows/main.yml        CI: install → test → lint → build → Pages deploy
├── scripts/check-export.mjs          asserts every expected route emitted index.html
├── content/
│   ├── articles/*.mdx                5 blog articles (shared across locales)
│   └── projects/{en,it}/*.mdx        3 case studies per locale
├── public/
│   ├── index.html                    client-side locale redirect (/ → /it/ or /en/)
│   ├── images/…                      trees, team photos
│   ├── platform-explorer/{it,en}.html
│   ├── articles-data/list.json
│   └── projects-data/list.{en,it}.json
└── src/
    ├── app/
    │   ├── globals.css               design tokens + @theme inline mapping
    │   ├── robots.ts, sitemap.ts
    │   ├── _components/
    │   │   ├── providers.tsx         TanStack Query provider
    │   │   ├── custom/               header, footer, section-rail, section-heading,
    │   │   │                         capability-card, locale-link, body-wrapper,
    │   │   │                         markdown-render
    │   │   └── ui/                   button, card, carousel, dropdown-menu, skeleton
    │   └── [locale]/
    │       ├── layout.tsx            <html>/<body>, fonts, metadata, i18n provider
    │       └── (pages)/
    │           ├── (index)/page.tsx           the one scrolling homepage
    │           ├── (index)/components/        hero, apertura, knowledge-card, visione,
    │           │                              demo-slot, metodologia, tecnologia,
    │           │                              persone, contatto
    │           ├── platform/page.tsx
    │           ├── project/{page.tsx,[slug]/page.tsx,_components/}
    │           └── blog/{page.tsx,[slug]/page.tsx,_components/}
    ├── lib/
    │   ├── locale-href.ts            localeHref / stripLocale
    │   ├── sections.ts               SECTIONS registry + computeActiveSection
    │   ├── contact-mailto.ts         buildMailtoHref
    │   ├── mdx.ts                    getSlugs / getMdxBySlug
    │   └── utils.ts                  cn()
    └── packages/
        ├── locales/{client.ts,server.ts,lang/{it.ts,en.ts}}
        └── action/{articles,projects}/*.{action,model}.ts
```

---

### Task 1: Repository scaffold, toolchain and locale routing

**Files:**
- Create: `package.json`, `.gitignore`, `next.config.mjs`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `components.json`, `vitest.config.ts`
- Create: `src/lib/locale-href.ts`, `src/lib/utils.ts`
- Create: `src/packages/locales/{client.ts,server.ts,lang/it.ts,lang/en.ts}`
- Create: `src/app/globals.css` (placeholder — Task 2 fills it), `src/app/[locale]/layout.tsx`, `src/app/[locale]/(pages)/(index)/page.tsx`
- Create: `public/index.html`, `scripts/check-export.mjs`
- Test: `src/lib/locale-href.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `localeHref(locale: string, href: string): string`; `stripLocale(pathname: string): string`; `locales: readonly ["it","en"]`; `type Locale = "it" | "en"`; `defaultLocale: Locale = "it"`; `cn(...inputs: ClassValue[]): string`; from `@/packages/locales/server`: `getI18n`, `getScopedI18n`, `getStaticParams`, `setStaticParamsLocale`; from `@/packages/locales/client`: `useI18n`, `useScopedI18n`, `I18nProviderClient`, `useChangeLocale`, `useCurrentLocale`.

- [ ] **Step 1: Initialise the repository**

```bash
cd /Volumes/2TBWDB/code/newwebisagog/newwweb
git init -b main
cp ../isagog.github.io/.gitignore .gitignore
```

- [ ] **Step 2: Write `package.json`**

```json
{
  "name": "isagog-web",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@9.15.4",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "postbuild": "node scripts/check-export.mjs",
    "preview": "npx serve out",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@radix-ui/react-dropdown-menu": "^2.1.12",
    "@radix-ui/react-slot": "^1.2.0",
    "@tailwindcss/postcss": "^4.0.0",
    "@tanstack/react-query": "^5.74.11",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "embla-carousel-react": "^8.6.0",
    "gray-matter": "^4.0.3",
    "lucide-react": "^0.503.0",
    "markdown-to-jsx": "^7.7.6",
    "motion": "^12.9.2",
    "next": "^16.3.4",
    "next-international": "^1.3.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^2.6.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.6",
    "@types/react": "^19.0.7",
    "@types/react-dom": "^19.0.3",
    "eslint": "^9.18.0",
    "eslint-config-next": "^16.2.10",
    "postcss": "^8.5.27",
    "tailwindcss": "^4.0.0",
    "tw-animate-css": "^1.2.8",
    "typescript": "^5",
    "vitest": "^3.0.0"
  }
}
```

Note what is deliberately **absent** versus the old site: `three` / `@react-three/fiber` / `@types/three` (the 3D knowledge graph is not in the new design), `framer-motion` (superseded by `motion`, which is the same library's current package — use `motion/react` imports), `@mdx-js/*` and `@next/mdx` (MDX files are parsed with `gray-matter` and rendered with `markdown-to-jsx`, never compiled as pages), `remark-gfm`, `@svgr/webpack`, `dotenv`.

- [ ] **Step 3: Write the config files**

`next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export has no image optimizer; emit plain <img> tags.
  images: { unoptimized: true },
  // Fully static HTML/JS export into ./out — no server runtime required.
  output: "export",
  // Emit each route as <route>/index.html for maximum static-host portability.
  trailingSlash: true,
};

export default nextConfig;
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "noUncheckedIndexedAccess": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] },
    "target": "ES2017"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "**/*.d.ts"],
  "exclude": ["node_modules"]
}
```

`eslint.config.mjs`:

```js
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// Next 16 removed `next lint`, so ESLint runs directly and needs flat config.
const config = [
  { ignores: [".next/**", "out/**", "node_modules/**", "public/**"] },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      eqeqeq: ["error", "always"],
      "no-console": ["error", { allow: ["error"] }],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    // Vendored shadcn components predate the React Compiler rules in
    // eslint-plugin-react-hooks v6 and are kept as upstream wrote them.
    files: ["src/app/_components/ui/**"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
];

export default config;
```

`postcss.config.mjs`:

```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

`tailwind.config.ts` (tokens live in CSS; this exists only so tooling finds a config):

```ts
export default { theme: { extend: {} } };
```

`components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/app/_components",
    "utils": "@/lib/utils",
    "ui": "@/app/_components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Install dependencies**

Run: `pnpm install`
Expected: succeeds, creates `pnpm-lock.yaml`.

- [ ] **Step 5: Write the failing test for locale hrefs**

Create `src/lib/locale-href.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { localeHref, stripLocale } from "./locale-href";

describe("localeHref", () => {
  it("prefixes an internal path with the locale", () => {
    expect(localeHref("it", "/platform")).toBe("/it/platform");
  });

  it("maps the root path to the locale root", () => {
    expect(localeHref("en", "/")).toBe("/en");
  });

  it("leaves external and non-path hrefs untouched", () => {
    expect(localeHref("it", "mailto:info@isagog.com")).toBe("mailto:info@isagog.com");
    expect(localeHref("it", "https://example.com")).toBe("https://example.com");
    expect(localeHref("it", "#contatto")).toBe("#contatto");
  });
});

describe("stripLocale", () => {
  it("removes a leading locale segment", () => {
    expect(stripLocale("/it/platform")).toBe("/platform");
    expect(stripLocale("/en/blog/article-1")).toBe("/blog/article-1");
  });

  it("returns the root for a bare locale segment", () => {
    expect(stripLocale("/it")).toBe("/");
    expect(stripLocale("/en/")).toBe("/");
  });

  it("leaves a pathname without a locale prefix unchanged", () => {
    expect(stripLocale("/platform")).toBe("/platform");
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot resolve `./locale-href`.

- [ ] **Step 7: Implement `src/lib/locale-href.ts`**

```ts
export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

const localePattern = new RegExp(`^/(${locales.join("|")})(/.*)?$`);

/**
 * Prefix an internal absolute path with the active locale.
 * External links (http, mailto, #, etc.) are returned unchanged.
 */
export function localeHref(locale: string, href: string): string {
  if (!href.startsWith("/")) return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

/**
 * Remove a leading /it or /en segment from a pathname so locale-agnostic
 * route checks (active nav state) keep working after static export.
 */
export function stripLocale(pathname: string): string {
  const match = pathname.match(localePattern);
  if (!match) return pathname;
  const rest = match[2];
  if (rest === undefined || rest === "/") return "/";
  return rest;
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS — 6 tests.

- [ ] **Step 9: Add `cn` and the i18n wiring**

`src/lib/utils.ts`:

```ts
import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`src/packages/locales/server.ts`:

```ts
import { createI18nServer } from "next-international/server";

export { setStaticParamsLocale } from "next-international/server";

export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
  it: () => import("./lang/it"),
  en: () => import("./lang/en"),
});
```

`src/packages/locales/client.ts`:

```ts
"use client";
import { createI18nClient } from "next-international/client";

export const {
  useI18n,
  useScopedI18n,
  I18nProviderClient,
  useChangeLocale,
  useCurrentLocale,
} = createI18nClient({
  it: () => import("./lang/it"),
  en: () => import("./lang/en"),
});
```

`src/packages/locales/lang/it.ts` — seed with the nav copy from `bozzacompleta.html:237–247` and the footer links from `:496–505`:

```ts
export default {
  nav: {
    wordmark: "Isagog",
    platform: "La Piattaforma",
    project: "Progetti",
    blog: "Approfondimenti",
    cta: "Valutiamo il vostro caso",
    menu: "Menu di navigazione",
  },
  footer: {
    platform: "La Piattaforma",
    project: "Progetti",
    blog: "Approfondimenti",
    copyright: "(c) {year} Isagog Srl",
    street: "Via Faà di Bruno 52",
    zip: "00195 Roma (IT)",
  },
} as const;
```

`src/packages/locales/lang/en.ts` — same shape, English from `../isagog.github.io/src/packages/locales/lang/en.ts` where it exists:

```ts
export default {
  nav: {
    wordmark: "Isagog",
    platform: "The Platform",
    project: "Projects",
    blog: "Insights",
    cta: "Let's assess your case",
    menu: "Navigation menu",
  },
  footer: {
    platform: "The Platform",
    project: "Projects",
    blog: "Insights",
    copyright: "(c) {year} Isagog Srl",
    street: "Via Faà di Bruno 52",
    zip: "00195 Roma (IT)",
  },
} as const;
```

- [ ] **Step 10: Add the minimal locale layout and homepage**

`src/app/globals.css` (placeholder, replaced in Task 2):

```css
@import "tailwindcss";
@import "tw-animate-css";
```

`src/app/[locale]/layout.tsx`:

```tsx
import { I18nProviderClient } from "@/packages/locales/client";
import { getStaticParams } from "@/packages/locales/server";
import type { ReactNode } from "react";
import "../globals.css";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <I18nProviderClient locale={locale}>
        <body>{children}</body>
      </I18nProviderClient>
    </html>
  );
}
```

`src/app/[locale]/(pages)/(index)/page.tsx`:

```tsx
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";

const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("nav");

  return <main>{t("wordmark")}</main>;
};

export default HomePage;
```

- [ ] **Step 11: Add the root locale redirect**

`public/index.html` — ported from `../isagog.github.io/public/index.html`:

```html
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Isagog</title>
    <link rel="icon" href="/favicon.ico" />
    <!-- Client-side locale redirect: static export has no middleware. -->
    <script>
      (function () {
        var supported = ["it", "en"];
        var fallback = "it";
        var lang = (navigator.language || fallback).slice(0, 2).toLowerCase();
        var locale = supported.indexOf(lang) !== -1 ? lang : fallback;
        window.location.replace("/" + locale + "/");
      })();
    </script>
    <noscript>
      <meta http-equiv="refresh" content="0; url=/it/" />
    </noscript>
  </head>
  <body>
    <p>Redirecting to <a href="/it/">Isagog</a>…</p>
  </body>
</html>
```

- [ ] **Step 12: Add the export checker**

`scripts/check-export.mjs` — starts with the routes that exist now; later tasks extend `ROUTES`:

```js
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
```

- [ ] **Step 13: Verify the whole toolchain**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Expected: tests pass, no type errors, no lint errors, build succeeds and `check-export: ok (3 files)` prints. Confirm `out/it/index.html`, `out/en/index.html` and `out/index.html` exist.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: scaffold Next.js static-export project with locale routing

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm
EOF
)"
```

---

### Task 2: Design tokens and typography

**Files:**
- Modify: `src/app/globals.css` (replace the placeholder)
- Modify: `src/app/[locale]/layout.tsx` (fonts + metadata)
- Create: `src/app/_components/custom/body-wrapper.tsx`
- Test: `src/app/globals.test.ts`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`.
- Produces: Tailwind utility names available to every later task — colours `paper`, `page`, `forest`, `forest-deep`, `sage`, `olive`, `terracotta`, `cream`, `cream-soft`, `mist`, `visione`, `tecnologia`, `persone`, `card-border`, `divider`, `num`, `result`, `prose-muted`, `muted-ink`; fonts `font-serif` (Fraunces) and `font-sans` (Inter); `BodyWrapper({ children, className }: { children: ReactNode; className?: string })`.

- [ ] **Step 1: Write the failing token test**

Create `src/app/globals.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/globals.css", "utf-8");

const TOKENS: ReadonlyArray<readonly [string, string]> = [
  ["--color-page", "#f7f8f2"],
  ["--color-paper", "#fafbf7"],
  ["--color-forest", "#173c31"],
  ["--color-forest-deep", "#1a4939"],
  ["--color-sage", "#688151"],
  ["--color-olive", "#668f3e"],
  ["--color-terracotta", "#ce4e27"],
  ["--color-cream", "#f1f5e7"],
  ["--color-cream-soft", "#d1ddca"],
  ["--color-em-dark", "#c0d78c"],
  ["--color-visione", "#183d30"],
  ["--color-tecnologia", "#e8eedf"],
  ["--color-persone", "#f0f3e9"],
  ["--color-card-border", "#d7dfd0"],
  ["--color-divider", "#adbd9e"],
  ["--color-num", "#7a876e"],
  ["--color-result", "#506943"],
  ["--color-prose-muted", "#5d6c55"],
  ["--color-muted-ink", "#536157"],
];

describe("globals.css design tokens", () => {
  it.each(TOKENS)("defines %s as %s", (token, value) => {
    expect(css).toMatch(new RegExp(`${token}\\s*:\\s*${value}\\s*;`, "i"));
  });

  it("exposes every token to Tailwind through @theme inline", () => {
    const theme = css.slice(css.indexOf("@theme inline"), css.indexOf("}", css.indexOf("@theme inline")));
    for (const [token] of TOKENS) {
      expect(theme).toContain(token);
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm test`
Expected: FAIL — the placeholder `globals.css` defines no tokens.

- [ ] **Step 3: Write `src/app/globals.css`**

Values are transcribed from `bozzacompleta.html:3–33`. `--color-page` is the draft's `--bg-page`, `--color-muted-ink` its `--muted`, `--color-paper` its `--card-bg`.

```css
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --color-page: var(--color-page);
  --color-paper: var(--color-paper);
  --color-forest: var(--color-forest);
  --color-forest-deep: var(--color-forest-deep);
  --color-sage: var(--color-sage);
  --color-olive: var(--color-olive);
  --color-terracotta: var(--color-terracotta);
  --color-cream: var(--color-cream);
  --color-cream-soft: var(--color-cream-soft);
  --color-em-dark: var(--color-em-dark);
  --color-mist: var(--color-mist);
  --color-visione: var(--color-visione);
  --color-tecnologia: var(--color-tecnologia);
  --color-persone: var(--color-persone);
  --color-card-border: var(--color-card-border);
  --color-divider: var(--color-divider);
  --color-num: var(--color-num);
  --color-result: var(--color-result);
  --color-prose-muted: var(--color-prose-muted);
  --color-muted-ink: var(--color-muted-ink);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-border: var(--border);
  --font-sans: var(--font-inter);
  --font-serif: var(--font-fraunces);
  --radius-sm: calc(var(--radius) - 2px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 3px);
}

:root {
  --radius: 5px;

  /* brand palette — bozzacompleta.html:3–33 */
  --color-page: #f7f8f2;
  --color-paper: #fafbf7;
  --color-forest: #173c31;
  --color-forest-deep: #1a4939;
  --color-sage: #688151;
  --color-olive: #668f3e;
  --color-terracotta: #ce4e27;
  --color-cream: #f1f5e7;
  --color-cream-soft: #d1ddca;
  /* emphasis inside the dark section: sage on #183d30 is only 2.77:1 */
  --color-em-dark: #c0d78c;
  --color-mist: #ccd8c8;

  /* section grounds — the page's light/dark rhythm */
  --color-visione: #183d30;
  --color-tecnologia: #e8eedf;
  --color-persone: #f0f3e9;

  /* supporting */
  --color-card-border: #d7dfd0;
  --color-divider: #adbd9e;
  --color-num: #7a876e;
  --color-result: #506943;
  --color-prose-muted: #5d6c55;
  --color-muted-ink: #536157;

  --background: var(--color-page);
  --foreground: var(--color-forest);
  --border: #d8dfd3;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
  /* The draft sets every heading in the display serif. */
  h1, h2, h3, h4, h5 {
    font-family: var(--font-serif);
    font-weight: 400;
    letter-spacing: -0.03em;
  }
}

@layer utilities {
  /* Section anchors must clear the sticky header when deep-linked. */
  .scroll-anchor {
    scroll-margin-top: 96px;
  }
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS — 19 tests.

- [ ] **Step 5: Add fonts, metadata and the body wrapper**

`src/app/_components/custom/body-wrapper.tsx`:

```tsx
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const BodyWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <body className={cn("antialiased bg-background", className)}>{children}</body>;
```

Replace `src/app/[locale]/layout.tsx` with:

```tsx
import { BodyWrapper } from "@/app/_components/custom/body-wrapper";
import { I18nProviderClient } from "@/packages/locales/client";
import { getStaticParams } from "@/packages/locales/server";
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";

export const metadata: Metadata = {
  title: "Isagog — Un'IA che sa dire cosa sa",
  description:
    "Isagog rende la conoscenza della vostra organizzazione esplicita, verificabile e utilizzabile da assistenti e applicazioni di intelligenza artificiale.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL("https://isagog.com"),
};

export function generateStaticParams() {
  return getStaticParams();
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${fraunces.variable} font-sans`}
    >
      <I18nProviderClient locale={locale}>
        <BodyWrapper>{children}</BodyWrapper>
      </I18nProviderClient>
    </html>
  );
}
```

Note the difference from the old site: the draft sets **body copy in the sans face** and reserves the serif for headings, so the `<html>` class is `font-sans`, not `font-serif`.

- [ ] **Step 6: Verify**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add design tokens and typography from the design draft

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 3: Migrate assets and content

**Files:**
- Create: `public/images/*`, `public/platform-explorer/{it,en}.html`, `public/articles-data/list.json`, `public/projects-data/list.{en,it}.json`, `public/favicon.ico`, `public/logo-new.png`
- Create: `content/articles/*.mdx`, `content/projects/{en,it}/*.mdx`
- Test: `src/lib/assets.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: the asset paths every later task references — `/images/tree.avif`, `/images/about-images/tree-{bonsai,pine,cypress,bushy,palm,canopy}.png`, `/images/team-images/{Guido.avif,Robert.avif}`, `/platform-explorer/{it,en}.html`, `/articles-data/list.json`, `/projects-data/list.{en,it}.json`.

- [ ] **Step 1: Copy the assets that already exist**

```bash
cd /Volumes/2TBWDB/code/newwebisagog/newwweb
mkdir -p public/images/about-images public/images/team-images public/images/article-images public/images/project-images
cp ../isagog.github.io/public/favicon.ico public/
cp ../isagog.github.io/public/logo-new.png public/
cp ../isagog.github.io/public/images/tree.avif public/images/
cp ../isagog.github.io/public/images/about-images/*.png public/images/about-images/
cp ../isagog.github.io/public/images/team-images/{Guido.avif,Robert.avif} public/images/team-images/
cp -R ../isagog.github.io/public/images/article-images/. public/images/article-images/
cp -R ../isagog.github.io/public/images/project-images/. public/images/project-images/
cp -R ../isagog.github.io/public/platform-explorer public/
cp -R ../isagog.github.io/public/articles-data public/
cp -R ../isagog.github.io/public/projects-data public/
mkdir -p content
cp -R ../isagog.github.io/content/articles content/
cp -R ../isagog.github.io/content/projects content/
```

- [ ] **Step 2: Extract the one image the draft has and the old site does not**

The draft's third base64 image (a 705 KB PNG of Guido) is higher-resolution than `team-images/Guido.avif` (39.7 KB). Extract it, then decide by eye which to keep.

```bash
python3 - <<'PY'
import re, base64, pathlib
src = pathlib.Path("../bozzacompleta.html").read_text(encoding="utf-8")
blobs = re.findall(r'data:image/([a-z+]+);base64,([A-Za-z0-9+/=]+)', src)
kind, b64 = blobs[2]           # third image = Guido's portrait
raw = base64.b64decode(b64)
out = pathlib.Path(f"public/images/team-images/Guido-draft.{kind}")
out.write_bytes(raw)
print(f"wrote {out} ({len(raw)/1024:.1f} KB)")
PY
```

Then convert it to AVIF under 100 KB (matching `Robert.avif`) and drop the PNG:

```bash
sips -s format avif -Z 480 public/images/team-images/Guido-draft.png --out public/images/team-images/Guido.avif
rm public/images/team-images/Guido-draft.png
ls -l public/images/team-images/
```

If `sips` produces a file over 100 KB, re-run it with `-Z 360`. If AVIF conversion fails on this machine, keep the existing `Guido.avif` copied in Step 1 and delete the extracted PNG — the portraits render at 120×120 CSS pixels (`bozzacompleta.html:190`), so the smaller file is sufficient.

- [ ] **Step 3: Write the asset-existence test**

Create `src/lib/assets.test.ts`:

```ts
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

const REQUIRED = [
  "public/favicon.ico",
  "public/logo-new.png",
  "public/index.html",
  "public/images/tree.avif",
  "public/images/about-images/tree-bonsai.png",
  "public/images/about-images/tree-pine.png",
  "public/images/about-images/tree-cypress.png",
  "public/images/about-images/tree-bushy.png",
  "public/images/about-images/tree-palm.png",
  "public/images/team-images/Guido.avif",
  "public/images/team-images/Robert.avif",
  "public/platform-explorer/it.html",
  "public/platform-explorer/en.html",
  "public/articles-data/list.json",
  "public/projects-data/list.it.json",
  "public/projects-data/list.en.json",
];

describe("required assets", () => {
  it.each(REQUIRED)("%s exists", (path) => {
    expect(existsSync(path)).toBe(true);
  });
});

describe("required content", () => {
  it("has five articles", () => {
    for (let n = 1; n <= 5; n += 1) {
      expect(existsSync(`content/articles/article-${n}.mdx`)).toBe(true);
    }
  });

  it.each(["it", "en"])("has three %s case studies", (locale) => {
    for (const slug of ["maxxi-case-study", "manifesto-case-study", "teleperformance-case-study"]) {
      expect(existsSync(`content/projects/${locale}/${slug}.mdx`)).toBe(true);
    }
  });
});
```

- [ ] **Step 4: Run the test**

Run: `pnpm test`
Expected: PASS. Any failure names the exact missing file — copy it and re-run.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: migrate images, platform explorer, list data and MDX content

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 4: Shared chrome — header, section rail, footer

**Files:**
- Create: `src/lib/sections.ts`, `src/app/_components/custom/{locale-link,header,footer,section-rail,section-heading}.tsx`
- Create: `src/app/_components/ui/dropdown-menu.tsx`
- Modify: `src/app/[locale]/layout.tsx` (mount Header/Footer)
- Modify: `src/packages/locales/lang/{it,en}.ts` (add `rail` keys)
- Test: `src/lib/sections.test.ts`

**Interfaces:**
- Consumes: `localeHref`, `stripLocale`, `cn`, `useCurrentLocale`, `useScopedI18n`.
- Produces:
  - `type SectionId = "visione" | "metodologia" | "tecnologia" | "persone" | "contatto"`
  - `SECTIONS: readonly { readonly id: SectionId; readonly number: string }[]`
  - `computeActiveSection(tops: readonly { id: SectionId; top: number }[], scrollY: number, offset?: number): SectionId | null`
  - `LocaleLink` (drop-in for `next/link`), `Header`, `Footer`, `SectionRail`
  - `SectionHeading({ eyebrow, title, lead, tone, className }: { eyebrow: string; title: ReactNode; lead?: ReactNode; tone?: "light" | "dark"; className?: string })`

- [ ] **Step 1: Write the failing test for the scroll rail's logic**

Create `src/lib/sections.test.ts`:

```ts
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot resolve `./sections`.

- [ ] **Step 3: Implement `src/lib/sections.ts`**

```ts
export type SectionId =
  | "visione"
  | "metodologia"
  | "tecnologia"
  | "persone"
  | "contatto";

/**
 * The homepage's reading order. `number` mirrors the draft's own 01–04
 * labelling, which skips the people section.
 */
export const SECTIONS: ReadonlyArray<{
  readonly id: SectionId;
  readonly number: string;
}> = [
  { id: "visione", number: "01" },
  { id: "metodologia", number: "02" },
  { id: "tecnologia", number: "03" },
  { id: "persone", number: "" },
  { id: "contatto", number: "04" },
];

/**
 * The section the reader is currently in: the last one whose top edge has
 * scrolled above `scrollY + offset`. Null while still above the first.
 * Pure so the rail's behaviour is testable without a DOM.
 */
export const computeActiveSection = (
  tops: ReadonlyArray<{ id: SectionId; top: number }>,
  scrollY: number,
  offset = 100
): SectionId | null => {
  let active: SectionId | null = null;
  for (const section of tops) {
    if (section.top <= scrollY + offset) active = section.id;
  }
  return active;
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS — 7 new tests.

- [ ] **Step 5: Add the rail copy to both locale files**

Add to `it.ts` (alongside `nav`):

```ts
  rail: {
    visione: "Visione",
    metodologia: "Metodologia",
    tecnologia: "Tecnologia",
    persone: "Persone",
    contatto: "Contatto",
    label: "Sezioni della pagina",
  },
```

Add the same shape to `en.ts`:

```ts
  rail: {
    visione: "Vision",
    metodologia: "Method",
    tecnologia: "Technology",
    persone: "People",
    contatto: "Contact",
    label: "Page sections",
  },
```

- [ ] **Step 6: Write `LocaleLink`**

`src/app/_components/custom/locale-link.tsx`:

```tsx
"use client";

import { localeHref } from "@/lib/locale-href";
import { useCurrentLocale } from "@/packages/locales/client";
import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Drop-in replacement for next/link that prefixes internal hrefs with the
 * current locale ("/platform" -> "/it/platform"). Required because the static
 * export uses real /it and /en URL segments instead of middleware rewrites.
 * In-page anchors ("#contatto") and external hrefs pass through untouched.
 */
export const LocaleLink = ({ href, ...props }: ComponentProps<typeof Link>) => {
  const locale = useCurrentLocale();
  const resolved = typeof href === "string" ? localeHref(locale, href) : href;
  return <Link href={resolved} {...props} />;
};
```

- [ ] **Step 7: Write the section rail**

`src/app/_components/custom/section-rail.tsx` — a client component; desktop only (`hidden lg:block`), fixed to the left edge, appearing once the reader is past the hero.

```tsx
"use client";

import { SECTIONS, computeActiveSection } from "@/lib/sections";
import type { SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/packages/locales/client";
import { useEffect, useState } from "react";

export const SectionRail = () => {
  const t = useScopedI18n("rail");
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const tops = SECTIONS.flatMap((section) => {
        const el = document.getElementById(section.id);
        if (el === null) return [];
        return [{ id: section.id, top: el.offsetTop }];
      });
      setActive(computeActiveSection(tops, window.scrollY));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav
      aria-label={t("label")}
      className={cn(
        "hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3",
        "transition-opacity duration-500",
        active === null ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      {SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-3 text-[12px] tracking-[0.1em] uppercase"
          >
            <span
              className={cn(
                "h-px transition-all duration-300",
                isActive ? "w-8 bg-terracotta" : "w-4 bg-divider group-hover:w-6"
              )}
            />
            <span
              className={cn(
                "transition-colors duration-300",
                isActive ? "text-forest" : "text-num group-hover:text-forest"
              )}
            >
              <span className="tabular-nums mr-1">{section.number}</span>
              {t(section.id)}
            </span>
          </a>
        );
      })}
    </nav>
  );
};
```

Note: the rail uses a bare `<a href="#…">` deliberately — in-page anchors need no locale prefix and no client-side routing.

- [ ] **Step 8: Write the header and footer**

Copy `src/app/_components/ui/dropdown-menu.tsx` verbatim from `../isagog.github.io/src/app/_components/ui/dropdown-menu.tsx` (it is vendored shadcn and the ESLint override already exempts that directory).

`src/app/_components/custom/header.tsx` — ports `bozzacompleta.html:237–247`; three page links plus the CTA, collapsing to a dropdown under `lg`:

```tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { stripLocale } from "@/lib/locale-href";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/packages/locales/client";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LocaleLink as Link } from "./locale-link";

export const Header = () => {
  const t = useScopedI18n("nav");
  const pathname = stripLocale(usePathname());
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/platform", label: t("platform") },
    { href: "/project", label: t("project") },
    { href: "/blog", label: t("blog") },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-page/90 backdrop-blur-sm border-b border-border">
      <div className="mx-auto flex max-w-[1224px] items-center justify-between gap-4 px-6 py-4 max-[640px]:px-6">
        <Link href="/" className="font-serif text-[22px] text-forest">
          {t("wordmark")}
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[15px] text-forest/80 hover:text-forest transition-colors",
                pathname.startsWith(item.href) && "text-forest font-medium"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contatto"
            className="rounded-[5px] bg-forest-deep px-5 py-3 text-[15px] font-medium text-white"
          >
            {t("cta")}
          </Link>
        </nav>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            aria-label={t("menu")}
            className="lg:hidden flex h-8 w-8 items-center justify-center"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-page border-card-border">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href} className="text-[15px] text-forest">
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem asChild>
              <Link href="/#contatto" className="text-[15px] text-terracotta">
                {t("cta")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
```

`src/app/_components/custom/footer.tsx` — ports `bozzacompleta.html:496–505`, with the real address replacing the draft's "bozza homepage" note:

```tsx
"use client";

import { useScopedI18n } from "@/packages/locales/client";
import { LocaleLink as Link } from "./locale-link";

export const Footer = () => {
  const t = useScopedI18n("footer");

  return (
    <footer className="border-t border-card-border bg-page">
      <div className="mx-auto flex max-w-[1224px] flex-col gap-4 px-6 py-8 text-[14px] text-prose-muted sm:flex-row sm:items-center sm:justify-between">
        <span>
          {t("copyright", { year: String(new Date().getFullYear()) })} — {t("street")}, {t("zip")}
        </span>
        <div className="flex flex-wrap gap-6">
          <Link href="/platform" className="hover:text-forest">{t("platform")}</Link>
          <Link href="/project" className="hover:text-forest">{t("project")}</Link>
          <Link href="/blog" className="hover:text-forest">{t("blog")}</Link>
        </div>
      </div>
    </footer>
  );
};
```

- [ ] **Step 9: Write the shared section heading**

`src/app/_components/custom/section-heading.tsx` — the eyebrow + title + lead block repeated by four sections (`bozzacompleta.html:319–325, 347–353, 390–396, 461–470`):

```tsx
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const SectionHeading = ({
  eyebrow,
  title,
  lead,
  tone = "light",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
      className
    )}
  >
    <div>
      <span
        className={cn(
          "block text-[12px] font-semibold uppercase tracking-[0.1em]",
          tone === "dark" ? "text-cream-soft" : "text-forest"
        )}
      >
        {eyebrow}
      </span>
      <h3
        className={cn(
          "mt-4 text-[clamp(28px,3.4vw,39px)] leading-[1.15]",
          tone === "dark" ? "text-cream" : "text-forest"
        )}
      >
        {title}
      </h3>
    </div>
    {lead !== undefined && (
      <p
        className={cn(
          "max-w-[310px] text-[16px] font-semibold leading-[1.5]",
          tone === "dark" ? "text-cream-soft" : "text-terracotta"
        )}
      >
        {lead}
      </p>
    )}
  </div>
);
```

- [ ] **Step 10: Mount the chrome in the layout**

In `src/app/[locale]/layout.tsx`, import `Header`, `Footer` and `SectionRail`, and replace `<BodyWrapper>{children}</BodyWrapper>` with:

```tsx
        <BodyWrapper className="pt-[72px]">
          <Header />
          <SectionRail />
          {children}
          <Footer />
        </BodyWrapper>
```

- [ ] **Step 11: Verify**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Expected: all pass. Then `pnpm dev` and confirm at `http://localhost:3000/it/`: the header renders, the mobile dropdown opens under 1024px, and the rail is invisible (no sections exist yet).

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add header, footer and scroll-spy section rail

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 5: Hero, apertura and the knowledge card

**Files:**
- Create: `src/app/[locale]/(pages)/(index)/components/{hero,apertura,knowledge-card,index}.tsx`
- Modify: `src/app/[locale]/(pages)/(index)/page.tsx`
- Modify: `src/packages/locales/lang/{it,en}.ts`

**Interfaces:**
- Consumes: `LocaleLink`, `getScopedI18n`, `setStaticParamsLocale`. (Not `SectionHeading` — the hero and apertura have bespoke heading markup in the draft; `SectionHeading` serves the four numbered sections in Tasks 6–8.)
- Produces: `Hero`, `Apertura`, `KnowledgeCard` — all server components taking no props; re-exported from `./components`.

- [ ] **Step 1: Add the copy keys**

Transcribe verbatim from `bozzacompleta.html:248–316` into `it.ts` under a new `home` scope. English keys mirror the structure with the Italian text for now (see Global Constraints).

```ts
  home: {
    hero: {
      imageAlt: "Illustrazione di un albero, Isagog",
      title: "Un'IA che sa dire cosa sa",
      tagline: "E che quando serve sa dire: non lo so",
    },
    apertura: {
      eyebrow: "INTELLIGENZA ARTIFICIALE · CONOSCENZA ESPLICITA",
      titleLine1: "Dare forma alla",
      titleEm: "vostra conoscenza.",
      titleLine2: "Poi farla ragionare.",
      sub: "La conoscenza della vostra organizzazione vive in molte forme: in documenti e conversazioni, in tabelle e transazioni, nei dati e nell'esperienza delle persone. Isagog la rende esplicita, verificabile e utilizzabile da assistenti e applicazioni di intelligenza artificiale, con una visione, un metodo e una piattaforma.",
      ctaPrimary: "Valutiamo il vostro caso ↗",
      ctaSecondary: "Scoprite come funziona",
    },
    card: {
      org: "MUSEO AURORA",
      sample: "SCENARIO INVENTATO",
      questionLabel: "UNA DOMANDA DEL VISITATORE",
      questionLine1: "Quali opere posso scoprire?",
      questionLine2: "Chi le ha realizzate?",
      originKind: "MOSTRA",
      originName: "Luce e colore",
      edgeComprende: "comprende",
      edgeRealizzata: "realizzata da",
      workKind: "OPERA",
      work1: "Il giardino blu",
      work2: "La città al tramonto",
      author1: "Luca Bianchi",
      author2: "Sofia Conti",
      answerTitle: "Due fonti collegate. Una risposta.",
      answerLink: "Esplorate il percorso e le schede →",
      disclaimer: "Museo, persone, opere e documenti sono interamente inventati.",
    },
  },
```

- [ ] **Step 2: Write the hero**

`src/app/[locale]/(pages)/(index)/components/hero.tsx` — ports `bozzacompleta.html:248–253`:

```tsx
import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";

export const Hero = async () => {
  const t = await getScopedI18n("home.hero");

  return (
    <section className="flex flex-col items-center px-6 pt-16 pb-10 text-center">
      <Image
        src="/images/tree.avif"
        alt={t("imageAlt")}
        width={320}
        height={320}
        preload
        className="h-auto w-[220px] sm:w-[280px]"
      />
      <h1 className="mt-8 text-[clamp(34px,5vw,56px)] leading-[1.1] text-forest">
        {t("title")}
      </h1>
      <p className="mt-4 text-[18px] text-prose-muted">{t("tagline")}</p>
    </section>
  );
};
```

- [ ] **Step 3: Write the knowledge card**

`src/app/[locale]/(pages)/(index)/components/knowledge-card.tsx` — ports `.museum-hero`, `bozzacompleta.html:275–315`. Phase 2 replaces this component's contents; keep it self-contained.

```tsx
import { getScopedI18n } from "@/packages/locales/server";
import { ArrowUpRight, Check, Network, Palette, User } from "lucide-react";

const Node = ({
  kind,
  name,
  variant = "plain",
}: {
  kind?: string;
  name: string;
  variant?: "plain" | "origin" | "person";
}) => (
  <div
    className={
      variant === "origin"
        ? "flex items-center gap-3 rounded-[5px] bg-forest px-5 py-4 text-cream"
        : variant === "person"
          ? "flex items-center gap-3 rounded-[5px] border border-card-border bg-persone px-4 py-3 text-forest"
          : "flex items-center gap-3 rounded-[5px] border border-card-border bg-paper px-4 py-3 text-forest"
    }
  >
    {variant === "person" ? (
      <User size={16} strokeWidth={2} />
    ) : variant === "origin" ? (
      <Network size={19} strokeWidth={2} />
    ) : (
      <Palette size={17} strokeWidth={2} />
    )}
    <span className="flex flex-col leading-tight">
      {kind !== undefined && (
        <small className="text-[11px] uppercase tracking-[0.08em] opacity-70">{kind}</small>
      )}
      <strong className="font-serif text-[18px] font-normal">{name}</strong>
    </span>
  </div>
);

const Edge = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center py-2 text-[13px] text-sage">
    <span>{label}</span>
    <span aria-hidden="true">↓</span>
  </div>
);

export const KnowledgeCard = async () => {
  const t = await getScopedI18n("home.card");

  return (
    <div className="rounded-[8px] bg-tecnologia p-6 sm:p-8">
      <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.1em] text-forest">
        <span className="flex items-center gap-2">
          <Network size={18} strokeWidth={2} />
          {t("org")}
        </span>
        <span className="text-num">{t("sample")}</span>
      </div>

      <div className="mt-8">
        <span className="text-[12px] uppercase tracking-[0.1em] text-num">
          {t("questionLabel")}
        </span>
        <p className="mt-3 font-serif text-[clamp(24px,2.6vw,31px)] leading-[1.2] text-forest">
          {t("questionLine1")}
          <br />
          {t("questionLine2")}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <Node kind={t("originKind")} name={t("originName")} variant="origin" />
        <Edge label={t("edgeComprende")} />
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col">
            <Node kind={t("workKind")} name={t("work1")} />
            <Edge label={t("edgeRealizzata")} />
            <Node name={t("author1")} variant="person" />
          </div>
          <div className="flex flex-col">
            <Node kind={t("workKind")} name={t("work2")} />
            <Edge label={t("edgeRealizzata")} />
            <Node name={t("author2")} variant="person" />
          </div>
        </div>
      </div>

      <a
        href="#visione"
        className="mt-8 flex items-center gap-4 rounded-[5px] bg-paper px-5 py-4 text-forest"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-persone">
          <Check size={15} strokeWidth={2} />
        </span>
        <span className="flex flex-1 flex-col">
          <strong className="text-[16px]">{t("answerTitle")}</strong>
          <span className="text-[14px] text-prose-muted">{t("answerLink")}</span>
        </span>
        <ArrowUpRight size={20} strokeWidth={2} />
      </a>

      <p className="mt-4 text-[13px] text-prose-muted">{t("disclaimer")}</p>
    </div>
  );
};
```

- [ ] **Step 4: Write the apertura section**

`src/app/[locale]/(pages)/(index)/components/apertura.tsx` — ports `bozzacompleta.html:254–274`, two columns collapsing under 900px (the draft's own breakpoint):

```tsx
import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { getScopedI18n } from "@/packages/locales/server";
import { KnowledgeCard } from "./knowledge-card";

export const Apertura = async () => {
  const t = await getScopedI18n("home.apertura");

  return (
    <section className="bg-page px-6 py-16">
      <div className="mx-auto grid max-w-[1224px] items-start gap-12 min-[900px]:grid-cols-2">
        <div>
          <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-forest">
            <span className="h-2 w-2 rounded-full bg-terracotta" aria-hidden="true" />
            {t("eyebrow")}
          </span>
          <h2 className="mt-6 text-[clamp(32px,4vw,46px)] leading-[1.15] text-forest">
            {t("titleLine1")}
            <br />
            <em className="not-italic text-sage">{t("titleEm")}</em>
            <br />
            {t("titleLine2")}
          </h2>
          <p className="mt-6 max-w-[520px] text-[16.5px] leading-[1.6] text-prose-muted">
            {t("sub")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/#contatto"
              className="rounded-[5px] bg-forest-deep px-5 py-3.5 text-[15px] font-medium text-white"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/#visione"
              className="rounded-[5px] border border-forest/25 px-5 py-3.5 text-[15px] text-forest"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        <KnowledgeCard />
      </div>
    </section>
  );
};
```

- [ ] **Step 5: Add the barrel and mount the sections**

`src/app/[locale]/(pages)/(index)/components/index.tsx`:

```tsx
export { Apertura } from "./apertura";
export { Hero } from "./hero";
export { KnowledgeCard } from "./knowledge-card";
```

`src/app/[locale]/(pages)/(index)/page.tsx`:

```tsx
import { setStaticParamsLocale } from "@/packages/locales/server";
import { Apertura, Hero } from "./components";

const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Hero />
      <Apertura />
    </main>
  );
};

export default HomePage;
```

- [ ] **Step 6: Verify**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Then `pnpm dev` and compare `http://localhost:3000/it/` against `bozzacompleta.html` opened in a second tab, at 640px, 900px and desktop widths. The card must stack to one column under 900px.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add hero, apertura and knowledge card sections

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 6: Section 01 — Visione

**Files:**
- Create: `src/app/[locale]/(pages)/(index)/components/{visione,demo-slot}.tsx`
- Modify: `src/app/[locale]/(pages)/(index)/components/index.tsx`, `page.tsx`, `src/packages/locales/lang/{it,en}.ts`

**Interfaces:**
- Consumes: `SectionHeading` (with `tone="dark"`).
- Produces: `Visione`, `DemoSlot` — server components, no props. The rendered `<section>` carries `id="visione"` so the rail can find it.

- [ ] **Step 1: Add the copy**

Transcribe `bozzacompleta.html:317–344` verbatim into `home.visione`: `eyebrow` ("01 / VISIONE"), `titleLine1`, `titleEm`, `lead`, the four prose paragraphs `p1`–`p4` (`p4` contains the italicised *Isagoge* and *Categorie* — split it as `p4a`, `p4Isagoge`, `p4b`, `p4Categorie`, `p4c` so the emphasis survives translation), `bonsaiAlt`, plus the museum-business block (`caseEyebrow`, `caseTitleLine1`, `caseTitleLine2`, `caseBody`).

- [ ] **Step 2: Write the demo slot**

`src/app/[locale]/(pages)/(index)/components/demo-slot.tsx` — the draft's dashed `.demo-note` (`bozzacompleta.html:343`) is a note to the reviewer, not shippable copy. This renders nothing in production while keeping the position explicit for phase 2:

```tsx
/**
 * Landing point for the interactive museum demo (phase 2: three-industry
 * version driven by the MAXXI, mema and isagog-top ontologies).
 * Renders nothing until that exists — the draft's dashed placeholder note
 * was a review artifact and must not ship.
 */
export const DemoSlot = () => null;
```

- [ ] **Step 3: Write the section**

`src/app/[locale]/(pages)/(index)/components/visione.tsx`:

```tsx
import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";
import { DemoSlot } from "./demo-slot";

export const Visione = async () => {
  const t = await getScopedI18n("home.visione");

  return (
    <section id="visione" className="scroll-anchor bg-visione px-6 py-20">
      <div className="mx-auto max-w-[1224px]">
        <SectionHeading
          tone="dark"
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("titleLine1")}
              <br />
              {/* text-em-dark, not text-sage: sage on the dark ground is 2.77:1 */}
              <em className="not-italic text-em-dark">{t("titleEm")}</em>
            </>
          }
          lead={t("lead")}
        />

        <div className="mt-12 grid gap-x-10 text-[16.5px] leading-[1.6] text-cream-soft md:grid-cols-2">
          <p className="mb-5">{t("p1")}</p>
          <p className="mb-5">{t("p2")}</p>
          <p className="mb-5">{t("p3")}</p>
          <p className="mb-5 overflow-hidden">
            <Image
              src="/images/about-images/tree-bonsai.png"
              alt={t("bonsaiAlt")}
              width={160}
              height={160}
              className="float-right ml-4 mb-2 h-[72px] w-auto object-contain opacity-90"
            />
            {t("p4a")}
            <em>{t("p4Isagoge")}</em>
            {t("p4b")}
            <em>{t("p4Categorie")}</em>
            {t("p4c")}
          </p>
        </div>

        <div className="mt-10 grid gap-10 border-t border-cream/15 pt-8 md:grid-cols-2 md:items-end">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-cream-soft">
              {t("caseEyebrow")}
            </span>
            <h4 className="mt-4 font-serif text-[clamp(24px,2.6vw,31px)] leading-[1.2] text-cream">
              {t("caseTitleLine1")}
              <br />
              {t("caseTitleLine2")}
            </h4>
          </div>
          <p className="text-[15.5px] leading-[1.55] text-cream-soft">{t("caseBody")}</p>
        </div>

        <DemoSlot />
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Mount it**

Add `export { Visione } from "./visione";` and `export { DemoSlot } from "./demo-slot";` to the barrel, and render `<Visione />` after `<Apertura />` in `page.tsx`.

- [ ] **Step 5: Verify**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Then in `pnpm dev`: scroll past the hero and confirm the rail appears with `01 Visione` active; click a rail entry and confirm the section lands clear of the sticky header (the `.scroll-anchor` offset); confirm `/it/#visione` deep-links correctly on a fresh load.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add the Visione section and the phase-2 demo slot

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 7: Section 02 — Metodologia

**Files:**
- Create: `src/app/[locale]/(pages)/(index)/components/metodologia.tsx`, `src/app/_components/custom/capability-card.tsx`
- Modify: barrel, `page.tsx`, `src/packages/locales/lang/{it,en}.ts`

**Interfaces:**
- Consumes: `SectionHeading` (light tone).
- Produces: `Metodologia`; `CapabilityCard({ number, title, body, result, icon }: { number: string; title: string; body: string; result: string; icon: ReactNode })`. Section id: `metodologia`.

- [ ] **Step 1: Add the copy**

Transcribe `bozzacompleta.html:345–387`: `eyebrow` ("02 / METODOLOGIA"), `titleLine1` ("Agli agenti l'analisi."), `titleEm` ("Agli esperti il giudizio."), `lead`, `p1`, `p2`, the three capabilities (`cap1.title` "Rappresentare" / `cap1.body` / `cap1.result`, `cap2` "Raccogliere", `cap3` "Ragionare"), and `closing`.

- [ ] **Step 2: Write the card component**

`src/app/_components/custom/capability-card.tsx` — ports `.capabilities article`, `bozzacompleta.html:355–380`:

```tsx
import type { ReactNode } from "react";

export const CapabilityCard = ({
  number,
  title,
  body,
  result,
  icon,
}: {
  number: string;
  title: string;
  body: string;
  result: string;
  icon: ReactNode;
}) => (
  <article className="rounded-[5px] border border-card-border bg-paper p-7">
    <span className="block text-forest">{icon}</span>
    <span className="mt-4 block text-[12px] tracking-[0.1em] text-num">{number}</span>
    <h4 className="mt-3 font-serif text-[24px] text-forest">{title}</h4>
    <p className="mt-3 mb-6 text-[16px] leading-[1.5] text-prose-muted">{body}</p>
    <span className="text-[12px] text-result">{result}</span>
  </article>
);
```

- [ ] **Step 3: Write the section**

`src/app/[locale]/(pages)/(index)/components/metodologia.tsx`:

```tsx
import { CapabilityCard } from "@/app/_components/custom/capability-card";
import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";
import { Brain, Database, ScanText } from "lucide-react";

export const Metodologia = async () => {
  const t = await getScopedI18n("home.metodologia");

  return (
    <section id="metodologia" className="scroll-anchor bg-page px-6 py-20">
      <div className="mx-auto max-w-[1224px]">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("titleLine1")}
              <br />
              <em className="not-italic text-sage">{t("titleEm")}</em>
            </>
          }
          lead={t("lead")}
        />

        <div className="mt-10 grid gap-x-10 text-[16.5px] leading-[1.6] text-prose-muted md:grid-cols-2">
          <p className="mb-5">{t("p1")}</p>
          <p className="mb-5">{t("p2")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <CapabilityCard
            number="01"
            icon={<ScanText size={24} strokeWidth={2} />}
            title={t("cap1.title")}
            body={t("cap1.body")}
            result={t("cap1.result")}
          />
          <CapabilityCard
            number="02"
            icon={<Database size={24} strokeWidth={2} />}
            title={t("cap2.title")}
            body={t("cap2.body")}
            result={t("cap2.result")}
          />
          <CapabilityCard
            number="03"
            icon={<Brain size={24} strokeWidth={2} />}
            title={t("cap3.title")}
            body={t("cap3.body")}
            result={t("cap3.result")}
          />
        </div>

        <p className="mt-9 max-w-[800px] font-serif text-[19px] italic leading-[1.5] text-forest">
          {t("closing")}
        </p>
      </div>
    </section>
  );
};
```

Note: the three cards are written out rather than mapped because `next-international`'s `t()` requires literal key paths for type inference.

- [ ] **Step 4: Mount, verify, commit**

Add to the barrel, render `<Metodologia />` after `<Visione />`.

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Then check in `pnpm dev` that the three cards sit in one row on desktop and stack under 768px.

```bash
git add -A
git commit -m "feat: add the Metodologia section with capability cards

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 8: Section 03 — Tecnologia

**Files:**
- Create: `src/app/[locale]/(pages)/(index)/components/tecnologia.tsx`
- Modify: barrel, `page.tsx`, `src/packages/locales/lang/{it,en}.ts`

**Interfaces:**
- Consumes: `SectionHeading`, `LocaleLink`.
- Produces: `Tecnologia`. Section id: `tecnologia`.

- [ ] **Step 1: Add the copy**

Transcribe `bozzacompleta.html:388–431`: `eyebrow` ("03 / TECNOLOGIA"), `titleLine1` ("Una piattaforma"), `titleEm` ("nelle vostre mani."), `lead` ("Sui vostri sistemi, con i vostri dati, ai vostri costi."), `p1`, `p2`; `usecasesLabel` and four use-cases (`uc1.title` "Un ufficio legale" / `uc1.body`, `uc2` "Un servizio clienti", `uc3` "Un oncologo", `uc4` "Una guida museale") plus `usecasesClose`; three controls (`ctrl1.title` "Infrastruttura vostra." / `ctrl1.body`, `ctrl2`, `ctrl3`); `badge` and `cta` ("Esplorate la piattaforma").

- [ ] **Step 2: Write the section**

```tsx
import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

export const Tecnologia = async () => {
  const t = await getScopedI18n("home.tecnologia");

  return (
    <section id="tecnologia" className="scroll-anchor bg-tecnologia px-6 py-20">
      <div className="mx-auto max-w-[1224px]">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("titleLine1")}
              <br />
              <em className="not-italic text-sage">{t("titleEm")}</em>
            </>
          }
          lead={t("lead")}
        />

        <div className="mt-10 grid gap-x-10 text-[16.5px] leading-[1.6] text-prose-muted md:grid-cols-2">
          <p className="mb-5">{t("p1")}</p>
          <p className="mb-5">{t("p2")}</p>
        </div>

        <div className="mb-10 border-t border-divider pt-7">
          <span className="mb-5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-sage">
            {t("usecasesLabel")}
          </span>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h5 className="mb-2 font-serif text-[18px] text-forest">{t("uc1.title")}</h5>
              <p className="text-[14.5px] leading-[1.5] text-prose-muted">{t("uc1.body")}</p>
            </div>
            <div>
              <h5 className="mb-2 font-serif text-[18px] text-forest">{t("uc2.title")}</h5>
              <p className="text-[14.5px] leading-[1.5] text-prose-muted">{t("uc2.body")}</p>
            </div>
            <div>
              <h5 className="mb-2 font-serif text-[18px] text-forest">{t("uc3.title")}</h5>
              <p className="text-[14.5px] leading-[1.5] text-prose-muted">{t("uc3.body")}</p>
            </div>
            <div>
              <h5 className="mb-2 font-serif text-[18px] text-forest">{t("uc4.title")}</h5>
              <p className="text-[14.5px] leading-[1.5] text-prose-muted">{t("uc4.body")}</p>
            </div>
          </div>
          <p className="mt-7 max-w-[800px] text-[16px] leading-[1.55] text-prose-muted">
            {t("usecasesClose")}
          </p>
        </div>

        <div className="my-9 grid gap-8 md:grid-cols-3">
          <article className="border-t border-divider pt-6">
            <h4 className="mb-3 font-serif text-[24px] text-forest">{t("ctrl1.title")}</h4>
            <p className="text-[16px] text-prose-muted">{t("ctrl1.body")}</p>
          </article>
          <article className="border-t border-divider pt-6">
            <h4 className="mb-3 font-serif text-[24px] text-forest">{t("ctrl2.title")}</h4>
            <p className="text-[16px] text-prose-muted">{t("ctrl2.body")}</p>
          </article>
          <article className="border-t border-divider pt-6">
            <h4 className="mb-3 font-serif text-[24px] text-forest">{t("ctrl3.title")}</h4>
            <p className="text-[16px] text-prose-muted">{t("ctrl3.body")}</p>
          </article>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-divider pt-6">
          <span className="flex items-center gap-2 text-[14px] text-forest">
            <ShieldCheck size={18} strokeWidth={2} />
            {t("badge")}
          </span>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 rounded-[5px] bg-forest-deep px-5 py-3.5 text-[15px] font-medium text-white"
          >
            {t("cta")}
            <ArrowUpRight size={18} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 3: Mount, verify, commit**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Check the four use-cases sit in one row at desktop, two columns at 640–1024px, one below.

```bash
git add -A
git commit -m "feat: add the Tecnologia section

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 9: Le persone

**Files:**
- Create: `src/app/[locale]/(pages)/(index)/components/persone.tsx`
- Modify: barrel, `page.tsx`, `src/packages/locales/lang/{it,en}.ts`

**Interfaces:**
- Consumes: `getScopedI18n`.
- Produces: `Persone`. Section id: `persone`.

- [ ] **Step 1: Add the copy**

Transcribe `bozzacompleta.html:432–458`: `eyebrow` ("LE PERSONE DI ISAGOG"), `titleLine1` ("Esperienza profonda."), `titleEm` ("Un confronto diretto."), `lead`, and for each person `name`, `role`, `bio` (`guido`, `robert`).

- [ ] **Step 2: Write the section**

```tsx
import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";

export const Persone = async () => {
  const t = await getScopedI18n("home.persone");

  return (
    <section id="persone" className="scroll-anchor bg-persone px-6 py-20">
      <div className="mx-auto max-w-[1224px]">
        <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-forest">
          {t("eyebrow")}
        </span>
        <h3 className="mt-4 text-[clamp(28px,3.4vw,39px)] leading-[1.15] text-forest">
          {t("titleLine1")}
          <br />
          <em className="not-italic text-sage">{t("titleEm")}</em>
        </h3>
        <p className="mt-5 max-w-[640px] text-[19px] leading-[1.5] text-forest/85">{t("lead")}</p>

        <div className="mt-10 grid gap-9 md:grid-cols-2">
          <div className="flex items-start gap-6">
            <Image
              src="/images/team-images/Guido.avif"
              alt={t("guido.name")}
              width={240}
              height={240}
              className="h-[120px] w-[120px] shrink-0 rounded-[4px] object-cover"
            />
            <div>
              <h4 className="font-serif text-[23px] text-forest">{t("guido.name")}</h4>
              <p className="mt-1.5 mb-3 text-[13.5px] font-semibold leading-[1.4] text-sage">
                {t("guido.role")}
              </p>
              <p className="text-[15px] leading-[1.55] text-muted-ink">{t("guido.bio")}</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Image
              src="/images/team-images/Robert.avif"
              alt={t("robert.name")}
              width={240}
              height={240}
              className="h-[120px] w-[120px] shrink-0 rounded-[4px] object-cover"
            />
            <div>
              <h4 className="font-serif text-[23px] text-forest">{t("robert.name")}</h4>
              <p className="mt-1.5 mb-3 text-[13.5px] font-semibold leading-[1.4] text-sage">
                {t("robert.role")}
              </p>
              <p className="text-[15px] leading-[1.55] text-muted-ink">{t("robert.bio")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 3: Mount, verify, commit**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`

```bash
git add -A
git commit -m "feat: add the people section

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 10: Section 04 — Contatto and the mailto form

**Files:**
- Create: `src/lib/contact-mailto.ts`, `src/app/[locale]/(pages)/(index)/components/{contatto,contact-form}.tsx`
- Modify: barrel, `page.tsx`, `src/packages/locales/lang/{it,en}.ts`
- Test: `src/lib/contact-mailto.test.ts`

**Interfaces:**
- Consumes: `getScopedI18n`, `useScopedI18n`.
- Produces:
  - `interface ContactDraft { name: string; email: string; organisation: string; message: string }`
  - `buildMailtoHref(draft: ContactDraft, to?: string): string`
  - `Contatto` (server), `ContactForm` (client). Section id: `contatto`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/contact-mailto.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildMailtoHref } from "./contact-mailto";

const draft = {
  name: "Anna Rossi",
  email: "anna@example.org",
  organisation: "Museo Aurora",
  message: "Vorremmo collegare le schede delle mostre.",
};

describe("buildMailtoHref", () => {
  it("targets info@isagog.com by default", () => {
    expect(buildMailtoHref(draft)).toMatch(/^mailto:info@isagog\.com\?/);
  });

  it("accepts a different recipient", () => {
    expect(buildMailtoHref(draft, "ciao@isagog.com")).toMatch(/^mailto:ciao@isagog\.com\?/);
  });

  it("puts every field in the body", () => {
    const body = new URL(buildMailtoHref(draft)).searchParams.get("body") ?? "";
    expect(body).toContain("Anna Rossi");
    expect(body).toContain("anna@example.org");
    expect(body).toContain("Museo Aurora");
    expect(body).toContain("Vorremmo collegare le schede delle mostre.");
  });

  it("encodes characters that would break the URL", () => {
    const href = buildMailtoHref({ ...draft, message: "a&b c=d\nsecond line" });
    expect(href).not.toContain("&b c=d");
    const body = new URL(href).searchParams.get("body") ?? "";
    expect(body).toContain("a&b c=d");
    expect(body).toContain("second line");
  });

  it("omits empty fields rather than printing blank labels", () => {
    const body =
      new URL(buildMailtoHref({ ...draft, organisation: "" })).searchParams.get("body") ?? "";
    expect(body).not.toContain("Organizzazione");
    expect(body).toContain("Anna Rossi");
  });
});
```

Note on encoding: the body is percent-encoded with `encodeURIComponent`, **not**
`URLSearchParams`, which serialises a space as `+` — a mail client would then
show literal plus signs. `URL(...).searchParams.get()` decodes percent-encoding
for you, so the assertions read the plain text back without a second decode.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot resolve `./contact-mailto`.

- [ ] **Step 3: Implement `src/lib/contact-mailto.ts`**

```ts
export interface ContactDraft {
  readonly name: string;
  readonly email: string;
  readonly organisation: string;
  readonly message: string;
}

const SUBJECT = "Isagog — richiesta di confronto";

/**
 * Build the mailto: link the contact form opens. The form sends nothing
 * itself — a static site has no backend — so the user reviews and sends
 * the draft from their own mail client.
 */
export const buildMailtoHref = (
  draft: ContactDraft,
  to = "info@isagog.com"
): string => {
  const fields: ReadonlyArray<readonly [string, string]> = [
    ["Nome", draft.name],
    ["Email", draft.email],
    ["Organizzazione", draft.organisation],
  ];

  const header = fields
    .filter(([, value]) => value.trim() !== "")
    .map(([label, value]) => `${label}: ${value.trim()}`);

  const message = draft.message.trim();
  const body = message === "" ? header : [...header, "", message];

  // encodeURIComponent, not URLSearchParams: the latter encodes spaces as "+",
  // which mail clients show literally in the message body.
  const subject = encodeURIComponent(SUBJECT);
  return `mailto:${to}?subject=${subject}&body=${encodeURIComponent(body.join("\n"))}`;
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS — 5 new tests.

- [ ] **Step 5: Add the copy**

Transcribe `bozzacompleta.html:459–495`: `eyebrow` ("04 / DALLA DIMOSTRAZIONE AL LAVORO QUOTIDIANO"), `titleLine1`, `titleEm` ("utenti veri."), `p1`, `p2Strong`, `p2`, the three steps (`step1`–`step3`), `mailLink`; and the form's `formTitle`, `formSub`, labels `fieldName`/`fieldEmail`/`fieldOrg`/`fieldMessage` with their placeholders, `formNote`, `submit`, `disclosure`.

- [ ] **Step 6: Write the form**

`src/app/[locale]/(pages)/(index)/components/contact-form.tsx`:

```tsx
"use client";

import { buildMailtoHref } from "@/lib/contact-mailto";
import { useScopedI18n } from "@/packages/locales/client";
import { useState } from "react";

export const ContactForm = () => {
  const t = useScopedI18n("home.contatto");
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    organisation: "",
    message: "",
  });

  const update = (field: keyof typeof draft) => (value: string) =>
    setDraft((current) => ({ ...current, [field]: value }));

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = buildMailtoHref(draft);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[5px] border border-card-border bg-paper p-7"
    >
      <h4 className="font-serif text-[24px] text-forest">{t("formTitle")}</h4>
      <p className="mt-2 text-[15px] text-prose-muted">{t("formSub")}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-[13px] text-forest">
          {t("fieldName")}
          <input
            type="text"
            required
            value={draft.name}
            onChange={(event) => update("name")(event.target.value)}
            placeholder={t("fieldNamePlaceholder")}
            className="rounded-[4px] border border-card-border bg-white px-3 py-2.5 text-[15px]"
          />
        </label>
        <label className="flex flex-col gap-2 text-[13px] text-forest">
          {t("fieldEmail")}
          <input
            type="email"
            required
            value={draft.email}
            onChange={(event) => update("email")(event.target.value)}
            placeholder={t("fieldEmailPlaceholder")}
            className="rounded-[4px] border border-card-border bg-white px-3 py-2.5 text-[15px]"
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-2 text-[13px] text-forest">
        {t("fieldOrg")}
        <input
          type="text"
          value={draft.organisation}
          onChange={(event) => update("organisation")(event.target.value)}
          placeholder={t("fieldOrgPlaceholder")}
          className="rounded-[4px] border border-card-border bg-white px-3 py-2.5 text-[15px]"
        />
      </label>

      <label className="mt-4 flex flex-col gap-2 text-[13px] text-forest">
        {t("fieldMessage")}
        <textarea
          required
          rows={4}
          value={draft.message}
          onChange={(event) => update("message")(event.target.value)}
          placeholder={t("fieldMessagePlaceholder")}
          className="rounded-[4px] border border-card-border bg-white px-3 py-2.5 text-[15px]"
        />
      </label>

      <p className="mt-3 text-[13px] text-prose-muted">{t("formNote")}</p>

      <button
        type="submit"
        className="mt-5 w-full rounded-[5px] bg-forest-deep px-5 py-3.5 text-[15px] font-medium text-white"
      >
        {t("submit")}
      </button>

      <p className="mt-4 text-[12.5px] leading-[1.5] text-num">{t("disclosure")}</p>
    </form>
  );
};
```

The `disclosure` copy is the draft's own promise that nothing is sent from the form. It ships verbatim.

- [ ] **Step 7: Write the section**

`src/app/[locale]/(pages)/(index)/components/contatto.tsx` — ports `bozzacompleta.html:459–495` including the four faded background trees:

```tsx
import { getScopedI18n } from "@/packages/locales/server";
import Image from "next/image";
import { ContactForm } from "./contact-form";

const TREES = [
  { src: "/images/about-images/tree-pine.png", className: "-left-8 h-[280px]" },
  { src: "/images/about-images/tree-cypress.png", className: "left-[16%] h-[200px] hidden min-[760px]:block" },
  { src: "/images/about-images/tree-bushy.png", className: "right-[16%] h-[190px] hidden min-[760px]:block" },
  { src: "/images/about-images/tree-palm.png", className: "-right-6 h-[300px]" },
] as const;

export const Contatto = async () => {
  const t = await getScopedI18n("home.contatto");

  return (
    <section id="contatto" className="scroll-anchor relative overflow-hidden bg-page px-6 py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {TREES.map((tree) => (
          <Image
            key={tree.src}
            src={tree.src}
            alt=""
            width={400}
            height={500}
            className={`absolute bottom-0 w-auto object-contain opacity-10 ${tree.className}`}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1224px] items-start gap-12 md:grid-cols-2">
        <div>
          <span className="block max-w-[400px] text-[12px] font-semibold uppercase tracking-[0.1em] text-forest">
            {t("eyebrow")}
          </span>
          <h3 className="mt-4 text-[clamp(28px,3.4vw,39px)] leading-[1.15] text-forest">
            {t("titleLine1")}
            <br />
            {t("titleLine2")} <em className="not-italic text-sage">{t("titleEm")}</em>
          </h3>
          <p className="mt-6 max-w-[425px] text-[16px] text-prose-muted">{t("p1")}</p>
          <p className="mt-6 max-w-[425px] text-[16px] text-prose-muted">
            <strong className="font-bold text-forest">{t("p2Strong")}</strong>
            <br />
            {t("p2")}
          </p>

          <ol className="my-7 list-none p-0 text-forest">
            <li className="flex items-baseline gap-3 py-3 text-[14px]">
              <span className="min-w-5 font-serif text-[12px] text-num">01</span>
              {t("step1")}
            </li>
            <li className="flex items-baseline gap-3 border-t border-card-border py-3 text-[14px]">
              <span className="min-w-5 font-serif text-[12px] text-num">02</span>
              {t("step2")}
            </li>
            <li className="flex items-baseline gap-3 border-t border-card-border py-3 text-[14px]">
              <span className="min-w-5 font-serif text-[12px] text-num">03</span>
              {t("step3")}
            </li>
          </ol>

          <a
            href="mailto:info@isagog.com"
            className="inline-flex items-center gap-1.5 py-2 text-[14px] font-semibold text-forest"
          >
            {t("mailLink")}
          </a>
        </div>

        <ContactForm />
      </div>
    </section>
  );
};
```

- [ ] **Step 8: Mount, verify, commit**

Render `<Contatto />` last in `page.tsx`.

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Then in `pnpm dev`: fill the form, submit, and confirm the mail client opens with all four fields in the body. Confirm the rail's `04 Contatto` activates on scroll.

```bash
git add -A
git commit -m "feat: add the contact section with a mailto-only form

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 11: Platform page

**Files:**
- Create: `src/app/[locale]/(pages)/platform/page.tsx`, `src/app/[locale]/(pages)/platform/components/text-carousel.tsx`
- Create: `src/app/_components/ui/carousel.tsx`
- Modify: `src/packages/locales/lang/{it,en}.ts`, `scripts/check-export.mjs`

**Interfaces:**
- Consumes: `setStaticParamsLocale`, `getScopedI18n`, `SectionHeading`.
- Produces: the `/{locale}/platform/` route.

- [ ] **Step 1: Port the carousel primitive and its copy**

Copy `src/app/_components/ui/carousel.tsx` verbatim from `../isagog.github.io/src/app/_components/ui/carousel.tsx`. Copy the `platform-page` scope (hero title/description, diagram `mobileNotice`/`mobileCta`, and the carousel entries) verbatim from `../isagog.github.io/src/packages/locales/lang/it.ts` and `en.ts` into the new locale files under `platform`.

Adapt `text-carousel.tsx` from `../isagog.github.io/src/app/[locale]/(pages)/platform/components/text-carousel.tsx`, replacing old colour classes with the new tokens (`text-forest`, `bg-paper`, `border-card-border`).

- [ ] **Step 2: Write the page**

```tsx
import { asset } from "@/lib/base-path";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import { Monitor, Network } from "lucide-react";
import { TextCarousel } from "./components/text-carousel";

const PlatformPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getScopedI18n("platform");

  return (
    <main className="bg-page">
      <section className="mx-auto flex max-w-[1224px] flex-col items-center gap-6 px-6 pt-20 pb-10 text-center">
        <h1 className="text-[clamp(32px,4vw,46px)] leading-[1.15] text-forest">{t("heroTitle")}</h1>
        <p className="max-w-[720px] text-[19px] leading-[1.5] text-prose-muted">
          {t("heroDescription")}
        </p>
      </section>

      <iframe
        src={asset(`/platform-explorer/${locale === "it" ? "it" : "en"}.html`)}
        title={t("explorerTitle")}
        className="hidden aspect-[1280/886] w-full border-0 sm:block"
      />

      <div className="mx-6 flex flex-col items-center gap-3 border border-forest/25 p-8 text-center sm:hidden">
        <Network className="text-terracotta" size={36} strokeWidth={1.5} />
        <p className="font-serif text-[18px] text-forest">{t("mobileNotice")}</p>
        <p className="flex items-center gap-2 text-[14px] uppercase tracking-wide text-terracotta">
          <Monitor size={18} strokeWidth={1.75} />
          {t("mobileCta")}
        </p>
      </div>

      <TextCarousel />
    </main>
  );
};

export default PlatformPage;
```

- [ ] **Step 3: Extend the export checker**

In `scripts/check-export.mjs`, change `const ROUTES = [""];` to `const ROUTES = ["", "platform"];`.

- [ ] **Step 4: Verify and commit**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Expected: `check-export: ok (5 files)`. Confirm the iframe renders at `/it/platform/` and the mobile notice replaces it under 640px.

```bash
git add -A
git commit -m "feat: add the platform page with the explorer iframe

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 12: MDX pipeline, project index and case studies

**Files:**
- Create: `src/lib/mdx.ts`, `src/app/_components/custom/markdown-render.tsx`, `src/app/_components/providers.tsx`
- Create: `src/app/_components/ui/skeleton.tsx`
- Create: `src/packages/action/projects/{project.action.ts,project.model.ts}`
- Create: `src/app/[locale]/(pages)/project/{page.tsx,[slug]/page.tsx,_components/project-section.tsx}`
- Modify: `src/app/[locale]/layout.tsx` (wrap in `Providers`), `scripts/check-export.mjs`, locale files
- Test: `src/lib/mdx.test.ts`, `src/packages/action/projects/project.model.test.ts`

**Interfaces:**
- Consumes: `LocaleLink`, `cn`.
- Produces:
  - `getSlugs(type: "articles" | "projects", locale?: string): string[]`
  - `getMdxBySlug(slug: string, type: "articles" | "projects", locale?: string): Promise<{ content: string; frontmatter: Record<string, unknown>; slug: string } | null>`
  - `MarkdownRenderer({ content, imageClassName }: { content: string; imageClassName?: string })`
  - `zProjectSchema` / `zProjectsSchema` / `type ProjectType = { title: string; image: string; slug: string; … }`
  - `fetchProjects(locale: string): Promise<ProjectType[]>`
  - `Providers({ children }: PropsWithChildren)`

- [ ] **Step 1: Write the failing tests for the MDX pipeline**

Create `src/lib/mdx.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getMdxBySlug, getSlugs } from "./mdx";

describe("getSlugs", () => {
  it("lists every article", () => {
    expect(getSlugs("articles").sort()).toEqual([
      "article-1",
      "article-2",
      "article-3",
      "article-4",
      "article-5",
    ]);
  });

  it("lists projects per locale", () => {
    expect(getSlugs("projects", "it").sort()).toEqual([
      "manifesto-case-study",
      "maxxi-case-study",
      "teleperformance-case-study",
    ]);
    expect(getSlugs("projects", "en").sort()).toEqual([
      "manifesto-case-study",
      "maxxi-case-study",
      "teleperformance-case-study",
    ]);
  });

  it("defaults projects to the en directory", () => {
    expect(getSlugs("projects")).toEqual(getSlugs("projects", "en"));
  });
});

describe("getMdxBySlug", () => {
  it("returns the body and slug of an article", async () => {
    const post = await getMdxBySlug("article-1", "articles");
    expect(post).not.toBeNull();
    expect(post?.slug).toBe("article-1");
    expect(post?.content).toContain("Il linguaggio non è algebra");
  });

  it("returns the locale-specific project body", async () => {
    const it = await getMdxBySlug("maxxi-case-study", "projects", "it");
    const en = await getMdxBySlug("maxxi-case-study", "projects", "en");
    expect(it?.content).not.toBe(en?.content);
  });

  it("returns null for an unknown slug instead of throwing", async () => {
    expect(await getMdxBySlug("does-not-exist", "articles")).toBeNull();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot resolve `./mdx`.

- [ ] **Step 3: Implement `src/lib/mdx.ts`**

Ported from `../isagog.github.io/src/lib/mdx.ts`:

```ts
import fs from "fs";
import matter from "gray-matter";
import path from "path";

type ContentType = "articles" | "projects";

const contentDir = (type: ContentType, locale?: string) =>
  type === "articles"
    ? path.join(process.cwd(), "content", "articles")
    : path.join(process.cwd(), "content", "projects", locale ?? "en");

export const getSlugs = (type: ContentType, locale?: string): string[] =>
  fs
    .readdirSync(contentDir(type, locale))
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

export const getMdxBySlug = async (
  slug: string,
  type: ContentType,
  locale?: string
) => {
  const filePath = path.join(contentDir(type, locale), `${slug}.mdx`);

  try {
    const rawContent = await fs.promises.readFile(filePath, "utf-8");
    const { content, data: frontmatter } = matter(rawContent);
    return { content, frontmatter, slug };
  } catch (error) {
    console.error(`Error reading MDX file for slug "${slug}":`, error);
    return null;
  }
};
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm test`
Expected: PASS — 6 new tests.

- [ ] **Step 5: Write the failing schema test**

Create `src/packages/action/projects/project.model.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { zProjectsSchema } from "./project.model";

describe("zProjectsSchema", () => {
  it.each(["it", "en"])("accepts the shipped %s list", (locale) => {
    const json: unknown = JSON.parse(
      readFileSync(`public/projects-data/list.${locale}.json`, "utf-8")
    );
    expect(zProjectsSchema.safeParse(json).success).toBe(true);
  });

  it("rejects a list whose entry is missing a slug", () => {
    const result = zProjectsSchema.safeParse([{ title: "A", image: "/a.png" }]);
    expect(result.success).toBe(false);
  });

  it("rejects a bare object", () => {
    expect(zProjectsSchema.safeParse({ title: "A" }).success).toBe(false);
  });
});
```

- [ ] **Step 6: Run it to verify it fails, then implement the model**

Run: `pnpm test` → FAIL (module missing).

`src/packages/action/projects/project.model.ts` — the nine fields are exactly those present in `public/projects-data/list.{it,en}.json`:

```ts
import { z } from "zod";

export const zProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  secondTitle: z.string(),
  value: z.string(),
  sector: z.string(),
  valueName: z.string(),
  name: z.string(),
  image: z.string(),
  slug: z.string(),
});

export const zProjectsSchema = z.array(zProjectSchema);
export type ProjectType = z.infer<typeof zProjectSchema>;
```

`src/packages/action/projects/project.action.ts`:

```ts
import { asset } from "@/lib/base-path";
import type { ProjectType } from "./project.model";
import { zProjectsSchema } from "./project.model";

export const fetchProjects = async (locale: string): Promise<ProjectType[]> => {
  const res = await fetch(asset(`/projects-data/list.${locale}.json`));
  if (!res.ok) throw new Error("Failed to fetch projects");

  const json: unknown = await res.json();
  const parsed = zProjectsSchema.safeParse(json);
  if (!parsed.success) throw new Error("Invalid project data format");

  return parsed.data;
};
```

Run: `pnpm test` → PASS.

- [ ] **Step 7: Add the query provider and the renderer**

`src/app/_components/providers.tsx`:

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { useState } from "react";

export const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
```

Wrap the layout's children in `<Providers>` (inside `I18nProviderClient`, outside `BodyWrapper`'s children).

Copy `skeleton.tsx` from `../isagog.github.io/src/app/_components/ui/skeleton.tsx`. Do not copy `card.tsx` or `button.tsx` — nothing in this design uses them.

`src/app/_components/custom/markdown-render.tsx` — adapt from the old site's version, changing the class overrides to the new tokens: headings `text-forest` in `font-serif`, body `text-[16.5px] leading-[1.6] text-prose-muted`, links `text-terracotta hover:underline`, blockquote `border-l-4 border-divider pl-4 italic text-muted-ink`, code `bg-tecnologia`.

- [ ] **Step 8: Write the project index and detail pages**

`src/app/[locale]/(pages)/project/_components/project-section.tsx`:

```tsx
"use client";

import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { fetchProjects } from "@/packages/action/projects/project.action";
import { useCurrentLocale } from "@/packages/locales/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export const ProjectSection = () => {
  const locale = useCurrentLocale();
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", locale],
    queryFn: () => fetchProjects(locale),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-12">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex flex-col gap-6 md:flex-row">
            <Skeleton className="h-64 w-full md:w-[320px]" />
            <div className="flex w-full flex-col gap-4">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-14">
      {projects?.map((project) => (
        <article
          key={project.slug}
          className="flex flex-col gap-8 rounded-[5px] border border-card-border bg-paper p-7 md:flex-row"
        >
          <Image
            src={project.image}
            alt={project.title}
            width={640}
            height={480}
            className="h-64 w-full shrink-0 rounded-[4px] object-cover md:w-[320px]"
          />
          <div className="flex flex-col">
            <h2 className="font-serif text-[28px] text-forest">{project.title}</h2>
            <p className="mt-1 text-[13.5px] font-semibold uppercase tracking-[0.08em] text-sage">
              {project.secondTitle}
            </p>
            <p className="mt-4 text-[16px] leading-[1.6] text-prose-muted">
              {project.description}
            </p>
            <dl className="mt-6 flex flex-wrap gap-8 text-[13px] text-num">
              <div>
                <dt className="uppercase tracking-[0.08em]">{project.valueName}</dt>
                <dd className="mt-1 font-serif text-[18px] text-forest">{project.value}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.08em]">{project.name}</dt>
                <dd className="mt-1 font-serif text-[18px] text-forest">{project.sector}</dd>
              </div>
            </dl>
            <Link
              href={`/project/${project.slug}`}
              className="mt-6 inline-flex w-fit items-center gap-2 text-[15px] font-semibold text-terracotta"
            >
              {project.title} →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};
```

`src/app/[locale]/(pages)/project/page.tsx`:

```tsx
import { setStaticParamsLocale } from "@/packages/locales/server";
import { ProjectSection } from "./_components/project-section";

const ProjectPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main className="mx-auto max-w-[1224px] px-6 py-16">
      <ProjectSection />
    </main>
  );
};

export default ProjectPage;
```

`src/app/[locale]/(pages)/project/[slug]/page.tsx`:

```tsx
import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { MarkdownRenderer } from "@/app/_components/custom/markdown-render";
import { getMdxBySlug, getSlugs } from "@/lib/mdx";
import { locales } from "@/lib/locale-href";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getSlugs("projects", locale).map((slug) => ({ locale, slug }))
  );
}

const ProjectPostPage = async ({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) => {
  const { slug, locale } = await params;
  const post = await getMdxBySlug(slug, "projects", locale);

  if (post === null) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl text-forest">Project not found</h1>
        <Link href="/project" className="text-terracotta">
          Go back to projects
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[780px] px-6 py-16">
      <MarkdownRenderer content={post.content} />
    </main>
  );
};

export default ProjectPostPage;
```

Note the difference from the old site: `generateStaticParams` returns `{ locale, slug }` pairs for **both** locales, because the old version read `params.locale` synchronously in a way that only worked by accident under the parent's static params.

- [ ] **Step 9: Extend the checker, verify, commit**

In `scripts/check-export.mjs`, extend `ROUTES` to `["", "platform", "project"]` and add a second list:

```js
const SLUG_ROUTES = [
  ["project", ["maxxi-case-study", "manifesto-case-study", "teleperformance-case-study"]],
];
for (const locale of LOCALES) {
  for (const [base, slugs] of SLUG_ROUTES) {
    for (const slug of slugs) {
      const file = join(OUT, locale, base, slug, "index.html");
      if (!existsSync(file)) missing.push(file);
    }
  }
}
```

(Insert this loop before the `missing.length` check, and update the final count message to `missing.length === 0 ? "ok" : …` — the exact number is no longer worth hardcoding, so print `check-export: ok` alone.)

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`

```bash
git add -A
git commit -m "feat: add the MDX pipeline and the project index and case studies

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 13: Blog index and articles

**Files:**
- Create: `src/packages/action/articles/{article.action.ts,article.model.ts}`
- Create: `src/app/[locale]/(pages)/blog/{page.tsx,[slug]/page.tsx,_components/blog-card.tsx}`
- Modify: `scripts/check-export.mjs`
- Test: `src/packages/action/articles/article.model.test.ts`

**Interfaces:**
- Consumes: `getSlugs`, `getMdxBySlug`, `MarkdownRenderer`, `LocaleLink`, `Skeleton`.
- Produces: `zArticleSchema`, `zArticlesSchema`, `type ArticleType = { title: string; image: string; slug: string }`, `fetchArticles(): Promise<ArticleType[]>`, the `/{locale}/blog/` and `/{locale}/blog/{slug}/` routes.

- [ ] **Step 1: Write the failing schema test**

Create `src/packages/action/articles/article.model.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { zArticlesSchema } from "./article.model";

describe("zArticlesSchema", () => {
  it("accepts the shipped article list", () => {
    const json: unknown = JSON.parse(readFileSync("public/articles-data/list.json", "utf-8"));
    expect(zArticlesSchema.safeParse(json).success).toBe(true);
  });

  it("lists one entry per article file", () => {
    const json: unknown = JSON.parse(readFileSync("public/articles-data/list.json", "utf-8"));
    const parsed = zArticlesSchema.parse(json);
    expect(parsed).toHaveLength(5);
  });

  it("rejects an entry missing its image", () => {
    expect(zArticlesSchema.safeParse([{ title: "A", slug: "a" }]).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to verify it fails, then implement**

Run: `pnpm test` → FAIL.

`src/packages/action/articles/article.model.ts`:

```ts
import { z } from "zod";

export const zArticleSchema = z.object({
  title: z.string(),
  image: z.string(),
  slug: z.string(),
});

export const zArticlesSchema = z.array(zArticleSchema);
export type ArticleType = z.infer<typeof zArticleSchema>;
```

`src/packages/action/articles/article.action.ts`:

```ts
import { asset } from "@/lib/base-path";
import type { ArticleType } from "./article.model";
import { zArticlesSchema } from "./article.model";

export const fetchArticles = async (): Promise<ArticleType[]> => {
  const res = await fetch(asset("/articles-data/list.json"));
  if (!res.ok) throw new Error("Failed to fetch articles");

  const json: unknown = await res.json();
  const parsed = zArticlesSchema.safeParse(json);
  if (!parsed.success) throw new Error("Invalid article data format");

  return parsed.data;
};
```

Run: `pnpm test` → PASS (3 new tests).

- [ ] **Step 3: Write the index and detail pages**

`src/app/[locale]/(pages)/blog/_components/blog-card.tsx`:

```tsx
"use client";

import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { fetchArticles } from "@/packages/action/articles/article.action";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export const BlogCard = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-5">
        {[0, 1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="h-44 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5">
      {articles?.map((article) => (
        <Link
          key={article.slug}
          href={`/blog/${article.slug}`}
          className="group flex flex-col overflow-hidden rounded-[5px] border border-card-border bg-paper sm:flex-row"
        >
          <Image
            src={article.image}
            alt={article.title}
            width={352}
            height={352}
            className="h-44 w-full shrink-0 object-cover sm:w-44"
          />
          <span className="flex w-full items-center p-6">
            <span className="font-serif text-[22px] leading-[1.25] text-forest transition-colors group-hover:text-terracotta">
              {article.title}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
};
```

Note: the whole card is one link, so the title is a `<span>`, not a nested anchor.

`src/app/[locale]/(pages)/blog/page.tsx`:

```tsx
import { setStaticParamsLocale } from "@/packages/locales/server";
import { BlogCard } from "./_components/blog-card";

const BlogPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[900px] flex-col items-center gap-6 px-6 py-16">
      <BlogCard />
    </main>
  );
};

export default BlogPage;
```

`src/app/[locale]/(pages)/blog/[slug]/page.tsx` — same shape as the project detail page, but articles are shared across locales:

```tsx
import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { MarkdownRenderer } from "@/app/_components/custom/markdown-render";
import { locales } from "@/lib/locale-href";
import { getMdxBySlug, getSlugs } from "@/lib/mdx";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getSlugs("articles").map((slug) => ({ locale, slug }))
  );
}

const BlogPostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = await getMdxBySlug(slug, "articles");

  if (post === null) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl text-forest">Article not found</h1>
        <Link href="/blog" className="text-terracotta">
          Go back to blog
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[780px] px-6 py-16">
      <MarkdownRenderer
        content={post.content}
        imageClassName="mx-auto h-auto max-h-[70vh] w-auto rounded-[8px] object-contain"
      />
    </main>
  );
};

export default BlogPostPage;
```

- [ ] **Step 4: Extend the checker, verify, commit**

In `scripts/check-export.mjs`: add `"blog"` to `ROUTES` and `["blog", ["article-1","article-2","article-3","article-4","article-5"]]` to `SLUG_ROUTES`.

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Expected: `check-export: ok`. Open `/it/blog/` and one article and confirm the images and footnotes render.

```bash
git add -A
git commit -m "feat: add the blog index and article pages

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 14: SEO metadata, sitemap and robots

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`
- Modify: `src/app/[locale]/layout.tsx` (openGraph, twitter, alternates)

**Interfaces:**
- Consumes: `locales` from `@/lib/locale-href`.
- Produces: `/sitemap.xml` and `/robots.txt` in the export.

- [ ] **Step 1: Write the sitemap**

```ts
import { SITE_URL } from "@/lib/base-path";
import { locales } from "@/lib/locale-href";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE = SITE_URL;
const PATHS = [
  { path: "", priority: 1, changeFrequency: "monthly" as const },
  { path: "/platform", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/project", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return locales.flatMap((locale) =>
    PATHS.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }))
  );
}
```

- [ ] **Step 2: Write robots.ts**

```ts
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // A staging build lives at a subpath, where /robots.txt is not read by
  // crawlers at all — the noindex meta tag in the layout is what actually
  // keeps it out of the index. This still refuses politely at the root.
  return {
    rules: IS_STAGING
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

Import `IS_STAGING` and `SITE_URL` from `@/lib/base-path` at the top of the file.

- [ ] **Step 3: Complete the layout metadata**

Extend the `metadata` object in `src/app/[locale]/layout.tsx` with the social cards and locale alternates, using the draft's own claim as the title:

```ts
  openGraph: {
    title: "Isagog — Un'IA che sa dire cosa sa",
    description:
      "Isagog rende la conoscenza della vostra organizzazione esplicita, verificabile e utilizzabile da assistenti e applicazioni di intelligenza artificiale.",
    url: "https://isagog.com",
    siteName: "Isagog",
    images: [
      {
        url: "https://isagog.com/images/tree.avif",
        width: 1200,
        height: 630,
        alt: "Illustrazione di un albero, Isagog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Isagog — Un'IA che sa dire cosa sa",
    description:
      "Isagog rende la conoscenza della vostra organizzazione esplicita, verificabile e utilizzabile da assistenti e applicazioni di intelligenza artificiale.",
    images: ["https://isagog.com/images/tree.avif"],
  },
  alternates: {
    canonical: "https://isagog.com/",
    languages: { it: "/it", en: "/en" },
  },
```

Also add, in the same `metadata` object, the guard that actually keeps a
staging build out of search results — `robots.txt` at a subpath is ignored by
crawlers, so a meta tag is the only mechanism that works there:

```ts
  robots: IS_STAGING ? { index: false, follow: false } : undefined,
```

with `import { IS_STAGING } from "@/lib/base-path";` at the top of the layout.

- [ ] **Step 4: Verify and commit**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Confirm `out/sitemap.xml` lists eight URLs and `out/robots.txt` exists.

```bash
git add -A
git commit -m "feat: add sitemap, robots and social metadata

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 15: CI and GitHub Pages deploy

**Files:**
- Create: `.github/workflows/main.yml`, `README.md`

**Interfaces:**
- Consumes: `pnpm test`, `pnpm lint`, `pnpm build` from Task 1.
- Produces: a Pages deployment on every push to `main`.

- [ ] **Step 1: Write the workflow**

`.github/workflows/main.yml` — mirrors `../isagog.github.io/.github/workflows/main.yml`, with the test step added:

```yaml
name: Build and deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: .next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ hashFiles('**.[jt]s', '**.[jt]sx') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Test
        run: pnpm test

      - name: Lint
        run: pnpm lint

      - name: Build static export
        run: pnpm build
        env:
          # Staging lives at https://isagog.com/isagog-web/. At cutover this
          # env block is deleted and the site rebuilds for the domain root.
          NEXT_PUBLIC_BASE_PATH: /isagog-web

      - name: Generate timestamp
        id: ts
        run: echo "value=$(date +'%Y%m%d-%H%M%S')" >> $GITHUB_OUTPUT

      - name: Upload static site
        uses: actions/upload-artifact@v4
        with:
          name: isagog-site-${{ steps.ts.outputs.value }}
          path: out
          retention-days: 7

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Note: `pnpm build` runs `postbuild`, so `check-export.mjs` gates the deploy automatically.

- [ ] **Step 2: Write the README**

```markdown
# Isagog website

Static site for isagog.com, built from the `bozzacompleta.html` design draft.
Next.js 16 with `output: "export"` — the build emits plain HTML/JS into `out/`
and GitHub Pages serves it.

## Commands

    pnpm install
    pnpm dev          # dev server on :3000
    pnpm build        # static export into ./out (runs check-export afterwards)
    pnpm preview      # serve ./out
    pnpm test         # Vitest
    pnpm lint         # ESLint
    pnpm typecheck    # tsc --noEmit

## Structure

- `src/app/[locale]/(pages)/(index)/` — the one scrolling homepage; one
  component per section, tracked by the sticky rail in
  `src/app/_components/custom/section-rail.tsx`.
- `src/packages/locales/lang/{it,en}.ts` — all user-visible copy. The two files
  must stay structurally identical.
- `content/` — MDX bodies for blog articles and project case studies.
- `public/{articles,projects}-data/` — the JSON lists their index pages fetch.

Design and decisions: `docs/superpowers/specs/2026-09-08-isagog-site-redesign-design.md`
Implementation plan: `docs/superpowers/plans/2026-09-08-isagog-site-redesign.md`
```

- [ ] **Step 3: Push and enable Pages**

The remote repository does not exist yet — create it and push. This step is outward-facing, so confirm with the user before running it:

```bash
gh repo create Isagog/isagog-web --private --source=. --remote=origin --push
gh api -X POST repos/Isagog/isagog-web/pages -f build_type=workflow
```

- [ ] **Step 4: Verify the deployment**

Run: `gh run watch`
Expected: build and deploy succeed. Open the Pages URL and walk every route: `/`, `/it/`, `/en/`, `/it/platform/`, `/it/project/`, one case study, `/it/blog/`, one article. Confirm the rail, the anchors and the contact form all behave as they do locally.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "ci: build, test and deploy to GitHub Pages

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm"
```

---

### Task 16: Subpath deployment support

> **Execution order:** dispatch this immediately after Task 10 and BEFORE
> Task 11. It is numbered 16 only so the earlier task numbers — already
> executed and recorded in the ledger — keep their identities. Tasks 11–15
> consume the `asset()` and `SITE_URL` helpers this task creates.

**Why:** the site deploys first to `https://isagog.com/isagog-web/` (a GitHub
Pages *project* site under the org's existing custom domain) so the new design
can be reviewed live while `isagog.com` itself keeps serving the current site.
That subpath requires Next's `basePath`. Next prefixes `next/link` hrefs and
`next/image` sources automatically, but it does **not** touch raw strings —
`fetch()` URLs, `<iframe src>`, or anything inside `public/`. Each of those
would 404 silently on the staging deploy. At cutover the base path becomes
empty and every one of these paths must keep working unchanged.

**Files:**
- Create: `src/lib/base-path.ts`
- Test: `src/lib/base-path.test.ts`
- Modify: `next.config.mjs`, `public/index.html`
- Modify: `scripts/check-export.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `BASE_PATH: string` — `""` or a leading-slash path with no trailing slash
  - `IS_STAGING: boolean` — true when `BASE_PATH` is non-empty
  - `asset(path: string): string` — prefixes a root-relative asset path
  - `SITE_URL: string` — the absolute origin+path this build is served from

- [ ] **Step 1: Write the failing test**

Create `src/lib/base-path.test.ts`. The module reads an env var at import
time, so each case re-imports it with `vi.resetModules()`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

const load = async (basePath: string | undefined) => {
  vi.resetModules();
  if (basePath === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = basePath;
  }
  return import("./base-path");
};

afterEach(() => {
  delete process.env.NEXT_PUBLIC_BASE_PATH;
});

describe("BASE_PATH", () => {
  it("is empty when the env var is unset", async () => {
    const { BASE_PATH, IS_STAGING } = await load(undefined);
    expect(BASE_PATH).toBe("");
    expect(IS_STAGING).toBe(false);
  });

  it("is empty when the env var is blank", async () => {
    const { BASE_PATH, IS_STAGING } = await load("");
    expect(BASE_PATH).toBe("");
    expect(IS_STAGING).toBe(false);
  });

  it("normalises a bare segment to a leading slash", async () => {
    const { BASE_PATH } = await load("isagog-web");
    expect(BASE_PATH).toBe("/isagog-web");
  });

  it("strips a trailing slash", async () => {
    const { BASE_PATH } = await load("/isagog-web/");
    expect(BASE_PATH).toBe("/isagog-web");
  });

  it("reports staging when a base path is set", async () => {
    const { IS_STAGING } = await load("/isagog-web");
    expect(IS_STAGING).toBe(true);
  });
});

describe("asset", () => {
  it("returns the path unchanged at the domain root", async () => {
    const { asset } = await load(undefined);
    expect(asset("/articles-data/list.json")).toBe("/articles-data/list.json");
  });

  it("prefixes the path under a base path", async () => {
    const { asset } = await load("/isagog-web");
    expect(asset("/articles-data/list.json")).toBe(
      "/isagog-web/articles-data/list.json"
    );
  });

  it("does not double-prefix an already-prefixed path", async () => {
    const { asset } = await load("/isagog-web");
    expect(asset("/isagog-web/favicon.ico")).toBe("/isagog-web/favicon.ico");
  });

  it("leaves absolute URLs and data URIs untouched", async () => {
    const { asset } = await load("/isagog-web");
    expect(asset("https://example.com/a.png")).toBe("https://example.com/a.png");
    expect(asset("mailto:info@isagog.com")).toBe("mailto:info@isagog.com");
  });
});

describe("SITE_URL", () => {
  it("is the bare origin at the domain root", async () => {
    const { SITE_URL } = await load(undefined);
    expect(SITE_URL).toBe("https://isagog.com");
  });

  it("includes the base path on a staging build", async () => {
    const { SITE_URL } = await load("/isagog-web");
    expect(SITE_URL).toBe("https://isagog.com/isagog-web");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm test src/lib/base-path.test.ts`
Expected: FAIL — cannot resolve `./base-path`.

- [ ] **Step 3: Implement `src/lib/base-path.ts`**

```ts
/**
 * Where this build is served from.
 *
 * The site deploys first to https://isagog.com/isagog-web/ so it can be
 * reviewed live while isagog.com keeps serving the old site; at cutover
 * NEXT_PUBLIC_BASE_PATH is removed and everything moves to the domain root.
 * Next prefixes next/link and next/image on its own — these helpers cover
 * the raw strings it does not touch.
 */
const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const normalise = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "/") return "";
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeading.endsWith("/") ? withLeading.slice(0, -1) : withLeading;
};

export const BASE_PATH = normalise(raw);

export const IS_STAGING = BASE_PATH !== "";

const ORIGIN = "https://isagog.com";

export const SITE_URL = `${ORIGIN}${BASE_PATH}`;

/**
 * Prefix a root-relative asset path with the deployment's base path.
 * Use for fetch() URLs, <iframe src>, and any other raw string Next does
 * not rewrite. Absolute URLs and non-path hrefs pass through unchanged.
 */
export const asset = (path: string): string => {
  if (!path.startsWith("/")) return path;
  if (BASE_PATH === "") return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test src/lib/base-path.test.ts`
Expected: PASS — 11 tests.

- [ ] **Step 5: Wire the base path into the Next config**

In `next.config.mjs`, add `basePath` above `images`:

```js
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Empty at the domain root; "/isagog-web" for the staging deploy.
  basePath,
  // Static export has no image optimizer; emit plain <img> tags.
  images: { unoptimized: true },
  output: "export",
  trailingSlash: true,
};
```

- [ ] **Step 6: Make the root redirect base-path agnostic**

`public/index.html` is copied verbatim into the export, so Next never rewrites
its URLs. Its redirect is currently absolute (`/it/`), which would jump out of
the subpath and land on the *old* site. Relative URLs are correct at both the
domain root and a subpath, because the file always sits at the deployment root.

In `public/index.html`, change the three absolute URLs to relative:

- `<link rel="icon" href="/favicon.ico" />` → `href="./favicon.ico"`
- `window.location.replace("/" + locale + "/")` → `window.location.replace("./" + locale + "/")`
- `<meta http-equiv="refresh" content="0; url=/it/" />` → `url=./it/`
- the visible fallback link `<a href="/it/">` → `<a href="./it/">`

- [ ] **Step 7: Verify the export empirically**

This is the step that matters: Next's documented behaviour for `next/image`
under `basePath` with `unoptimized: true` is worth confirming rather than
trusting. Build both ways and inspect the emitted HTML.

```bash
pnpm build
grep -o 'src="[^"]*tree[^"]*"' out/it/index.html | head -3
grep -o 'href="[^"]*"' out/index.html | head -3

NEXT_PUBLIC_BASE_PATH=/isagog-web pnpm build
grep -o 'src="[^"]*tree[^"]*"' out/isagog-web/it/index.html | head -3
```

Note that with `basePath` set, the export nests under `out/isagog-web/`.

Expected: at the root, image `src` values start with `/images/`; under the base
path they start with `/isagog-web/images/`. **If `next/image` does NOT prefix
them**, that is the finding this step exists to catch — report it as a concern
and wrap the affected `src` values in `asset()` the same way the raw strings
are wrapped. Do not assume either outcome; report what you actually observed,
with the grep output.

- [ ] **Step 8: Teach the export checker about the base path**

`scripts/check-export.mjs` currently looks under `out/<locale>/`. Under a base
path the export nests one level deeper. At the top of the file:

```js
const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/^\/|\/$/g, "");
const OUT = BASE === "" ? "out" : join("out", BASE);
```

and remove the old `const OUT = "out";`. Everything else already builds its
paths from `OUT`.

- [ ] **Step 9: Full verification, both ways**

```bash
pnpm test && pnpm typecheck && pnpm lint
pnpm build
NEXT_PUBLIC_BASE_PATH=/isagog-web pnpm build
```

Expected: both builds succeed and both print `check-export: ok`. Finish with a
plain `pnpm build` so the working tree holds a root-relative export.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: support deployment under a subpath

Staging serves from https://isagog.com/isagog-web/ so the new site can be
reviewed live while isagog.com keeps serving the old one. Next prefixes
next/link and next/image; asset() covers the raw strings it does not, and
public/index.html now redirects relatively so it works at either location.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014iy942nkTUWpqwymBiPdUm
EOF
)"
```

---

## Phase 2 (separate plan)

Replacing the single museum card with a three-industry version — museum (MAXXI
ontology), news archive (mema ontology), clinical (isagog-top) — tied to the
homepage's "sa dire: non lo so" claim. Its landing points are
`knowledge-card.tsx` and `DemoSlot`, both built to be replaced. That work gets
its own brainstorm, spec and plan.
