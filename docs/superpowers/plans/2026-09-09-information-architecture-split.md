# Information Architecture Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the 3,221-word single-scroll homepage into a landing page plus four substantial destination pages, so every navigation item points at a comparable thing and every piece of writing has its own shareable URL.

**Architecture:** The seven homepage sections are already self-contained server components, each reading its own `getScopedI18n` scope. This plan moves them — it does not rewrite them. Visione + Metodologia become `/approach`; Tecnologia merges into `/platform` above the existing explorer; Persone becomes `/about`; Contatto becomes `/contact`. The homepage keeps Hero + Apertura and gains short teasers built from copy that already exists.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript 5 strict, Tailwind v4 (CSS-first), next-international, Vitest, pnpm 9 / Node 22.

**Predecessor:** `docs/superpowers/plans/2026-09-08-isagog-site-redesign.md` built the site this restructures. Its spec, `docs/superpowers/specs/2026-09-08-isagog-site-redesign-design.md`, still governs everything it does not contradict.

## Why this exists

Measured on the current build:

| route | prose |
|---|---|
| `/` | **3,221 words** |
| `/platform` | 516 |
| `/project` | 149 (an index) |
| `/blog` | 154 (an index) |

Roughly 80% of the site's writing is on one page. The header presents four items as peers when one is a book and three are pamphlets. Four substantial content areas — Visione, Metodologia, Tecnologia, Persone — appear in no menu, no footer, and have no URL beyond an anchor fragment. "Chi sono queste persone" is a top-three question for a company selling trustworthy AI, and the founders' credentials sit at 80% scroll depth.

This plan does **not** rewrite the argument. The draft's prose is the asset; it moves intact.

## Global Constraints

Every task's requirements implicitly include these.

- **Working directory** `/Volumes/2TBWDB/code/newwebisagog/newwweb`. Reference material: `../bozzacompleta.html` (the design draft) and `../isagog.github.io/` (the current live site). **Never modify either.**
- **Node 22, pnpm 9.** Never `npm install`.
- **Static export only.** No middleware, server actions, route handlers, or runtime env vars. Every dynamic route needs `generateStaticParams`; `[slug]` routes also need `export const dynamicParams = false`.
- **TypeScript strict** with `noUncheckedIndexedAccess`.
- **ESLint errors:** `@typescript-eslint/no-explicit-any`, `consistent-type-imports` (use `import type`), `eqeqeq`, `no-console` except `console.error`, unused vars unless `_`-prefixed.
- **Copy never lives in components** — including error messages, `alt` text and `aria-label`s. All strings live in `src/packages/locales/lang/{it,en}.ts`, which **must stay structurally identical** (currently 189 keys, name- and order-identical; verify after every task).
- **Language policy differs by page.** Homepage/argument copy is Italian-first with English deferred — English values holding Italian text is correct there. The lifted pages (`/platform`, `/project`, `/blog`) carry real English from the old site; English matching Italian there is a defect.
- **Colours only through design tokens** in `src/app/globals.css`. Tailwind silently emits nothing for an unknown utility, so a wrong token name is invisible — grep the built CSS when you add one.
- **`asset()` from `src/lib/base-path.ts` is mandatory** for every root-relative raw string: `fetch` URLs, `<iframe src>`, `next/image` `src` (Next does **not** prefix these), and anything under `public/`. The site deploys to `https://isagog.com/isagog-web/`, where a missed `asset()` does not 404 — it silently serves **the old live site**. This has already caused three separate bugs.
- **Every internal link uses `LocaleLink`**, never a bare `next/link`. In-page anchors (`#…`) and `mailto:` use a bare `<a>`.
- Commit conventional-commits style, ending every message with:

  ```
  Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
  ```

## Target structure

```
/                      landing — Hero, Apertura, five teasers, contact band
/approach              Visione + Metodologia          (new)
/platform              Tecnologia + explorer + carousel (gains Tecnologia)
/project               case-study index               (unchanged)
/project/[slug]        three case studies × 2 locales (unchanged)
/blog                  article index                  (unchanged)
/blog/[slug]           five articles × 2 locales      (unchanged)
/about                 Persone                        (new)
/contact               Contatto + mailto form         (new)
```

