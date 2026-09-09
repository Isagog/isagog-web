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
- `src/app/[locale]/(pages)/platform/`, `.../project/`, `.../blog/` — the
  platform page, the project index/case-study pages and the blog index/article
  pages.
- `src/lib/` — shared utilities: `base-path.ts` and `normalise-base-path.mjs`
  (the `NEXT_PUBLIC_BASE_PATH` machinery behind subpath deploys such as this
  staging site), `sections.ts` (the homepage section registry), `mdx.ts` (the
  MDX pipeline for articles and case studies), `contact-mailto.ts` and
  `locale-href.ts`.
- `src/packages/locales/lang/{it,en}.ts` — all user-visible copy. The two files
  must stay structurally identical.
- `content/` — MDX bodies for blog articles and project case studies.
- `public/articles-data/`, `public/projects-data/` — the JSON lists their
  index pages fetch.

Design and decisions: `docs/superpowers/specs/2026-09-08-isagog-site-redesign-design.md`
Implementation plan: `docs/superpowers/plans/2026-09-08-isagog-site-redesign.md`
