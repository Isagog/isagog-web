# Standalone /musei Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the museum landing page at `/it/musei/` and `/en/musei/` with its own museum-only header and footer, plus a bare `/musei` entry that opens it in the visitor's language.

**Architecture:** Move the Isagog `Header`/`Footer` from the root `[locale]/layout.tsx` into a new `[locale]/(pages)/layout.tsx`. Move the musei route into its own route group, `[locale]/(musei)/musei/`, whose layout renders `MuseiHeader`/`MuseiFooter`. A static stub in `public/musei/` handles the bare URL. Regressions are guarded in `scripts/check-export.mjs`, which runs after every build.

**Tech Stack:** Next.js 16 App Router (static export), React 19, next-international, Tailwind 4, Vitest, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-17-musei-standalone-page-design.md`

## Global Constraints

- Next 16 is not the version in your training data: read `node_modules/next/dist/docs/` (route groups, layout) before using an API you're unsure of.
- `output: "export"` + `trailingSlash: true`: every route is `out/<locale>/<route>/index.html`. There is no middleware.
- All visible copy lives in `src/packages/locales/lang/{it,en}.ts`, with identical key order (`parity.test.ts`).
- Internal links use `LocaleLink`; `public/` assets and `next/image` src use `asset()`.
- Must work at the domain root and under `NEXT_PUBLIC_BASE_PATH=/isagog-web`.
- The draft's sections and copy stay unchanged.
- Commits stay local on `feat/musei-page`. Do not push: the branch was rebased onto `main` and pushing needs the user's go-ahead.
- Verification commands: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build` (the build runs `check-export` afterwards).

## Review Focus

1. **Email deep link to `/it/musei/#call`:** the form heading must land just below the fixed museum header, not under it. This needs the museum header to stay 72px tall, the same as the `pt-[72px]` offset and `.scroll-anchor` (96px). Checked in Task 3, Step 9.
2. **Leaving and coming back:** "Chi è Isagog" goes from `/it/musei/` to `/it/` and must show the Isagog header at the top of the home page. Browser back must show the museum header again. Checked in Task 3, Step 9.
3. **Language switch on the museum page:** must go to `/en/musei/`, not the English home. Checked in Task 3, Step 9.
4. **Staging build:** links and the logo must carry the `/isagog-web` prefix. Checked in Task 3, Step 8.
5. **Odd browser languages at the bare `/musei`:** `EN-us`, plain `en`, `fr-FR`, a missing `navigator.language`, and JS disabled. Covered by Task 1's tests.

---

### Task 1: Bare /musei entry stub

**Files:**
- Create: `public/musei/index.html`
- Create: `src/lib/musei-stub.test.ts`
- Modify: `src/lib/assets.test.ts` (`REQUIRED` list)
- Modify: `scripts/check-export.mjs` (stub list near `OLD_URL_STUBS`)

**Interfaces:**
- Consumes: nothing.
- Produces: `out/musei/index.html` in every build.

- [ ] **Step 1: Commit the spec and this plan**

```bash
git add docs/superpowers/specs/2026-11-17-musei-standalone-page-design.md docs/superpowers/plans/2026-11-17-musei-standalone-page.md
git commit -m "docs: design and plan for the standalone /musei page"
```

- [ ] **Step 2: Write the failing test `src/lib/musei-stub.test.ts`**

Same harness as `src/lib/ontology-iri-stubs.test.ts`. `stub(): string` reads `public/musei/index.html`. `redirectOf(opts: { language?: string; navigator?: object }): string` runs the stub's inline `<script>` with `runInNewContext` against `{ navigator: opts.navigator ?? { language: opts.language }, window: { location: { replace } } }` and returns the URL passed to `replace`.

```ts
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
```

- [ ] **Step 3: Run it to verify it fails**

Run: `pnpm vitest run src/lib/musei-stub.test.ts`
Expected: FAIL with ENOENT on `public/musei/index.html`.

- [ ] **Step 4: Create `public/musei/index.html`**

Copy `public/service/index.html`. Change the target to `"../" + locale + "/musei/"` and the noscript and `<a>` fallbacks to `../it/musei/`. Rewrite the comment: this is the short entry URL for the museum page, it follows the browser language with Italian as the fallback, and it uses relative paths so it works under the staging base path.

- [ ] **Step 5: Run it to verify it passes**