Route segments stay English while labels are Italian, as they already are (`/platform` labelled "La Piattaforma"). Per-locale route names are not workable under `next-international` with static export, and mixed-language URLs would be worse than consistent English ones.

**`/about` and `/contact` reuse two of the four old-site URLs**, so those stop 404ing at cutover for free. `/service` and `/work-with-us` still need stubs (Task 8).

### Navigation

```
Isagog   Inizio · Approccio · Piattaforma · Progetti · Approfondimenti · Chi siamo   [Valutiamo il vostro caso]
```

Six items plus a CTA is tight. The wordmark already links home, so **if the row wraps or crowds below 1280px, drop "Inizio"** — but do not drop it pre-emptively: it was added at the owner's explicit request in commit `9f945be`. Measure in the build, then decide, and say what you found.

The mobile dropdown carries all six plus the CTA, as it does today.

## Locale scope reorganisation

Section copy currently lives under `home.*` even for content that will no longer be on the homepage. Scopes move with their pages:

| today | becomes |
|---|---|
| `home.hero`, `home.apertura`, `home.card` | unchanged |
| `home.visione`, `home.metodologia` | `approach.visione`, `approach.metodologia` |
| `home.tecnologia` | `platform.tecnologia` |
| `home.persone` | `about.persone` |
| `home.contatto` | `contact.contatto` |
| — | `home.teasers` (new, Task 6) |
| — | `nav.approach`, `nav.about` (new, Task 1) |

Do this move in the task that moves the corresponding page, not all at once, so each task's diff is self-contained and reviewable.

## File structure

```
src/app/[locale]/(pages)/
├── (index)/
│   ├── page.tsx                 landing: Hero, Apertura, Teasers, ContactBand
│   └── components/
│       ├── hero.tsx             stays
│       ├── apertura.tsx         stays
│       ├── knowledge-card.tsx   stays (Apertura composes it)
│       ├── teasers.tsx          NEW — the five onward cards
│       └── index.tsx            barrel, trimmed
├── approach/
│   ├── page.tsx                 NEW
│   └── components/{visione,metodologia,demo-slot}.tsx   moved
├── platform/
│   ├── page.tsx                 gains Tecnologia above the explorer
│   └── components/{tecnologia,text-carousel}.tsx        tecnologia moved in
├── about/
│   ├── page.tsx                 NEW
│   └── components/persone.tsx   moved
├── contact/
│   ├── page.tsx                 NEW
│   └── components/{contatto,contact-form}.tsx           moved
├── project/…                    unchanged
└── blog/…                       unchanged

src/lib/page-metadata.ts         NEW — per-page metadata builder (Task 7)
```

---

### Task 1: Navigation and route shells

**Files:**
- Create: `src/app/[locale]/(pages)/{approach,about,contact}/page.tsx` (placeholders)
- Modify: `src/app/_components/custom/header.tsx`, `footer.tsx`
- Modify: `src/packages/locales/lang/{it,en}.ts` (add `nav.approach`, `nav.about`)
- Modify: `scripts/check-export.mjs`

**Interfaces:**
- Consumes: `LocaleLink`, `useScopedI18n`, `stripLocale`, the `isActive` helper already in `header.tsx`.
- Produces: three routes that build and are reachable; nav items for them.

The placeholders exist so the nav never points at a 404 while later tasks fill them in. Each renders a `<main>` with the page's `<h1>` from the locale files and nothing else.

- [ ] **Step 1: Add the nav keys to both locale files**

`it.ts` — inside the existing `nav` scope, after `home`:

```ts
    approach: "Approccio",
    about: "Chi siamo",
```

`en.ts`, same position:

```ts
    approach: "Approach",
    about: "About",
```

- [ ] **Step 2: Add the placeholder routes**

Create `src/app/[locale]/(pages)/approach/page.tsx`, and the same shape for `about` and `contact` (swapping the scope name):

