import { parseConceptLinks } from "@/lib/concept-links";
import type { Locale } from "@/lib/locale-href";
import { Fragment } from "react";

/**
 * Renders copy that may carry concept links ("[ontologia](onto:)", see
 * lib/concept-links) as text with links to the ontology minisite. No hooks:
 * server components pass the locale from getCurrentLocale(), client ones
 * from useCurrentLocale(). The link inherits the surrounding text colour, so
 * it reads on both the light and the dark sections.
 */
export const ConceptText = ({ text, locale }: { text: string; locale: Locale }) => (
  <>
    {parseConceptLinks(text, locale).map((segment, i) => (
      <Fragment key={i}>
        {typeof segment === "string" ? (
          segment
        ) : (
          <a
            href={segment.href}
            className="underline decoration-current/40 decoration-1 underline-offset-[3px] transition-colors hover:decoration-current"
          >
            {segment.label}
          </a>
        )}
      </Fragment>
    ))}
  </>
);
