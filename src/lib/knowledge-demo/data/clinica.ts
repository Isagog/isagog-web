/**
 * CLINICA tab — refusal.
 *
 * Real (synthetic, pseudonymised) graph data. Every className, polarity,
 * label, quote, document reference and line number below is verbatim from
 * src/lib/knowledge-demo/ontology-excerpts/onco-excerpt.ttl, checked by
 * ontology-verification.test.ts. Nothing here is invented.
 *
 * Lead question: "È allergico alla penicillina?" answered four different
 * honest ways across three letters over seven months — Reported (never
 * tested), then still Reported and steering treatment, then RuledOut
 * (de-labelled), with a Negated allergological test alongside. Q2 (BCL2) is
 * a plain Asserted fact for contrast. Q3 (bone involvement) is Suspected,
 * held open rather than collapsed.
 */
import type { OntologyTerm } from "../types";

export type ClinicaPolarity = "Asserted" | "Reported" | "Negated" | "RuledOut" | "Suspected";

export interface ClinicaDocument {
  readonly id: "L1" | "L2" | "L3";
  /** Verbatim rdfs:label of the document, e.g. "Lettera 1 — feb 2025 — diagnosi". */
  readonly label: string;
  /** Verbatim onco:docDate. */
  readonly date: string;
}

export interface ClinicaStatement {
  readonly id: string;
  /** Verbatim onco: class name(s), e.g. "AllergyStatement". */
  readonly className: OntologyTerm;
  /** Verbatim rdfs:label of the statement. */
  readonly label: string;
  /** Verbatim onco:polarity local name. */
  readonly polarity: ClinicaPolarity;
  /** Verbatim onco:sourceQuote (Italian; ** marks the source's own emphasis). */
  readonly quote: string;
  readonly docId: ClinicaDocument["id"];
  readonly lineStart: number;
  readonly lineEnd: number;
  /** Locale key for a short explanatory caption I wrote about this row. */
  readonly noteKey?: string;
}

export interface ClinicaQuestion {
  readonly id: string;
  readonly questionKey: string;
  readonly kind: "epistemic-thread" | "asserted" | "suspected";
  /** Ordered statement ids making up this question's evidence thread. */
  readonly statementIds: readonly string[];
  readonly answerKey: string;
}

export const clinicaTabLabelKey = "knowledgeDemo.clinica.tabLabel";
export const clinicaDisclosureKey = "knowledgeDemo.clinica.disclosure";

export const clinicaDocuments: readonly ClinicaDocument[] = [
  { id: "L1", label: "Lettera 1 — feb 2025 — diagnosi", date: "2025-02-14" },
  { id: "L2", label: "Lettera 2 — apr 2025 — neutropenia febbrile", date: "2025-04-11" },
  { id: "L3", label: "Lettera 3 — set 2025 — rivalutazione", date: "2025-09-22" },
];

export const clinicaStatements: readonly ClinicaStatement[] = [
  {
    id: "a-L1-penicillina",
    className: "AllergyStatement",
    label: "Reazione cutanea a penicillina in età pediatrica, riferita",
    polarity: "Reported",
    quote:
      "Riferita dal paziente reazione cutanea a **penicillina** in età pediatrica; episodio non documentato",
    docId: "L1",
    lineStart: 22,
    lineEnd: 22,
    noteKey: "knowledgeDemo.clinica.notes.reportedPediatric",
  },
  {
    id: "p-L1-test-allergologico",
    className: "ProcedureStatement",
    label: "Test allergologico mai eseguito",
    polarity: "Negated",
    quote: "mai sottoposto a test allergologico",
    docId: "L1",
    lineStart: 22,
    lineEnd: 22,
    noteKey: "knowledgeDemo.clinica.notes.neverTested",
  },
  {
    id: "a-L2-allergia-penicillina",
    className: "AllergyStatement",
    label: "Allergia riferita a penicillina",
    polarity: "Reported",
    quote: "In considerazione dell'**allergia riferita a penicillina**",
    docId: "L2",
    lineStart: 41,
    lineEnd: 41,
    noteKey: "knowledgeDemo.clinica.notes.steeringTreatment",
  },
  {
    id: "s-L3-allergia-penicillina",
    className: "AllergyStatement",
    label: "Allergia a penicillina esclusa (de-labellazione)",
    polarity: "RuledOut",
    quote:
      "Il paziente è stato **de-labellato**: può assumere beta-lattamici penicillinici. La segnalazione di allergia riportata nelle precedenti lettere di dimissione è pertanto da considerarsi **superata**.",
    docId: "L3",
    lineStart: 44,
    lineEnd: 44,
    noteKey: "knowledgeDemo.clinica.notes.deLabelled",
  },
  {
    id: "b-L1-bcl2",
    className: "BiomarkerStatement",
    label: "BCL2 positivo",
    polarity: "Asserted",
    quote: "BCL2+",
    docId: "L1",
    lineStart: 51,
    lineEnd: 51,
    noteKey: "knowledgeDemo.clinica.notes.bcl2",
  },
  {
    id: "s-L3-localizzazione-ossea-dim",
    className: "ConditionStatement",
    label: "Sospetta localizzazione ossea all'omero destro, in attesa di conferma istologica",
    polarity: "Suspected",
    quote: "**Sospetta** localizzazione ossea all'omero destro, in attesa di conferma istologica.",
    docId: "L3",
    lineStart: 52,
    lineEnd: 52,
    noteKey: "knowledgeDemo.clinica.notes.boneSuspected",
  },
];

export const clinicaQuestions: readonly ClinicaQuestion[] = [
  {
    id: "penicillin-allergy",
    questionKey: "knowledgeDemo.clinica.questions.allergy.question",
    kind: "epistemic-thread",
    statementIds: [
      "a-L1-penicillina",
      "p-L1-test-allergologico",
      "a-L2-allergia-penicillina",
      "s-L3-allergia-penicillina",
    ],
    answerKey: "knowledgeDemo.clinica.questions.allergy.answer",
  },
  {
    id: "bcl2",
    questionKey: "knowledgeDemo.clinica.questions.bcl2.question",
    kind: "asserted",
    statementIds: ["b-L1-bcl2"],
    answerKey: "knowledgeDemo.clinica.questions.bcl2.answer",
  },
  {
    id: "bone-involvement",
    questionKey: "knowledgeDemo.clinica.questions.bone.question",
    kind: "suspected",
    statementIds: ["s-L3-localizzazione-ossea-dim"],
    answerKey: "knowledgeDemo.clinica.questions.bone.answer",
  },
];
