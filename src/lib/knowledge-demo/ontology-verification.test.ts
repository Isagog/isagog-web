import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { museoQuestions } from "./data/museo";
import { giornaleQuestions } from "./data/giornale";
import { clinicaDocuments, clinicaQuestions, clinicaStatements } from "./data/clinica";

/**
 * Guards the one rule this demo lives or dies by: every class name,
 * property name, quoted string, label and line number the demo displays is
 * checked against the vendored ontology excerpt it claims to come from.
 * Without this, the data modules in ./data drift from
 * ./ontology-excerpts/*.ttl and become invented examples wearing real class
 * names — which is exactly what got one earlier proposal for this page
 * withdrawn (see the design spec's "What each source can and cannot
 * support").
 *
 * Deliberately simple string/regex matching against the raw .ttl text, not
 * an RDF parser — the excerpts are a few dozen triples each, vendored only
 * so this test has something to check against.
 */

const excerptsDir = path.join(__dirname, "ontology-excerpts");
const mema = fs.readFileSync(path.join(excerptsDir, "mema-excerpt.ttl"), "utf-8");
const onco = fs.readFileSync(path.join(excerptsDir, "onco-excerpt.ttl"), "utf-8");

/**
 * The MUSEO tab draws on two files, not one: MAXXI's own ontology and the
 * Isagog top-level ontology it `owl:imports`. A museum question that walks
 * `located_in` / `part_of` / `adjacent_to` is using terms the domain
 * ontology never redeclares, so both excerpts count as its source.
 */
const maxxi = [
  fs.readFileSync(path.join(excerptsDir, "maxxi-excerpt.ttl"), "utf-8"),
  fs.readFileSync(path.join(excerptsDir, "isagog-top-excerpt.ttl"), "utf-8"),
].join("\n");