```tsx
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";

const ApproachPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("nav");

  return (
    <main className="mx-auto max-w-[1224px] px-6 py-20">
      <h1 className="text-[clamp(32px,4vw,46px)] leading-[1.15] text-forest">
        {t("approach")}
      </h1>
    </main>
  );
};

export default ApproachPage;
```

- [ ] **Step 3: Extend the header nav**

In `header.tsx`, `navItems` becomes:

```tsx
  const navItems = [
    { href: "/", label: t("home") },
    { href: "/approach", label: t("approach") },
    { href: "/platform", label: t("platform") },
    { href: "/project", label: t("project") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("about") },
  ];
```

The CTA's `href` changes from `/#contatto` to `/contact`. Leave the `isActive` helper alone — it already exact-matches `/` and prefix-matches the rest, which is correct here.

- [ ] **Step 4: Make the footer a real sitemap**

The footer currently carries three links. It is the safety net for everything the header cannot hold, and on a site with no other wayfinding it is where a reader at the bottom of a page looks. Give it every route in one row-wrapping list, in the same order as the header, plus the existing `mailto:` and address.

Keep it a single flat list — do not build column groups with headings; there are only eight links and the visual weight is not worth it.

- [ ] **Step 5: Extend the export checker**

In `scripts/check-export.mjs`, `ROUTES` becomes:

```js
const ROUTES = ["", "approach", "platform", "project", "blog", "about", "contact"];
```

- [ ] **Step 6: Verify**

```bash
pnpm test && pnpm typecheck && pnpm lint && pnpm build
```

Expected: `check-export: ok`, 14 route pages + 16 detail pages. Then confirm the locale files are still structurally identical:

```bash
node -e '
const it=require("fs").readFileSync("src/packages/locales/lang/it.ts","utf8");
const en=require("fs").readFileSync("src/packages/locales/lang/en.ts","utf8");
const k=s=>[...s.matchAll(/^\s*([A-Za-z_][\w-]*):/gm)].map(m=>m[1]);
const a=k(it),b=k(en);
console.log(a.length,b.length,JSON.stringify(a)===JSON.stringify(b));'
```

Expected: equal counts and `true`.

**Also measure the nav width now**, before later tasks add visual weight: build, then check whether the six items plus CTA fit on one row at 1280px without wrapping. Record what you find in your report — Task 9 acts on it.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add approach, about and contact routes to the navigation

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: `/approach` — Visione and Metodologia

**Files:**
- Move: `(index)/components/{visione,metodologia,demo-slot}.tsx` → `approach/components/`
- Modify: `approach/page.tsx`, `(index)/page.tsx`, `(index)/components/index.tsx`
- Modify: `src/packages/locales/lang/{it,en}.ts` (`home.visione`/`home.metodologia` → `approach.*`)

**Interfaces:**
- Consumes: `SectionHeading`, `CapabilityCard`, `getScopedI18n`, `setStaticParamsLocale`.
- Produces: `/approach` rendering both sections; the homepage no longer rendering them.

This is the argument's core: why knowledge must be explicit, and how Isagog builds it. The two sections belong together — Metodologia answers the question Visione raises — and the Porfirio passage in Visione depends on the setup above it, so **do not reorder or split them**.

- [ ] **Step 1: Move the components**

```bash
mkdir -p "src/app/[locale]/(pages)/approach/components"
git mv "src/app/[locale]/(pages)/(index)/components/visione.tsx" "src/app/[locale]/(pages)/approach/components/"
git mv "src/app/[locale]/(pages)/(index)/components/metodologia.tsx" "src/app/[locale]/(pages)/approach/components/"
git mv "src/app/[locale]/(pages)/(index)/components/demo-slot.tsx" "src/app/[locale]/(pages)/approach/components/"
```

`demo-slot.tsx` moves with Visione — it is the marked landing point for a future interactive demo and Visione is its only consumer.

- [ ] **Step 2: Rename the locale scopes**

In both `it.ts` and `en.ts`, move the `visione` and `metodologia` blocks out of `home` and into a new top-level `approach` scope, placed after `home`. Keep the keys inside each block byte-identical — only the parent changes.

