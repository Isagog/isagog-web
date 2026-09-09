/**
 * MUSEO tab — inference.
 *
 * Instances (artwork, exhibition, documents, technique values) are
 * illustrative — MAXXI's ontology has no instance data (see the design
 * spec). Every className/propertyName string below is a real term from
 * src/lib/knowledge-demo/ontology-excerpts/maxxi-excerpt.ttl, checked by
 * ontology-verification.test.ts.
 *
 * Claim: the answer is derived, not stored. Q1 gathers three different
 * TextualInformation subclasses by inverting about/described_in from the
 * artwork — no stored fact says "these three documents concern this
 * artwork." Q2 groups two artworks that share a technique value. Q3 is a
 * refusal: an artwork with no textual information, where the system does
 * not generalise from its exhibition (no property chains exist in this
 * ontology).
 */
import type { OntologyTerm } from "../types";

export interface MuseoNode {
  readonly id: string;
  /** Verbatim MAXXI class name, e.g. "WallText". */
  readonly className: OntologyTerm;
  /** Locale key for this node's illustrative display label. */
  readonly labelKey: string;
}

export interface MuseoEdge {
  readonly from: string;
  readonly to: string;
  /** Verbatim MAXXI property name, e.g. "described_in". */
  readonly propertyName: OntologyTerm;
}

export interface MuseoQuestion {
  readonly id: string;
  readonly questionKey: string;
  readonly kind: "gather" | "shared-value" | "refusal";
  readonly nodes: readonly MuseoNode[];
  readonly edges: readonly MuseoEdge[];
  /** Property names the traversal follows, shown verbatim as a trail. */
  readonly traversalTerms: readonly OntologyTerm[];
  /** Locale key for the class that unifies the gathered nodes, if any. */
  readonly sharedClassName?: OntologyTerm;
  readonly answerKey: string;
  readonly refusalExplanationKey?: string;
}

export const museoTabLabelKey = "knowledgeDemo.museo.tabLabel";
export const museoDisclosureKey = "knowledgeDemo.museo.disclosure";

export const museoQuestions: readonly MuseoQuestion[] = [
  {
    id: "gather-textual-information",
    questionKey: "knowledgeDemo.museo.questions.gather.question",
    kind: "gather",
    nodes: [
      { id: "artwork-1", className: "Artwork", labelKey: "knowledgeDemo.museo.nodes.artwork1" },
      { id: "wall-text-1", className: "WallText", labelKey: "knowledgeDemo.museo.nodes.wallText1" },
      {
        id: "exhibition-catalogue-1",
        className: "ExhibitionCatalogue",
        labelKey: "knowledgeDemo.museo.nodes.exhibitionCatalogue1",
      },
      {
        id: "curatorial-note-1",
        className: "CuratorialNote",
        labelKey: "knowledgeDemo.museo.nodes.curatorialNote1",
      },
    ],
    edges: [
      { from: "artwork-1", to: "wall-text-1", propertyName: "described_in" },
      { from: "artwork-1", to: "exhibition-catalogue-1", propertyName: "described_in" },
      { from: "artwork-1", to: "curatorial-note-1", propertyName: "described_in" },
    ],
    traversalTerms: ["about", "described_in"],
    sharedClassName: "TextualInformation",
    answerKey: "knowledgeDemo.museo.questions.gather.answer",
  },
  {
    id: "shared-technique",
    questionKey: "knowledgeDemo.museo.questions.technique.question",
    kind: "shared-value",
    nodes: [
      { id: "artwork-1", className: "Artwork", labelKey: "knowledgeDemo.museo.nodes.artwork1" },
      { id: "artwork-2", className: "Artwork", labelKey: "knowledgeDemo.museo.nodes.artwork2" },
      {
        id: "technique-value",
        className: "xsd:string",
        labelKey: "knowledgeDemo.museo.nodes.techniqueValue",
      },
    ],
    edges: [
      { from: "artwork-1", to: "technique-value", propertyName: "technique" },
      { from: "artwork-2", to: "technique-value", propertyName: "technique" },
    ],
    traversalTerms: ["technique"],
    answerKey: "knowledgeDemo.museo.questions.technique.answer",
  },
  {
    id: "no-textual-information",
    questionKey: "knowledgeDemo.museo.questions.refusal.question",
    kind: "refusal",
    nodes: [
      { id: "exhibition-1", className: "Exhibition", labelKey: "knowledgeDemo.museo.nodes.exhibition1" },
      {
        id: "exhibition-catalogue-1",
        className: "ExhibitionCatalogue",
        labelKey: "knowledgeDemo.museo.nodes.exhibitionCatalogue1",
      },
      { id: "artwork-3", className: "Artwork", labelKey: "knowledgeDemo.museo.nodes.artwork3" },
    ],
    edges: [
      { from: "exhibition-1", to: "exhibition-catalogue-1", propertyName: "has_catalogue" },
      { from: "exhibition-1", to: "artwork-3", propertyName: "artworks" },
    ],
    traversalTerms: ["described_in"],
    answerKey: "knowledgeDemo.museo.questions.refusal.answer",
    refusalExplanationKey: "knowledgeDemo.museo.questions.refusal.explanation",
  },
];
