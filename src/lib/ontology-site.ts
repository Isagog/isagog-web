import type { Locale } from "./locale-href";

/**
 * The ontology minisite: a separate static site (repo Isagog/isagog-ontology,
 * GitHub Pages with a custom domain) that shares this site's header, footer
 * and design tokens. Linked from the Insights page (/blog); the ontology IRIs under
 * /ontology/ on this site forward to it (see public/ontology/).
 */
export const ONTOLOGY_SITE_URL = "https://ontology.isagog.com";

/** Home of the minisite in the given locale, e.g. "https://ontology.isagog.com/en/". */
export function ontologySiteUrl(locale: Locale): string {
  return `${ONTOLOGY_SITE_URL}/${locale}/`;
}