Then update the two components: `getScopedI18n("home.visione")` → `getScopedI18n("approach.visione")`, and the same for metodologia.

- [ ] **Step 3: Write the page**

`approach/page.tsx`:

```tsx
import { setStaticParamsLocale } from "@/packages/locales/server";
import { Metodologia, Visione } from "./components";

const ApproachPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Visione />
      <Metodologia />
    </main>
  );
};

export default ApproachPage;
```

Add a barrel at `approach/components/index.tsx` exporting `Visione`, `Metodologia` and `DemoSlot`, matching the existing pattern.

- [ ] **Step 4: Remove them from the homepage**

Drop `<Visione />` and `<Metodologia />` from `(index)/page.tsx` and their exports from `(index)/components/index.tsx`.

- [ ] **Step 5: Keep the section anchors**

Both sections keep `id="visione"` / `id="metodologia"` and the `scroll-anchor` class — they now serve `/approach#metodologia`, which is a genuinely useful deep link since the page holds two long sections.

- [ ] **Step 6: Verify**

`pnpm test && pnpm typecheck && pnpm lint && pnpm build`, then confirm:

```bash
grep -c "Porfirio" out/it/approach/index.html      # 1 — the passage moved intact
grep -c "Porfirio" out/it/index.html               # 0 — and left the homepage
grep -o 'id="visione"\|id="metodologia"' out/it/approach/index.html
```

Re-run the locale-parity check from Task 1 Step 6.

- [ ] **Step 7: Commit**

---

### Task 3: `/platform` absorbs Tecnologia

**Files:**
- Move: `(index)/components/tecnologia.tsx` → `platform/components/`
- Modify: `platform/page.tsx`, `(index)/page.tsx`, both barrels, both locale files

**Interfaces:**
- Consumes: `SectionHeading`, `LocaleLink`, `asset`.
- Produces: `/platform` with Tecnologia above the explorer iframe.

Tecnologia is *about* the platform and already ends with a CTA to `/platform`. Merging them removes the site's one naming collision — nav "La Piattaforma" versus section "03 TECNOLOGIA", two names for one subject at two depths with nothing stating the relationship.

- [ ] **Step 1: Move the component and its scope**

`git mv` into `platform/components/`, and move the `tecnologia` block from `home` into the existing `platform` scope in both locale files. Update the component to `getScopedI18n("platform.tecnologia")`.

- [ ] **Step 2: Drop the now-circular CTA**

Tecnologia's action bar ends with a link to `/platform`. On `/platform` that links to itself. **Remove the CTA link, keep the badge.** Delete the now-unused `cta` key from the `tecnologia` scope in both locale files.

- [ ] **Step 3: Compose the page**

In `platform/page.tsx`, render `<Tecnologia />` first, then the existing hero, iframe, mobile notice and carousel. Delete the page's own `heroTitle`/`heroDescription` block — Tecnologia's `SectionHeading` now carries the page's opening, and two stacked headings would be redundant. Remove those two keys from the `platform` scope in both files.

Keep `explorerTitle`, `mobileNotice` and `mobileCta`.

- [ ] **Step 4: Renumber**

Tecnologia's eyebrow reads `03 / TECNOLOGIA`. The `01–04` sequence describes a scroll that no longer exists. **Change the eyebrow to `LA PIATTAFORMA` in `it.ts` and `THE PLATFORM` in `en.ts`.** Tasks 4 and 5 do the same for their sections; Task 2 leaves Visione and Metodologia numbered `01`/`02`, which still reads correctly as a two-part argument on one page.

- [ ] **Step 5: Verify and commit**

Confirm `out/it/platform/index.html` contains the Tecnologia prose, the four use-cases, the three controls and the iframe, and that no link on the page points at `/platform`.

---

### Task 4: `/about` — Persone

**Files:**
- Move: `(index)/components/persone.tsx` → `about/components/`
- Modify: `about/page.tsx`, `(index)/page.tsx`, both barrels, both locale files

The founders' credibility — IBM research, forty years of clinical practice — is the site's strongest trust signal and currently sits sixth of seven with no URL. This gives it one.

