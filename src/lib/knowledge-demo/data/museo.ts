/**
 * MUSEO tab — from a question in Italian to a query on the knowledge graph,
 * and to what the graph alone does not say.
 *
 * Each question is resolved into an ordered list of steps. A step is either
 * a condition evaluated on the graph (`source: "graph"`) or something the
 * system derives from the ontology rather than reads from a stored fact
 * (`source: "inference"`). The distinction is the whole point of the tab:
 * the answer is not retrieved, it is composed, and the composition can be
 * shown step by step.
 *
 * Three questions, three different reasons why an answer is not a lookup:
 *
 * 1. `conjunctive-exhibition` — a visitor's question with four conditions at
 *    once (exhibition, works exhibited in it, their authors, the authors'
 *    nationality and birth date). The works returned are instances of
 *    `Painting` and `VideoArtwork`, never queried by name: they arrive
 *    through class subsumption under `Artwork`. And a work by a `Collective`
 *    does not match the query's positive Artist condition. This absence of
 *    a type assertion or entailment is not an inferred negative assertion.
 *
 * 2. `installation-requirements` — a question from whoever installs the
 *    show. Class subsumption is formal inference; equipment suggestions
 *    interpret the class descriptions and require verification. The schema
 *    does not contain OWL axioms imposing those equipment requirements.
 *
 * 3. `where-is-artwork` — orientation in the building. An artwork carries no
 *    location of its own; the system composes one by walking to the
 *    exhibition that displays it, and to the hall that exhibition is in.
 *    `ig:adjacent_to` is declared `owl:SymmetricProperty`, so one recorded
 *    adjacency answers in both directions.
 *
 * Every className, propertyName and quote below is verbatim from
 * ../ontology-excerpts/maxxi-excerpt.ttl or ../ontology-excerpts/isagog-top-excerpt.ttl,
 * checked by ontology-verification.test.ts. The instances (the exhibition,
 * the works, the artists, the halls) are illustrative: MAXXI's ontology
 * ships no instance data. See docs/superpowers/specs/2026-09-09-knowledge-demo-design.md.
 */
import type { OntologyTerm } from "../types";

/** Whether a step reads the graph or derives something the graph does not store. */
export type MuseoStepSource = "graph" | "inference";

export interface MuseoStep {
  readonly id: string;
  readonly source: MuseoStepSource;
  /** Locale key for this step in plain Italian. */
  readonly labelKey: string;
  /** Verbatim ontology terms the step uses, rendered as badges. */
  readonly terms: readonly OntologyTerm[];
}

/** Whether a candidate ends up in the answer or is ruled out, and why. */
export type MuseoResultKind = "match" | "excluded";

export interface MuseoResult {
  readonly id: string;
  readonly kind: MuseoResultKind;
  /** Verbatim class of the instance, e.g. "Painting". */
  readonly className: OntologyTerm;
  /** Locale key for the illustrative instance label. */
  readonly labelKey: string;
  /** Locale key for a second line — the author, the floor, the reason it was excluded. */
  readonly detailKey: string;
}

/**
 * The ontology basis for an explanation. `quote` is a verbatim rdfs:comment,
 * an annotation rather than a logical axiom. The gloss distinguishes the
 * formal class/property axioms from interpretations of these descriptions.
 */
export interface MuseoAxiom {
  readonly id: string;
  readonly terms: readonly OntologyTerm[];
  readonly quote: string;
  /** Locale key explaining what that axiom licenses here. */
  readonly glossKey: string;
}

export interface MuseoQuestion {
  readonly id: string;
  readonly questionKey: string;
  /**
   * Locale key for the short label in the question picker — these questions
   * are a sentence long each, and three of them as pill buttons crowd out
   * the answer they are meant to introduce. Names the asker, not the query.
   */
  readonly pickerLabelKey: string;
  /** The fact, ontology basis and conclusion stay visible when the trace is closed. */
  readonly proof: {
    readonly factKey: string;
    readonly ruleKey: string;
    readonly conclusionKey: string;
    readonly terms: readonly OntologyTerm[];
  };
  readonly steps: readonly MuseoStep[];
  readonly results: readonly MuseoResult[];
  readonly axioms: readonly MuseoAxiom[];
  readonly answerKey: string;
  /** Locale key for the one line naming what was derived rather than read. */
  readonly noteKey: string;
}

export const museoTabLabelKey = "knowledgeDemo.museo.tabLabel";
export const museoDisclosureKey = "knowledgeDemo.museo.disclosure";