/** True if `needle` occurs in `haystack` as a whole token (not as a substring of a longer identifier). */
const hasTerm = (haystack: string, needle: string): boolean => {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^A-Za-z0-9_])${escaped}([^A-Za-z0-9_]|$)`).test(haystack);
};

/** onco-excerpt.ttl entries are blank-line-separated; return the block whose subject is `kb:{id}`. */
const oncoBlockFor = (id: string): string => {
  const blocks = onco.split(/\n\s*\n/);
  const block = blocks.find((b) => new RegExp(`^kb:${id}\\s+a\\b`).test(b.trim()));
  if (block === undefined) {
    throw new Error(`No onco-excerpt.ttl block found for subject kb:${id}`);
  }
  return block;
};

describe("MUSEO tab against maxxi-excerpt.ttl + isagog-top-excerpt.ttl", () => {
  for (const question of museoQuestions) {
    describe(`question "${question.id}"`, () => {
      it("uses source-backed terms in the always-visible proof", () => {
        for (const term of question.proof.terms) {
          expect(hasTerm(maxxi, term)).toBe(true);
        }
      });
      for (const step of question.steps) {
        for (const term of step.terms) {
          it(`term "${term}" (step ${step.id}) exists in the excerpts`, () => {
            expect(hasTerm(maxxi, term)).toBe(true);
          });
        }
      }

      for (const result of question.results) {
        it(`class "${result.className}" (result ${result.id}) exists in the excerpts`, () => {
          expect(hasTerm(maxxi, result.className)).toBe(true);
        });
      }

      for (const axiom of question.axioms) {
        for (const term of axiom.terms) {
          it(`term "${term}" (axiom ${axiom.id}) exists in the excerpts`, () => {
            expect(hasTerm(maxxi, term)).toBe(true);
          });
        }

        it(`quote for axiom "${axiom.id}" is verbatim in the excerpts`, () => {
          expect(maxxi.includes(axiom.quote)).toBe(true);
        });
      }

      it("resolves at least one step on the graph and at least one by inference", () => {
        const sources = new Set(question.steps.map((step) => step.source));
        expect(sources.has("graph")).toBe(true);
        expect(sources.has("inference")).toBe(true);
      });
    });
  }
});

describe("the default museum proof's subclass chains", () => {
  const relations = [
    ["Painting", "VisualArtwork"],
    ["VisualArtwork", "MaterialArtwork"],
    ["MaterialArtwork", "Artwork"],
    ["VideoArtwork", "ImmaterialArtwork"],
    ["ImmaterialArtwork", "Artwork"],
  ];
  for (const [child, parent] of relations) {
    it(`${child} is declared a subclass of ${parent}`, () => {
      const declaration = maxxi.split(/\n\s*\n/).find((block) => block.trim().startsWith(`:${child} rdf:type`));
      expect(declaration).toMatch(new RegExp(`rdfs:subClassOf[^;]*:${parent}\\b`));
    });
  }
});

describe("GIORNALE tab against mema-excerpt.ttl", () => {
  for (const question of giornaleQuestions) {
    describe(`question "${question.id}"`, () => {
      for (const fact of question.facts) {
        it(`descriptor class "${fact.descriptorClassName}" (${fact.id}) exists in the excerpt`, () => {
          expect(hasTerm(mema, fact.descriptorClassName)).toBe(true);
        });

        it(`standing quote for "${fact.descriptorClassName}" (${fact.id}) is verbatim in the excerpt`, () => {
          expect(mema.includes(fact.standingQuote)).toBe(true);
        });
      }
    });
  }
});

describe("CLINICA tab against onco-excerpt.ttl", () => {
  it("every vendored document is displayed with its verbatim label and date", () => {
    for (const doc of clinicaDocuments) {
      expect(onco.includes(`rdfs:label "${doc.label}"@it`)).toBe(true);
      expect(onco.includes(`onco:docDate "${doc.date}"^^xsd:date`)).toBe(true);
      expect(onco.includes(`onco:docId "${doc.id}"`)).toBe(true);
    }
  });

  for (const statement of clinicaStatements) {
    describe(`statement "${statement.id}"`, () => {
      const block = oncoBlockFor(statement.id);

      it("class name is verbatim in its excerpt block", () => {
        expect(hasTerm(block, statement.className)).toBe(true);
      });

      it("label is verbatim in its excerpt block", () => {
        expect(block.includes(`rdfs:label "${statement.label}"@it`)).toBe(true);
      });

      it("polarity is verbatim in its excerpt block", () => {
        expect(hasTerm(block, `onco:${statement.polarity}`)).toBe(true);
      });

      it("source quote is verbatim in its excerpt block", () => {
        expect(block.includes(`onco:sourceQuote "${statement.quote}"@it`)).toBe(true);
      });

      it("source document matches its excerpt block", () => {
        expect(
          block.includes(
            `onco:sourceDocument <https://isagog.com/kb/paziente-esempio/doc/${statement.docId}>`,
          ),
        ).toBe(true);
      });

      it("line range is verbatim in its excerpt block", () => {
        expect(block.includes(`onco:sourceLineStart ${statement.lineStart}`)).toBe(true);
        expect(block.includes(`onco:sourceLineEnd ${statement.lineEnd}`)).toBe(true);
      });
    });
  }

  it("every question's evidence thread resolves to a known statement", () => {
    const knownIds = new Set(clinicaStatements.map((s) => s.id));
    for (const question of clinicaQuestions) {
      for (const statementId of question.statementIds) {
        expect(knownIds.has(statementId)).toBe(true);
      }
    }
  });

  it("every displayed supersedes edge is explicit in the source statement", () => {
    for (const statement of clinicaStatements) {
      for (const target of statement.supersedes ?? []) {
        expect(clinicaStatements.some((s) => s.id === target)).toBe(true);
        expect(oncoBlockFor(statement.id)).toMatch(new RegExp(`onco:supersedes[^.]*kb:${target}\\b`));
      }
    }
    expect(clinicaStatements.find((s) => s.id === "s-L3-allergia-penicillina")?.supersedes).toHaveLength(2);
  });
});