- [ ] **Step 1:** `git mv` the component; move `home.persone` → `about.persone` in both locale files; update the scope call.
- [ ] **Step 2:** Write the page in the same shape as Task 2's, rendering `<Persone />`.
- [ ] **Step 3:** Remove it from the homepage and the barrel.
- [ ] **Step 4:** Its eyebrow already reads `LE PERSONE DI ISAGOG` — unnumbered, and now correct rather than anomalous. Leave it.
- [ ] **Step 5:** Verify both portraits still resolve (`asset()`-wrapped `next/image` srcs) in a plain **and** a `NEXT_PUBLIC_BASE_PATH=/isagog-web` build. Commit.

---

### Task 5: `/contact` — the form

**Files:**
- Move: `(index)/components/{contatto,contact-form}.tsx` → `contact/components/`
- Modify: `contact/page.tsx`, `(index)/page.tsx`, both barrels, both locale files
- Modify: any remaining `/#contatto` links

**The form sends nothing and that is deliberate** — it builds a `mailto:` link and opens the reader's own mail client. Its disclosure text saying so ships verbatim; it is a promise to whoever fills it in. Do not add a fetch, an API route, or a third-party form service, and do not soften the disclosure.

- [ ] **Step 1:** `git mv` both components; move `home.contatto` → `contact.contatto`; update the scope call.
- [ ] **Step 2:** Write the page rendering `<Contatto />`.
- [ ] **Step 3:** Remove from the homepage and barrel.
- [ ] **Step 4:** Change the eyebrow from `04 / DALLA DIMOSTRAZIONE AL LAVORO QUOTIDIANO` to `DALLA DIMOSTRAZIONE AL LAVORO QUOTIDIANO` — drop the number, keep the phrase.
- [ ] **Step 5:** Replace every remaining `/#contatto` with `/contact`. Grep for it: `grep -rn '#contatto' src/`. Expect the header CTA (already done in Task 1) and Apertura's primary CTA.
- [ ] **Step 6:** Verify `buildMailtoHref` still passes its tests, that the form renders on `/contact`, and commit.

---

### Task 6: The homepage becomes a landing page

**Files:**
- Create: `(index)/components/teasers.tsx`
- Modify: `(index)/page.tsx`, `(index)/components/index.tsx`, both locale files

**Interfaces:**
- Consumes: `LocaleLink`, `getScopedI18n`, `asset`.
- Produces: `Teasers` — five cards linking to the destination pages.

After Tasks 2–5 the homepage is Hero + Apertura and stops abruptly. This gives it an ending and makes every destination reachable from the front door.

- [ ] **Step 1: Reuse the copy that already exists**

**Write no new marketing prose.** Each moved section already has a `lead` written for exactly this register, and those leads are now unused on their own pages or duplicated by the section heading. Use them:

| teaser | title | body — reuse verbatim |
|---|---|---|
| Approccio | `nav.approach` | `approach.metodologia.lead` — "Dai vostri documenti e dai vostri dati, una conoscenza che ragiona. In giorni, sotto la vostra supervisione." |
| Piattaforma | `nav.platform` | `platform.tecnologia.lead` — "Sui vostri sistemi, con i vostri dati, ai vostri costi." |
| Progetti | `nav.project` | new, one line — see Step 2 |
| Approfondimenti | `nav.blog` | new, one line — see Step 2 |
| Chi siamo | `nav.about` | `about.persone.lead` — "Dalla ricerca all'impresa, fino al vostro prossimo progetto." |

Copy the three reused strings into a new `home.teasers` scope rather than reaching across scopes at the call site — `t()` needs literal key paths, and cross-scope reads make the teaser copy invisible to whoever edits it later. Duplication of three short strings is the right trade here; note it in your report.

- [ ] **Step 2: Two new strings only**

`/project` and `/blog` have no lead to borrow. Write one line each, in the draft's register — declarative, concrete, no adjectives. Italian, with English mirroring it per the Italian-first policy. Suggested, adjust if you can do better:

