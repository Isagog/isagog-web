import type { Locale } from "./locale-href";
import { ontologySiteUrl } from "./ontology-site";

/**
 * Concept links in copy. The site's copy links its key concepts (ontology,
 * knowledge graph, conceptual model) to the ontology minisite pages that
 * explain them, with an inline markup the copy carries itself:
 *
 *   "… l'[ontologia](onto:) esplicita le regole …"
 *   "… il [grafo di conoscenza](onto:reasoning) porta la struttura …"
 *
 * `onto:` is the minisite home, `onto:<page>` one of its pages; the locale
 * comes from the page rendering the copy. Render such strings with
 * <ConceptText>: check-export fails the build if the markup reaches a page
 * unrendered. Convention: link a concept at its first mention on a page.
 */
export const CONCEPT_PAGES = ["", "perspectives", "layers", "reasoning", "explorer"] as const;
export type ConceptPage = (typeof CONCEPT_PAGES)[number];

export type CopySegment = string | { label: string; href: string };

const CONCEPT_LINK = /\[([^\]]+)\]\(onto:([a-z]*)\)/g;

const isConceptPage = (page: string): page is ConceptPage =>
  (CONCEPT_PAGES as readonly string[]).includes(page);

/** URL of a minisite page, e.g. conceptHref("en", "reasoning") → ".../en/reasoning/". */
export function conceptHref(locale: Locale, page: ConceptPage): string {
  return page === "" ? ontologySiteUrl(locale) : `${ontologySiteUrl(locale)}${page}/`;
}

/** Split copy into plain text and links. Throws on a page the minisite does not have. */
export function parseConceptLinks(text: string, locale: Locale): CopySegment[] {
  const segments: CopySegment[] = [];
  let last = 0;
  for (const match of text.matchAll(CONCEPT_LINK)) {
    // Both groups always participate in a match; the defaults only satisfy the type checker.
    const [whole, label = "", page = ""] = match;
    if (!isConceptPage(page)) throw new Error(`concept link to unknown minisite page "onto:${page}" in: ${text}`);
    if (match.index > last) segments.push(text.slice(last, match.index));
    segments.push({ label, href: conceptHref(locale, page) });
    last = match.index + whole.length;
  }
  if (last < text.length) segments.push(text.slice(last));
  return segments;
}
