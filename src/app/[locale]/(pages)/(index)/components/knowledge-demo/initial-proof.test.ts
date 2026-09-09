import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import itLocale from "@/packages/locales/lang/it";
import { museoQuestions } from "@/lib/knowledge-demo/data/museo";
import { clinicaQuestions, clinicaStatements } from "@/lib/knowledge-demo/data/clinica";
import { KnowledgeDemo } from "./knowledge-demo";
import { MuseoPanel } from "./museo-panel";
import { ClinicaPanel } from "./clinica-panel";
import type { HomeT } from "./i18n";

function translate(key: string): string {
  let value: unknown = itLocale.home;
  for (const segment of key.split(".")) {
    value = (value as Record<string, unknown>)[segment];
  }
  if (typeof value !== "string") throw new Error(`Missing homepage copy: ${key}`);
  return value;
}

vi.mock("@/packages/locales/client", () => ({
  useScopedI18n: () => translate,
  useCurrentLocale: () => "it",
}));

const t = translate as HomeT;
const text = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

describe("the demo before interaction or hydration", () => {
  it("opens on museum inference and also exposes a sourced negative statement", () => {
    const html = renderToStaticMarkup(createElement(KnowledgeDemo));
    expect(html).toContain('id="knowledge-demo-tab-museo" aria-selected="true"');
    const negativeSection = html.split('aria-labelledby="negative-knowledge-title"')[1]?.split("</section>")[0];
    expect(negativeSection).toBeDefined();
    expect(text(negativeSection!)).toContain("mai sottoposto a test allergologico");
    expect(text(negativeSection!)).toContain("Negated");
    expect(text(negativeSection!)).toContain("riga 22");
    expect(text(negativeSection!)).toContain("l'assenza di un dato non dimostra il contrario");
    expect(negativeSection).not.toMatch(/<details|\bhidden=/);
    expect(html).not.toMatch(/<details[^>]*\bopen(?:=|\s|>)/);
  });

  for (const question of museoQuestions) {
    it(`keeps the answer and the proof visible for ${question.id}`, () => {
      const html = renderToStaticMarkup(createElement(MuseoPanel, { question, t }));
      const beforeDisclosure = text(html.split("<details")[0]!);
      for (const key of [question.answerKey, question.proof.factKey, question.proof.ruleKey, question.proof.conclusionKey]) {
        expect(beforeDisclosure).toContain(translate(key));
      }
      expect(html).toContain("<details");
      expect(html).not.toMatch(/<details[^>]*\bopen(?:=|\s|>)/);
    });
  }

  it("keeps clinical negation and explicit supersession outside the full quotations", () => {
    const question = clinicaQuestions.find((q) => q.id === "penicillin-allergy")!;
    const html = renderToStaticMarkup(createElement(ClinicaPanel, { question, t }));
    const beforeDisclosure = text(html.split("<details")[0]!);
    expect(beforeDisclosure).toContain("Negated");
    expect(beforeDisclosure).toContain("RuledOut");
    expect(beforeDisclosure).toContain("supersedes");
    expect(beforeDisclosure).toContain("Un fatto mancante resta ignoto");
    for (const id of question.statementIds) {
      expect(beforeDisclosure).toContain(clinicaStatements.find((s) => s.id === id)!.label);
    }
    expect(text(html)).toContain("La segnalazione di allergia riportata nelle precedenti lettere");
  });
});