```
progetti:         "Musei, archivi giornalistici, servizio clienti: la conoscenza al lavoro."
approfondimenti:  "Il pensiero che sta dietro al metodo."
```

- [ ] **Step 3: Build the component**

Five cards. Follow the existing visual language: `bg-paper`, `border-card-border`, `font-serif` titles in `text-forest`, body in `text-prose-muted`, an `ArrowUpRight` from lucide. A responsive grid — one column below `sm`, two at `sm`, three at `lg` with the last two spanning — or simply two columns; use your judgement and say what you chose.

Every card is a `LocaleLink` wrapping the whole card, not a nested link inside it.

- [ ] **Step 4: Compose the landing page**

```tsx
<main>
  <Hero />
  <Apertura />
  <Teasers />
</main>
```

Apertura's secondary CTA currently points at `/#visione`, which no longer exists. Change it to `/approach`.

- [ ] **Step 5: Verify**

Build and confirm the homepage now contains exactly five outbound teaser links, that its word count has dropped to roughly 900–1,100, and that every one of the five targets returns a page in the build.

- [ ] **Step 6: Commit**

---

### Task 7: Per-page metadata

**Files:**
- Create: `src/lib/page-metadata.ts`, `src/lib/page-metadata.test.ts`
- Modify: every `page.tsx` (9 routes), `src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `SITE_URL`, `IS_STAGING` from `src/lib/base-path.ts`; `locales` from `src/lib/locale-href.ts`.
- Produces: `buildPageMetadata({ locale, path, title, description }): Metadata`.

Today **all 24 pages emit the same `<title>`, the same `og:url`, and a `canonical` pointing at the site root** — inherited from the old site and flagged as Critical in the previous plan's final review. Splitting into nine routes makes it worse: nine distinct pages all claiming to be the homepage. Fix it here, where the routes are being touched anyway.

- [ ] **Step 1: Write the failing test**

`src/lib/page-metadata.test.ts`. The module reads `SITE_URL` at import time, so use the `vi.resetModules()` + dynamic import pattern already established in `src/lib/base-path.test.ts`. Cover:

- canonical is `${SITE_URL}/${locale}${path}/` — locale-aware, trailing slash, **not** the site root
- `alternates.languages` gives both locales' absolute URLs for the same path
- `openGraph.url` equals the canonical
- under a staging base path every URL carries `/isagog-web`
- `robots: { index: false, follow: false }` when `IS_STAGING`, absent otherwise
- the title is the page's own, not the site's

- [ ] **Step 2: Run it, watch it fail, then implement**

`buildPageMetadata` returns a `Metadata` object. Take the shape from the current `layout.tsx` metadata — it is correct in every respect except being one-size-fits-all. Keep `metadataBase: new URL(SITE_URL)`, the social image, and the staging `robots` guard.

- [ ] **Step 3: Apply to every route**

Each `page.tsx` exports:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("meta");
  return buildPageMetadata({
    locale,
    path: "/approach",
    title: t("approach.title"),
    description: t("approach.description"),
  });
}
```

Add a `meta` scope to both locale files with a title and description per route. Titles are the page's own subject, not the company tagline. Descriptions are one sentence.

The `[slug]` routes derive their title from the MDX — the first `# ` heading, which `getMdxBySlug` already returns in `content`. Extract it rather than hardcoding, and fall back to the section title if a file has no heading.

- [ ] **Step 4: Thin the layout**

`layout.tsx` keeps `metadataBase`, `icons` and the site-wide `openGraph.siteName`. Remove the page-specific `title`, `description`, `canonical` and `alternates` — they are per-page now.

- [ ] **Step 5: Verify**

Sweep **every** URL-bearing metadata field across several pages in both builds — canonical, `og:url`, `og:image`, `twitter:image`, both `hreflang` links, `rel="icon"`. Spot-checking the fields you happen to think of is how the last two of these bugs survived review; sweep the whole object.

```bash
for p in "" approach platform project blog about contact; do
  echo "--- /it/$p"
  grep -o 'rel="canonical" href="[^"]*"\|<title>[^<]*</title>' "out/it/$p/index.html"
done
```

