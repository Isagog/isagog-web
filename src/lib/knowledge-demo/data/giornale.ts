/**
 * GIORNALE tab — provenance.
 *
 * The entity, its facts and their illustrative values are invented — MeMa's
 * ontology has no instance data (see the design spec). The descriptor
 * classes, the property names, and every "standingQuote" below are verbatim
 * from src/lib/knowledge-demo/ontology-excerpts/mema-excerpt.ttl (each
 * standingQuote is the class's own rdfs:comment), checked by
 * ontology-verification.test.ts.
 *
 * Claim: every fact carries where it came from, and they are not equal. One
 * archive query returns facts tagged by four different descriptor classes;
 * the refusal question shows a fact backed only by an AIDescriptor, with no
 * human or external corroboration, held as unconfirmed rather than
 * asserted — an illustrative use of the schema, not an ontology axiom.
 */
import type { OntologyTerm } from "../types";

export interface GiornaleFact {
  readonly id: string;
  /** Locale key for the illustrative fact text. */
  readonly textKey: string;
  /** Verbatim MeMa descriptor class name, e.g. "HumanDescriptor". */
  readonly descriptorClassName: OntologyTerm;
  /** Verbatim rdfs:comment (Italian) of that descriptor class. */
  readonly standingQuote: string;
}

export interface GiornaleQuestion {
  readonly id: string;
  readonly questionKey: string;
  readonly kind: "provenance" | "refusal";
  readonly entityLabelKey: string;
  readonly facts: readonly GiornaleFact[];
  readonly answerKey: string;
}

export const giornaleTabLabelKey = "knowledgeDemo.giornale.tabLabel";
export const giornaleDisclosureKey = "knowledgeDemo.giornale.disclosure";

export const giornaleQuestions: readonly GiornaleQuestion[] = [
  {
    id: "archive-query",
    questionKey: "knowledgeDemo.giornale.questions.archive.question",
    kind: "provenance",
    entityLabelKey: "knowledgeDemo.giornale.entity",
    facts: [
      {
        id: "fact-human",
        textKey: "knowledgeDemo.giornale.questions.archive.facts.human",
        descriptorClassName: "HumanDescriptor",
        standingQuote: "Descrittore di entità creato da annotatori umani",
      },
      {
        id: "fact-ai",
        textKey: "knowledgeDemo.giornale.questions.archive.facts.ai",
        descriptorClassName: "AIDescriptor",
        standingQuote: "Descrittore di entità generato da sistemi di IA",
      },
      {
        id: "fact-dbpedia",
        textKey: "knowledgeDemo.giornale.questions.archive.facts.dbpedia",
        descriptorClassName: "DBPediaDescriptor",
        standingQuote: "Descrittore di entità che riferisce risorse DBpedia",
      },
      {
        id: "fact-wikipedia",
        textKey: "knowledgeDemo.giornale.questions.archive.facts.wikipedia",
        descriptorClassName: "WikipediaDescriptor",
        standingQuote: "Descrittore di entità che riferisce articoli Wikipedia",
      },
      {
        id: "fact-contextual",
        textKey: "knowledgeDemo.giornale.questions.archive.facts.contextual",
        descriptorClassName: "ContextualDescriptor",
        standingQuote:
          "Descrizione di un'entità indicizzata temporalmente, così come caratterizzata al momento di una specifica menzione",
      },
    ],
    answerKey: "knowledgeDemo.giornale.questions.archive.answer",
  },
  {
    id: "unconfirmed-fact",
    questionKey: "knowledgeDemo.giornale.questions.refusal.question",
    kind: "refusal",
    entityLabelKey: "knowledgeDemo.giornale.entity",
    facts: [
      {
        id: "fact-ai-only",
        textKey: "knowledgeDemo.giornale.questions.refusal.facts.aiOnly",
        descriptorClassName: "AIDescriptor",
        standingQuote: "Descrittore di entità generato da sistemi di IA",
      },
    ],
    answerKey: "knowledgeDemo.giornale.questions.refusal.answer",
  },
];
