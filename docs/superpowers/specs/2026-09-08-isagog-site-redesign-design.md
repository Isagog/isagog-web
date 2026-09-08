# Isagog site redesign — design

**Date:** 2026-09-08
**Status:** approved, ready for implementation planning

## Objective

Replace the current isagog.com site with a new static site built from the
`bozzacompleta.html` design draft, deployed to GitHub Pages from a new
repository scaffolded in `newwweb/`.

The new site keeps the draft's homepage narrative intact and carries over three
pages from the existing site — platform, project, blog — restyled to the draft's
visual language.

## Sources

| Source | Role |
|---|---|
| `bozzacompleta.html` (workspace root) | Design and copy for the homepage. Single Italian page, self-contained: inline `<style>`, eight base64 images, working-draft status banner. |
| `isagog.github.io/` | Current live site (Next.js 16 static export). Source for the three lifted pages, the MDX pipeline, i18n setup, assets, and CI workflow. |
| `ontologies.txt` | Pointers to TTL ontologies (isagog-top, MAXXI, mema) — **phase 2 only**, not used here. |

## Decisions

### Stack

Next.js 16 with `output: "export"`, in a new repository at `newwweb/`.

Chosen for reuse, not novelty. Four things port from `isagog.github.io` intact:

- the MDX pipeline (`src/lib/mdx.ts`) that renders blog articles and project case studies
- `next-international` locale routing with `/it` and `/en` URL segments
- the `platform-explorer` standalone HTML diagrams (embedded as an iframe)
- the pnpm → lint → build → Pages GitHub Actions workflow

Rejected: **Astro** (better fit for a brochure site, but a new stack and nothing
ports); **plain hand-written HTML** (closest to the draft, but blog/project
list+detail pages get rebuilt by hand and nav/footer duplicate across pages).

### Navigation

One scrolling homepage carrying the draft's argument unbroken, plus a sticky
numbered section rail.

- Header at rest: wordmark · La Piattaforma · Progetti · Approfondimenti · CTA.
- Past the hero, a slim vertical index appears at the left edge on desktop:
  `01 Visione / 02 Metodologia / 03 Tecnologia / Persone / 04 Contatto`, with
  scroll-spy highlighting the active section.
- Each section is deep-linkable (`/#visione`, `/#metodologia`, …).
- On mobile the rail collapses into the header dropdown.

Rationale: the draft already numbers its own sections 01–04 — a table of
contents without a body. The rail gives it one while keeping the narrative
continuous (the Porfirio passage only lands if the reader arrives from the
Visione argument).

### Routes

```
/{locale}/                     home — hero, apertura, 01–04, persone
/{locale}/platform/            platform explorer
/{locale}/project/             case-study index
/{locale}/project/[slug]/      case study (MDX, per-locale)
/{locale}/blog/                article index
/{locale}/blog/[slug]/         article (MDX, shared across locales)
```

`about`, `service` and `work-with-us` are **dropped as pages**. Their substance
already lives in the new homepage: PERSONE absorbs about, TECNOLOGIA's four
use-cases absorb service. `contact` becomes homepage §04.

`/` is not a Next route (static export has no middleware): a hand-written
`public/index.html` sniffs `navigator.language` and redirects to `/it/` or
`/en/`, as the current site does.

### Languages

Italian first. `/it` is built from the draft's copy verbatim; locale routing
stays in place so English can be added without restructuring. English homepage
copy is deferred to a second pass. Existing EN content for platform, project and
blog carries over unchanged.

Practical consequence: `en.ts` and `it.ts` must stay structurally identical for
the typed `t()` keys to work, so English homepage keys ship as the Italian text
(or a first-draft translation) rather than as missing keys.

### Design tokens

The draft's palette supersedes the current one — it is a deliberate revision,
not an approximation.

| Token | Draft | Current site |
|---|---|---|
| page background | `#f7f8f2` | `#c9dec4` (mist) |
| forest | `#173c31` | `#1f321a` |
| sage | `#688151` | `#5f9353` |
| terracotta | `#ce4e27` | `#ce4e27` (unchanged) |
| visione ground | `#183d30` | — |
| tecnologia ground | `#e8eedf` | — |
| persone ground | `#f0f3e9` | — |

The dark section needs its own emphasis colour: `--em-dark #c0d78c`. The
light-section sage (`#688151`) measures only 2.77:1 against the visione ground
and fails WCAG AA; `--em-dark` measures 7.63:1.

Plus the draft's supporting values: `--forest-deep #1a4939`, `--muted #536157`,
`--prose-muted #5d6c55`, `--olive #668f3e`, `--border #d8dfd3`,
`--divider #adbd9e`, `--cream #f1f5e7`, `--card-bg #fafbf7`,
`--card-border #d7dfd0`, `--num #7a876e`, `--result #506943`.

These become Tailwind v4 `@theme inline` variables in `globals.css`, following
the pattern the current repo already uses. `tailwind.config.ts` stays nearly
empty — tokens live in CSS.

The three section grounds are what give the page its rhythm (light → dark →
light → tinted → tinted) and must survive the port.

### Typography

The draft's `Georgia` / `Arial` are stand-ins. They map to **Fraunces** (display
serif, the default face) and **Inter** (sans), loaded via `next/font` as
`--font-fraunces` / `--font-inter`, matching the current site's setup.

The draft's type scale carries over as-is, including its `clamp()` sizes:
section titles `clamp(28px, 3.4vw, 39px)`, museum-business headings
`clamp(24px, 2.6vw, 31px)`, capability headings 24px, body 16–16.5px/1.6.