Every canonical must differ and match its own path. Then repeat under `NEXT_PUBLIC_BASE_PATH=/isagog-web` and confirm every one carries the base path. Finish with a plain build.

- [ ] **Step 6: Commit**

---

### Task 8: Sitemap, old URLs and the export checker

**Files:**
- Modify: `src/app/sitemap.ts`, `scripts/check-export.mjs`
- Create: `public/{service,work-with-us}/index.html`

- [ ] **Step 1: Complete the sitemap**

It currently lists four paths × two locales. It must list all seven routes × two locales plus the sixteen detail pages — 30 entries — generated from `getSlugs` rather than hand-maintained, with trailing slashes to match `trailingSlash: true`.

- [ ] **Step 2: Stub the two remaining old URLs**

`/about` and `/contact` now exist as real routes, so two of the old site's four dropped URLs are already rescued. `/service` and `/work-with-us` still 404 at cutover.

Add `public/service/index.html` and `public/work-with-us/index.html` using the same client-redirect pattern as `public/index.html` — **relative URLs only**, so they work at both the domain root and under the staging base path. `/service` → `./platform/`, `/work-with-us` → `./about/`. Include the `noscript` meta-refresh fallback and a visible link, as the existing file does.

Note these live outside the locale segments, matching the old site's URL shape.

- [ ] **Step 3: Verify and commit**

Confirm the sitemap has 30 `<loc>` entries, all with trailing slashes, and that both stubs are copied into `out/`.

---

### Task 9: Wayfinding

**Files:**
- Modify: `blog/[slug]/page.tsx`, `project/[slug]/page.tsx`
- Modify: `header.tsx` if Task 1's width measurement calls for it
- Modify: both locale files

- [ ] **Step 1: End the dead ends**

Finish a case study or an article today and there is nowhere to go. Add a footer block to both `[slug]` pages: a link back to the index, and — if you can do it cleanly from `getSlugs` — the next item in the list. Copy in the locale files.

- [ ] **Step 2: Act on the nav-width finding**

If Task 1 found the six items plus CTA crowding below 1280px, drop "Inizio": the wordmark already links home, and it was added when the homepage was the whole site. Say so in your report either way, and do not remove it without the measurement.

- [ ] **Step 3: Verify and commit**

---

### Task 10: Final sweep

- [ ] **Step 1:** `grep -rn '#visione\|#metodologia\|#tecnologia\|#persone\|#contatto' src/` — every in-page anchor that pointed at a homepage section. `/approach#visione` and `/approach#metodologia` remain valid; the rest must now be page links.
- [ ] **Step 2:** Confirm the locale files are still structurally identical, and that no `home.*` key survives for content that moved.
- [ ] **Step 3:** Full verification both ways, finishing with a plain `pnpm build`.
- [ ] **Step 4:** Re-measure the word distribution and put it in your report:

```bash
for p in "" approach platform project blog about contact; do
  w=$(sed 's/<[^>]*>/ /g' "out/it/$p/index.html" | wc -w)
  echo "  /$p: ~$w words"
done
```

The goal was that no single route dominates. Report what you actually got — if the homepage is still three times its neighbours, say so rather than declaring success.

- [ ] **Step 5:** Commit.

---

## Out of scope

- **Rewriting any of the draft's prose.** It moves intact. The only new copy is two teaser lines and the `meta` descriptions.
- **The English translation** of homepage-origin copy. Italian-first stands; `/platform`, `/project` and `/blog` keep their real English.
- **`lang="en"` on Italian content.** Known, and a translation question rather than a structural one.
- **Build-time rendering for the `/project` and `/blog` indexes.** They fetch at runtime, so a no-JS visitor sees permanent skeletons. Real, worth doing, and independent of this restructure.
- **The interactive three-industry demo** for `DemoSlot`.
- **Deployment.** Repository creation and Pages setup remain the owner's to run.

## Assumptions

- The owner has approved the split in principle; the draft's single-page shape is deliberately superseded.
- Route segments stay English while labels stay Italian.
- No redirects exist for the old `/#visione`-style anchors — they were never published, so nothing external links to them.
