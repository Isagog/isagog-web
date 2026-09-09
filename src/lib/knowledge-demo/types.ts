/**
 * Shared shapes for the homepage's three-tab knowledge demo (MUSEO ·
 * GIORNALE · CLINICA). See docs/superpowers/specs/2026-09-09-knowledge-demo-design.md.
 *
 * Split between structure and copy, per that spec:
 * - Ontology-derived identifiers (class names, property names, polarity
 *   values, document ids, line numbers, source quotes) are literal strings
 *   here, verbatim from the vendored excerpts in ./ontology-excerpts. They
 *   are verified against those excerpts by ontology-verification.test.ts.
 * - Everything a human wrote (illustrative instance titles, question text,
 *   captions, disclosures) is a locale key (`*Key` fields) resolved via
 *   src/packages/locales/lang/{it,en}.ts, never a literal in this module.
 */

export type TabId = "museo" | "giornale" | "clinica";

/** How a tab's instance data relates to its ontology. */
export type DataStanding = "illustrative-instances" | "real-data";

export interface TabMeta {
  readonly id: TabId;
  /** Locale key for the tab's button label (e.g. "MUSEO"). */
  readonly labelKey: string;
  readonly standing: DataStanding;
  /** Locale key for the one-line disclosure explaining `standing`. */
  readonly disclosureKey: string;
}

/**
 * A verbatim ontology class or property name as it appears in a vendored
 * excerpt. Rendered as-is (never through a locale key) because it is a
 * technical identifier, not copy, and its exact spelling is what the
 * verification test checks.
 */
export type OntologyTerm = string;