### Assets

Seven of the draft's eight embedded images already exist in
`isagog.github.io/public/images/`:

- hero tree → `tree.avif` (14.8 KB)
- inline bonsai → `about-images/tree-bonsai.png`
- contatto background trees → `about-images/tree-{pine,cypress,bushy,palm}.png`
- Robert's photo → `team-images/Robert.avif`

The eighth — Guido's photo, a 705 KB PNG — is new and must be extracted from the
base64 and compressed (target: AVIF, under 100 KB, matching `Robert.avif`).

No other asset extraction is needed. `public/platform-explorer/{it,en}.html`,
`favicon.ico` and the logo copy over as files.

### Contact form

The draft states in its own disclosure that the form sends nothing and only
prepares an email draft. That behaviour is kept: client-side construction of a
`mailto:` link with the field values in the body, opened in the user's mail
client. GitHub Pages has no backend, and no third-party form endpoint is being
introduced.

The disclosure text stays visible — it is a promise to the user, not filler.

### Deployment

New repository, GitHub Pages, deployed to its own `*.github.io` URL. The
`isagog.com` custom domain stays pointed at the current site until the new one
is reviewed live; cutting the domain over is a separate, reversible step taken
on approval.

CI mirrors `isagog.github.io/.github/workflows/main.yml`: pnpm 9, Node 22,
`pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm build` → upload `out/` as
both a retained artifact and the Pages artifact → deploy.

## Component structure

Homepage sections become one component each, in
`src/app/[locale]/(pages)/(index)/components/`, so no file carries more than one
section's markup and copy:

| Component | Draft section |
|---|---|
| `hero.tsx` | `.hero1` — tree image, h1, tagline |
| `apertura.tsx` | `.apertura` — eyebrow, h2, sub, CTAs |
| `knowledge-card.tsx` | `.museum-hero` — the museum graph card (phase 2 replaces this) |
| `visione.tsx` | `01 VISIONE` — dark section, prose, museum-business, demo slot |
| `metodologia.tsx` | `02 METODOLOGIA` — prose + three capability cards |
| `tecnologia.tsx` | `03 TECNOLOGIA` — prose, four use-cases, three controls, actions |
| `persone.tsx` | `LE PERSONE` — two bios |
| `contatto.tsx` | `04 CONTATTO` — copy, three steps, mailto form |

Shared: `section-rail.tsx` (scroll-spy index), `header.tsx`, `footer.tsx`,
`section-heading.tsx` (eyebrow + title + lead, repeated across four sections),
`capability-card.tsx`.

Copy does not live in these components — it lives in
`src/packages/locales/lang/{it,en}.ts` under a `home-page` scope, as the current
site does.

### The demo slot

`01 VISIONE` ends with a dashed `.demo-note` box that reads: *"↓ Qui segue la
demo interattiva del museo già presente nel sito base … invariata, non l'ho
ricostruita in questa bozza statica."*

This is a placeholder for an interactive demo that does not exist in the draft.
It is preserved as an explicitly marked empty slot (`<DemoSlot />`) so phase 2
has an obvious place to land. It must not ship to production as the draft's
working note.

## Testing

The current repo has no test framework. This project introduces **Vitest** (one
devDependency, zero-config with TypeScript) for the logic layer only — the parts
where a wrong answer is silent and a test is cheap:

- `localeHref` / `stripLocale` — locale prefixing and stripping
- `getSlugs` / `getMdxBySlug` — content discovery and frontmatter parsing
- the Zod list schemas — rejecting malformed `list.json`
- `computeActiveSection` — the scroll-rail's pure position→section function
- `buildMailtoHref` — the contact form's link construction

Markup and copy are not unit-tested; a test asserting a `<h2>` contains a string
restates the component. Those are verified by the build and by eye. Two
mechanical guards cover what eyes miss: a test asserting `globals.css` defines
every design token at its specified value, and `scripts/check-export.mjs`
asserting every expected route emitted an `index.html`.

Full verification:

1. `pnpm test` — Vitest suite passes
2. `npx tsc --noEmit` — clean
3. `pnpm lint` — clean under the ported ESLint rules
4. `pnpm build` — static export succeeds; `node scripts/check-export.mjs`
   confirms every expected route emitted `<route>/index.html`
5. Visual check against `bozzacompleta.html` at the draft's own breakpoints
   (640px, 760px, 900px, desktop) for each section
6. Locale check: `/it` and `/en` both build; `LocaleLink` used for every internal
   href; no bare `next/link` for internal routes
7. Anchor check: each `/#section` deep link scrolls correctly and the rail's
   scroll-spy tracks it

## Out of scope

- **Phase 2** — replacing the single museum card with a three-industry version
  (museum / news archive / clinical) sourced from the real MAXXI, mema and
  isagog-top ontologies, tied to the "AI that knows when it does not know" claim.
  Tracked separately; the `DemoSlot` and `knowledge-card.tsx` are its landing
  points.
- English translation of the new homepage copy.
- Custom-domain cutover.
- Any change to `isagog.github.io`, which stays live and untouched.

## Assumptions

- `newwweb/` is currently empty and is the new repository's root.
- The draft's copy is final enough to build against; copy revisions are expected
  and cheap, since all strings live in the locale files.
- The working-draft status banner at the top of `bozzacompleta.html` ("Bozza
  completa · testo …") is a review artifact and does not ship.
- The draft's `href="#"` placeholders (wordmark, both hero CTAs, nav CTA,
  answer-strip) resolve to: wordmark → `/`, CTAs → `#contatto`, answer-strip →
  the demo slot.