const nodeKey = (name: string): string => `knowledgeDemo.museo.nodes.${name}`;
const stepKey = (question: string, name: string): string =>
  `knowledgeDemo.museo.questions.${question}.steps.${name}`;
const glossKey = (question: string, name: string): string =>
  `knowledgeDemo.museo.questions.${question}.axioms.${name}`;
const detailKey = (question: string, name: string): string =>
  `knowledgeDemo.museo.questions.${question}.details.${name}`;
const proof = (question: string, terms: readonly OntologyTerm[]): MuseoQuestion["proof"] => ({
  factKey: `knowledgeDemo.museo.questions.${question}.proof.fact`,
  ruleKey: `knowledgeDemo.museo.questions.${question}.proof.rule`,
  conclusionKey: `knowledgeDemo.museo.questions.${question}.proof.conclusion`,
  terms,
});

export const museoQuestions: readonly MuseoQuestion[] = [
  {
    id: "conjunctive-exhibition",
    questionKey: "knowledgeDemo.museo.questions.conjunctive.question",
    pickerLabelKey: "knowledgeDemo.museo.questions.conjunctive.pickerLabel",
    proof: proof("conjunctive", ["Painting", "VisualArtwork", "MaterialArtwork", "VideoArtwork", "ImmaterialArtwork", "Artwork"]),
    steps: [
      {
        id: "find-exhibition",
        source: "graph",
        labelKey: stepKey("conjunctive", "findExhibition"),
        terms: ["Exhibition", "title"],
      },
      {
        id: "works-in-exhibition",
        source: "graph",
        labelKey: stepKey("conjunctive", "worksInExhibition"),
        terms: ["exhibited_in", "exhibit_artworks"],
      },
      {
        id: "authors",
        source: "graph",
        labelKey: stepKey("conjunctive", "authors"),
        terms: ["authored_by", "Artist"],
      },
      {
        id: "filter-authors",
        source: "graph",
        labelKey: stepKey("conjunctive", "filterAuthors"),
        terms: ["nationality", "birth_date"],
      },
      {
        id: "subsumption",
        source: "inference",
        labelKey: stepKey("conjunctive", "subsumption"),
        terms: ["Artwork", "Painting", "VideoArtwork"],
      },
      {
        id: "collective-out",
        source: "graph",
        labelKey: stepKey("conjunctive", "collectiveOut"),
        terms: ["Artist", "Person", "Collective"],
      },
    ],
    results: [
      {
        id: "rotta-di-terra",
        kind: "match",
        className: "Painting",
        labelKey: nodeKey("rottaDiTerra"),
        detailKey: detailKey("conjunctive", "rottaDiTerra"),
      },
      {
        id: "attraverso",
        kind: "match",
        className: "VideoArtwork",
        labelKey: nodeKey("attraverso"),
        detailKey: detailKey("conjunctive", "attraverso"),
      },
      {
        id: "vele-di-sale",
        kind: "excluded",
        className: "Installation",
        labelKey: nodeKey("veleDiSale"),
        detailKey: detailKey("conjunctive", "veleDiSale"),
      },
      {
        id: "terra-ferma",
        kind: "excluded",
        className: "Painting",
        labelKey: nodeKey("terraFerma"),
        detailKey: detailKey("conjunctive", "terraFerma"),
      },
      {
        id: "senza-titolo",
        kind: "excluded",
        className: "Painting",
        labelKey: nodeKey("senzaTitolo"),
        detailKey: detailKey("conjunctive", "senzaTitolo"),
      },
    ],
    axioms: [
      {
        id: "artwork-union",
        terms: ["Artwork", "Painting", "VideoArtwork"],
        quote: "Opera creativa, che può essere materiale, immateriale o performativa",
        glossKey: glossKey("conjunctive", "artworkUnion"),
      },
      {
        id: "artist-is-person",
        terms: ["Artist", "Person", "Collective"],
        quote: "Un individuo umano",
        glossKey: glossKey("conjunctive", "artistIsPerson"),
      },
    ],
    answerKey: "knowledgeDemo.museo.questions.conjunctive.answer",
    noteKey: "knowledgeDemo.museo.questions.conjunctive.note",
  },
  {
    id: "installation-requirements",
    questionKey: "knowledgeDemo.museo.questions.allestimento.question",
    pickerLabelKey: "knowledgeDemo.museo.questions.allestimento.pickerLabel",
    proof: proof("allestimento", ["Installation", "VideoArtwork", "ImmaterialArtwork"]),
    steps: [
      {
        id: "works-in-exhibition",
        source: "graph",
        labelKey: stepKey("allestimento", "worksInExhibition"),
        terms: ["Exhibition", "exhibit_artworks"],
      },
      {
        id: "classes",
        source: "graph",
        labelKey: stepKey("allestimento", "classes"),
        terms: ["Painting", "Installation", "VideoArtwork"],
      },
      {
        id: "no-such-property",
        source: "inference",
        labelKey: stepKey("allestimento", "noSuchProperty"),
        terms: ["Artwork"],
      },
      {
        id: "from-class-definitions",
        source: "inference",
        labelKey: stepKey("allestimento", "fromClassDefinitions"),
        terms: ["Installation", "ImmaterialArtwork", "MaterialArtwork"],
      },
    ],
    results: [
      {
        id: "vele-di-sale",
        kind: "match",
        className: "Installation",
        labelKey: nodeKey("veleDiSale"),
        detailKey: detailKey("allestimento", "veleDiSale"),
      },
      {
        id: "attraverso",
        kind: "match",
        className: "VideoArtwork",
        labelKey: nodeKey("attraverso"),
        detailKey: detailKey("allestimento", "attraverso"),
      },
      {
        id: "rotta-di-terra",
        kind: "excluded",
        className: "Painting",
        labelKey: nodeKey("rottaDiTerra"),
        detailKey: detailKey("allestimento", "rottaDiTerra"),
      },
    ],
    axioms: [
      {
        id: "installation-occupies-space",
        terms: ["Installation", "MaterialArtwork"],
        quote: "Opera d'arte tridimensionale che occupa uno spazio specifico",
        glossKey: glossKey("allestimento", "installationOccupiesSpace"),
      },
      {
        id: "immaterial-has-no-form",
        terms: ["VideoArtwork", "ImmaterialArtwork"],
        quote: "Un'opera d'arte che non ha forma fisica",
        glossKey: glossKey("allestimento", "immaterialHasNoForm"),
      },
    ],
    answerKey: "knowledgeDemo.museo.questions.allestimento.answer",
    noteKey: "knowledgeDemo.museo.questions.allestimento.note",
  },
  {
    id: "where-is-artwork",
    questionKey: "knowledgeDemo.museo.questions.orientamento.question",
    pickerLabelKey: "knowledgeDemo.museo.questions.orientamento.pickerLabel",
    proof: proof("orientamento", ["adjacent_to"]),
    steps: [
      {
        id: "no-location-on-artwork",
        source: "graph",
        labelKey: stepKey("orientamento", "noLocationOnArtwork"),
        terms: ["Artwork", "located_in"],
      },
      {
        id: "to-exhibition",
        source: "graph",
        labelKey: stepKey("orientamento", "toExhibition"),
        terms: ["exhibited_in", "Exhibition"],
      },
      {
        id: "to-hall",
        source: "graph",
        labelKey: stepKey("orientamento", "toHall"),
        terms: ["located_in", "Hall"],
      },
      {
        id: "hall-in-building",
        source: "graph",
        labelKey: stepKey("orientamento", "hallInBuilding"),
        terms: ["part_of", "ExhibitionSpace", "Building"],
      },
      {
        id: "symmetry",
        source: "inference",
        labelKey: stepKey("orientamento", "symmetry"),
        terms: ["adjacent_to"],
      },
    ],
    results: [
      {
        id: "sala-3",
        kind: "match",
        className: "Hall",
        labelKey: nodeKey("sala3"),
        detailKey: detailKey("orientamento", "sala3"),
      },
      {
        id: "gallerie",
        kind: "match",
        className: "ExhibitionSpace",
        labelKey: nodeKey("gallerie"),
        detailKey: detailKey("orientamento", "gallerie"),
      },
    ],
    axioms: [
      {
        id: "hall-is-a-place",
        terms: ["Hall", "BuldingPart", "Location"],
        quote: "Una sala o stanza in un edificio",
        glossKey: glossKey("orientamento", "hallIsAPlace"),
      },
      {
        id: "adjacency-is-symmetric",
        terms: ["adjacent_to", "Location"],
        quote: "Connessione spaziale",
        glossKey: glossKey("orientamento", "adjacencyIsSymmetric"),
      },
    ],
    answerKey: "knowledgeDemo.museo.questions.orientamento.answer",
    noteKey: "knowledgeDemo.museo.questions.orientamento.note",
  },
];
