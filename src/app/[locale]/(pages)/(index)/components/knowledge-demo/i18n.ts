import type { ReactNode } from "react";
import type { useScopedI18n } from "@/packages/locales/client";

/**
 * The `t` function returned by `useScopedI18n("home")`, scoped once at the
 * top of the demo and threaded down to every panel — every locale key the
 * data modules reference (e.g. "knowledgeDemo.clinica.questions.bcl2.question")
 * is relative to "home".
 */
export type HomeT = ReturnType<typeof useScopedI18n<"home">>;

/** The literal key-union `HomeT` accepts as its first argument. */
export type HomeKey = Parameters<HomeT>[0];

/**
 * Resolves a locale key that a data module stored as a plain `string` (see
 * src/lib/knowledge-demo/types.ts — structure lives in typed data modules,
 * copy lives in locale files, and the two are joined by these string keys).
 * next-international types `t()`'s argument as a literal union derived from
 * the locale file, which a plain `string` cannot satisfy statically; this
 * is the single, intentional cast point for that join. Key validity is
 * enforced by convention and by src/packages/locales/lang/parity.test.ts,
 * not by the type system.
 */
export const tr = (t: HomeT, key: string): ReactNode => t(key as HomeKey);
