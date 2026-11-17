# Standalone /musei page — design

Date: 2026-11-17 · Status: approved · Branch: `feat/musei-page`

## Intent

`/musei` is the page Isagog sends museum staff to from outreach emails. A
museum visitor who lands on it should see only that page, in their language,
without the main Isagog menu and footer pulling them towards enterprise and
technology pages. When they do want to know about the company or the
technology, one clear link takes them to the main site.

## Goals

- One scrolling page per language: `/it/musei/` and `/en/musei/`. The content
  is Maria's draft (`src/app/[locale]/(pages)/musei/`), unchanged.
- A museum-only header and footer in place of the Isagog ones on that page.
- A link from the museum page to the main site home, in the same language.
- The bare `isagog.com/musei` opens the page in the visitor's language.

## Non-goals

- No extra pages, sub-pages or museum menu. It stays a single scroll.
- No link to `/musei` from the main Isagog header, footer or pages.
- No change to the page's copy or sections.

## Anti-goals

- The museum page shows any part of the Isagog nav (approach, platform,
  projects, blog, careers).
- A visitor lands on the company site by accident, for example by clicking
  the logo.
- The main site's pages, URLs or header behaviour change.
- The visitor loses a way to change their cookie choice.

## Approaches

- **A. A separate layout for `/musei` (chosen).** Move the Isagog `Header` and
  `Footer` out of the root `[locale]/layout.tsx` into a new
  `[locale]/(pages)/layout.tsx`, and move the musei route into its own group,
  `[locale]/(musei)/musei/`, with a layout holding the museum header and
  footer. Fonts, colours, i18n, the cookie banner, analytics and the contact
  form stay shared in the root layout. Costs a one-off reshuffle of where the
  header and footer attach. Changes to the Isagog menu can't reach the museum
  page later.
- **B. Hide the Isagog header and footer on `/musei`.** Both components check
  the path and render nothing there. Smallest diff, but the museum chrome ends
  up tangled with the Isagog components, and every future change to them has
  to remember the exception. Rejected.
- **C. A separate repository published at `isagog.com/musei`.** It would
  duplicate the design, consent banner, form and translations into a second
  deploy for one page. Rejected.

## Design

### Header (fixed, same 72px height as the Isagog header)

```
[isagog]  per i musei      Chi è Isagog →   [Chiedete una demo]   IT/EN
```

- **Logo + "per i musei" tag:** scrolls back to the top of the museum page.
  It does not leave the page.
- **"Chi è Isagog →" / "About Isagog →":** goes to the main site home in the
  same language (`/it/`, `/en/`), same tab.
- **"Chiedete una demo" / "Book a demo":** jumps to the form at `#call`.
- **Language switch:** the existing `LanguageSelector`, which already maps
  `/it/musei/` to `/en/musei/` and back.
- **Phones:** logo, "Chi è Isagog" and the language switch. The demo button is
  dropped there, because the hero already shows it in the first screen.

### Footer

```
© 2026 Isagog — address      isagog.com   info@isagog.com   Preferenze privacy
```

- Same copyright line and address as the Isagog footer (reuse the `footer`
  copy keys and the build-time `year`).
- **"isagog.com":** goes to the main site home in the same language.
- **"Preferenze privacy" / "Privacy preferences":** the existing
  `reopenConsent` button.

### Bare /musei

A static stub at `public/musei/index.html`, built like the `/service` stub:
relative paths so it works at the domain root and under a staging base path.
It sends `it-*` browsers to `../it/musei/`, `en-*` browsers to `../en/musei/`,
and everything else to Italian, with a `<noscript>` fallback to Italian.

### Discovery

The page keeps its sitemap entry (already in the draft) and stays out of the
main site's navigation.

## Calls made by Claude (open to correction)

- The logo stays on the museum page. Leaving is the job of the "Chi è Isagog"
  link.
- Main-site links open in the same tab and language.
- The bare `/musei` follows the browser language, falling back to Italian.
  The user asked for the page "in the required language". This differs from
  the main home page, which always starts in Italian.
- The demo button is hidden from the header on phones.

## Left to the builder

- Header and footer styling, within the existing tokens and the Isagog
  header's look.
- New copy keys for the museum header and footer in both `it.ts` and `en.ts`,
  which must stay structurally identical (`parity.test.ts`).
- Tests: the `/musei` stub's redirect (same pattern as
  `ontology-iri-stubs.test.ts`), any extracted link logic, and adding `musei`
  to `scripts/check-export.mjs` (both locales and the stub).