Run: `pnpm vitest run src/lib/musei-stub.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 6: Register the stub in the asset and export checks**

Add `"public/musei/index.html"` to `REQUIRED` in `src/lib/assets.test.ts`. In `scripts/check-export.mjs`, add `const ENTRY_STUBS = ["musei"];` with the comment "Short entry URLs outside the locale segments", and loop over it exactly like `OLD_URL_STUBS`.

- [ ] **Step 7: Verify and commit**

Run: `pnpm test && pnpm build`
Expected: all tests pass; the build ends with `check-export: ok`; `out/musei/index.html` exists.

```bash
git add public/musei/index.html src/lib/musei-stub.test.ts src/lib/assets.test.ts scripts/check-export.mjs
git commit -m "feat: open the museum page from the bare /musei URL"
```

---

### Task 2: Attach the Isagog header and footer to the (pages) group

A refactor with no visible change. The museum page still has the Isagog chrome after this task.

**Files:**
- Create: `src/lib/build-year.ts`
- Create: `src/app/[locale]/(pages)/layout.tsx`
- Modify: `src/app/[locale]/layout.tsx` (remove `Header`, `Footer`, `buildYear`)
- Modify: `scripts/check-export.mjs` (new chrome check)

**Interfaces:**
- Consumes: nothing.
- Produces: `export const BUILD_YEAR: number` from `@/lib/build-year`, for server layouts only. Move the root layout's comment about why the year is fixed at build time, and add: "never import from a client component".

- [ ] **Step 1: Add the Isagog-chrome guard to `scripts/check-export.mjs`**

The guard strips `<script>` blocks the same way the concept-link check does, collects failures, and exits 1 with the list. For each locale, `out/<locale>/approach/index.html` must contain:

```js
new RegExp(`href="[^"]*/${locale}/platform/"`)          // Isagog header nav
new RegExp(`href="[^"]*/${locale}/contact/"`)           // Isagog header CTA
new RegExp(`<button[^>]*>${privacy[locale]}</button>`)  // footer consent button
// privacy = { it: "Preferenze privacy", en: "Privacy preferences" }
```

- [ ] **Step 2: Build to confirm the guard passes on the current tree**

Run: `pnpm build`
Expected: `check-export: ok`. It's a baseline: it must already pass before the refactor.

- [ ] **Step 3: Create `src/lib/build-year.ts` and `src/app/[locale]/(pages)/layout.tsx`**

`(pages)/layout.tsx` is a server component: `({ children }: { children: ReactNode })` returns `<Header />`, `children`, `<Footer year={BUILD_YEAR} />`.

- [ ] **Step 4: Remove `Header`, `Footer` and `buildYear` from `src/app/[locale]/layout.tsx`**

Keep everything else exactly where it is: `#site-content` with `pt-[72px]` and its comment, `Providers` wrapping `children`, and `AnalyticsConsent`.

- [ ] **Step 5: Verify and commit**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all pass; `check-export: ok`.

```bash
git add src/lib/build-year.ts "src/app/[locale]/(pages)/layout.tsx" "src/app/[locale]/layout.tsx" scripts/check-export.mjs
git commit -m "refactor: attach the Isagog header and footer to the pages group"
```

---

### Task 3: Museum-only header and footer

**Files:**
- Move: `src/app/[locale]/(pages)/musei/` → `src/app/[locale]/(musei)/musei/` (`git mv`)
- Create: `src/app/[locale]/(musei)/musei/layout.tsx`
- Create: `src/app/[locale]/(musei)/musei/components/musei-header.tsx`
- Create: `src/app/[locale]/(musei)/musei/components/musei-footer.tsx`
- Modify: `src/app/[locale]/(musei)/musei/components/call.tsx:4` (import path)
- Modify: `src/app/[locale]/(musei)/musei/page.tsx` (top comment)
- Modify: `src/packages/locales/lang/it.ts`, `src/packages/locales/lang/en.ts` (end of the `musei` scope)
- Modify: `scripts/check-export.mjs` (musei chrome check)

**Interfaces:**
- Consumes: `BUILD_YEAR` (Task 2); `LanguageSelector`, `LocaleLink`, `reopenConsent`, `asset`; the existing `footer` copy scope (`copyright`, `street`, `zip`, `email`, `privacyPreferences`).
- Produces: `MuseiHeader()` and `MuseiFooter({ year }: { year: number })`, both `"use client"`.

- [ ] **Step 1: Add the musei-chrome guard to `scripts/check-export.mjs`**

Use the same script stripping and failure list as Task 2. Add `"musei"` to `ROUTES`. For each locale, check `out/<locale>/musei/index.html`:

```js
// must NOT match: no Isagog nav or footer links
new RegExp(`href="[^"]*/${locale}/(approach|platform|project|blog|careers|contact)/"`)
// must match: link to the main site home, and the consent button
new RegExp(`href="[^"]*/${locale}/"`)
new RegExp(`<button[^>]*>${privacy[locale]}</button>`)
```

- [ ] **Step 2: Build to verify the guard fails**

Run: `pnpm build`
Expected: FAIL. `check-export` reports Isagog nav links in `out/it/musei/index.html` and `out/en/musei/index.html`.

- [ ] **Step 3: Add the copy keys**

Add these keys at the end of the `musei` scope, after `call`, in the same order in both files:

| key | it | en |
|---|---|---|
| `musei.header.tag` | `per i musei` | `for museums` |
| `musei.header.logoLabel` | `Isagog per i musei, torna all'inizio` | `Isagog for museums, back to top` |
| `musei.header.about` | `Chi è Isagog →` | `About Isagog →` |
| `musei.header.cta` | `Chiedete una demo` | `Ask for a demo` |
| `musei.footer.site` | `isagog.com` | `isagog.com` |

Run: `pnpm vitest run src/packages/locales/lang/parity.test.ts`
Expected: PASS.

- [ ] **Step 4: Move the route and fix the import**

Run: `git mv "src/app/[locale]/(pages)/musei" "src/app/[locale]/(musei)/musei"`

In `call.tsx`, change the `ContactForm` import to `@/app/[locale]/(pages)/contact/components/contact-form`. In `page.tsx`, change the top comment to: "it has its own header and footer (see layout.tsx) and is kept out of the Isagog nav, but stays in the sitemap".

- [ ] **Step 5: Implement `MuseiHeader` in `musei-header.tsx`**

Match the Isagog `<header>`: `fixed top-0 z-50 w-full bg-page/90 backdrop-blur-sm border-b border-border`. The inner container is identical (`max-w-[1224px] px-6 py-4`) so the height stays 72px. Use `useScopedI18n("musei.header")`.
- **Left:** a plain `<a href="#top" aria-label={t("logoLabel")}>` around the logo `Image` (same props as the Isagog header), then `t("tag")` in small sage text. `#top` scrolls to the document top without leaving the page.
- **Right:** `<LocaleLink href="/">{t("about")}</LocaleLink>`; then `<a href="#call">{t("cta")}</a>` in the terracotta button style used by the hero CTA, with `hidden sm:inline-flex`; then `<LanguageSelector />`.

- [ ] **Step 6: Implement `MuseiFooter` in `musei-footer.tsx` and `layout.tsx`**

The footer has the Isagog footer's container and classes. On the left: `copyright`, `street`, `zip` from the `footer` scope. On the right: `<LocaleLink href="/">{t("site")}</LocaleLink>`, a mailto link with `footer.email`, and `<button type="button" onClick={reopenConsent}>{footer.privacyPreferences}</button>`.

`(musei)/musei/layout.tsx` is a server component: `<MuseiHeader />`, `children`, `<MuseiFooter year={BUILD_YEAR} />`.

- [ ] **Step 7: Build to verify the guard passes**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all pass; `check-export: ok`.

- [ ] **Step 8: Verify the staging build**

Run: `NEXT_PUBLIC_BASE_PATH=/isagog-web pnpm build && grep -o 'href="/isagog-web/it/"' out/it/musei/index.html | head -1`
Expected: `check-export: ok`, and the grep prints `href="/isagog-web/it/"`. Then run `pnpm build` again so `out/` is a root build.

- [x] **Step 9: Check it in the browser**

Run `pnpm dev` and check these at 1280px and 375px wide:
- `/it/musei/` and `/en/musei/`: only the museum header and footer. On 375px the demo button is hidden and nothing scrolls sideways.
- `/it/musei/#call` from a fresh tab: the form heading sits just below the header.
- The logo from mid-page scrolls to the top and stays on `/it/musei/`.
- "Chi è Isagog" goes to `/it/`, which shows the Isagog header at the top of the page. Browser back shows the museum header again.
- The language switch on `/it/musei/` goes to `/en/musei/`.
- "Preferenze privacy" reopens the consent banner.
- `/it/approach/` still shows the full Isagog header and footer.

- [ ] **Step 10: Commit**

```bash
git add -A "src/app/[locale]/(musei)" "src/app/[locale]/(pages)/musei" src/packages/locales/lang/it.ts src/packages/locales/lang/en.ts scripts/check-export.mjs
git commit -m "feat: give the museum page its own header and footer"
```
