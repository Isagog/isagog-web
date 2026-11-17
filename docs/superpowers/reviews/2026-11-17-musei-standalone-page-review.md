# Standalone museum page final review

Reviewed locally on `feat/musei-page`, 2026-11-17. Nothing pushed.

## Independent code review

A fresh reviewer read the full museum branch (`eec8d45..dcb6f66`), the specification and implementation plan, the installed Next.js route-group documentation, and shared routing, consent and contact-form code.

One P2 finding: at 640px, revealing the full logo, museum tag and demo button overflowed the header and hid the language selector. Native Brave inspection confirmed it. The header now keeps its compact layout below 1024px. Its row is explicitly 71px high; with the 1px header border this matches the root layout's 72px offset. The reviewer checked the correction and reported no remaining actionable findings.

## Browser verification

Used native Brave with responsive DevTools against `pnpm dev`, using locked Next.js 16.4.5. The extension browser host was unavailable. Restored the installed dependency tree with `pnpm install --frozen-lockfile`; no dependency files changed.

- Italian and English at 375px and 1280px: museum header fits, compact controls stay visible, main-site menus are absent.
- Additional tablet coverage: Italian at 640px and English at 768px; language selector remains visible after the fix.
- Language switch: Italian museum page opens `/en/musei/`.
- Direct `/it/musei/#call`: target section clears the header on desktop and phone. On phone, the form follows the introductory text in the existing stacked layout.
- Logo: returns from the form section to the page top without leaving the museum route.
- Main-site link: opens `/it/` at the top with the full Isagog header; browser back restores the museum header.
- Privacy preferences: reopens the consent panel after rejection, including at phone width.
- Phone footer: company line, site/email and privacy control wrap within the viewport.
- `/it/approach/`: full Isagog header and footer remain present.

## Checks

- `pnpm test`: 308 tests passed across 23 files.
- `pnpm lint` and `pnpm typecheck`: passed.
- Root and `NEXT_PUBLIC_BASE_PATH=/isagog-web` production builds: passed, including `check-export: ok`.
- Staging museum home links and logo source explicitly checked for the `/isagog-web` prefix.
- Restored the root-domain export after staging verification.

The initial sandbox build could not fetch Google Fonts and cached a Turbopack port-permission error. Clearing `.next` and rebuilding with approved access passed. No build configuration changed. Next.js refreshed the generated AGENTS.md heading.

Browser coverage is Chromium responsive emulation; Safari and physical phones were not tested.

Push remains deferred until Maria has been consulted, as requested.
