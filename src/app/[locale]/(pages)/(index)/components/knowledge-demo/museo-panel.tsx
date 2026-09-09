import { Check, Minus } from "lucide-react";
import type { MuseoQuestion, MuseoStep, MuseoResult, MuseoAxiom } from "@/lib/knowledge-demo/data/museo";
import type { HomeT } from "./i18n";
import { tr } from "./i18n";
import { QuoteBlock, TermBadge } from "./graph-primitives";

interface MuseoPanelProps {
  readonly question: MuseoQuestion;
  readonly t: HomeT;
}

/**
 * One question in Italian, resolved into the steps that answer it: the
 * conditions evaluated on the graph, then what the system derives from the
 * ontology instead of reading. Results carry the class of each instance;
 * the axioms below carry the ontology's own words for the inference the
 * answer turns on.
 */
export const MuseoPanel = ({ question, t }: MuseoPanelProps) => (
  <div className="flex flex-col gap-5">
    <p className="font-serif text-[19px] leading-snug text-forest">{tr(t, question.questionKey)}</p>

    <section>
      <h4 className="text-[10.5px] uppercase tracking-[0.08em] text-sage">
        {t("knowledgeDemo.museo.resolutionLabel")}
      </h4>
      <ol className="mt-2 flex flex-col gap-2">
        {question.steps.map((step, index) => (
          <StepRow key={step.id} step={step} index={index + 1} t={t} />
        ))}
      </ol>
    </section>

    <section>
      <h4 className="text-[10.5px] uppercase tracking-[0.08em] text-sage">
        {t("knowledgeDemo.museo.resultsLabel")}
      </h4>
      <ul className="mt-2 flex flex-col gap-1.5">
        {question.results.map((result) => (
          <ResultRow key={result.id} result={result} t={t} />
        ))}
      </ul>
    </section>

    <section>
      <h4 className="text-[10.5px] uppercase tracking-[0.08em] text-sage">
        {t("knowledgeDemo.museo.axiomsLabel")}
      </h4>
      <ul className="mt-2 flex flex-col gap-3">
        {question.axioms.map((axiom) => (
          <AxiomRow key={axiom.id} axiom={axiom} t={t} />
        ))}
      </ul>
    </section>

    <div>
      <p className="text-[14px] font-medium leading-snug text-forest">{tr(t, question.answerKey)}</p>
      <p className="mt-2 text-[13px] leading-snug text-prose-muted">{tr(t, question.noteKey)}</p>
    </div>
  </div>
);

interface StepRowProps {
  readonly step: MuseoStep;
  readonly index: number;
  readonly t: HomeT;
}

const StepRow = ({ step, index, t }: StepRowProps) => (
  <li className="flex gap-3">
    <span
      className={
        step.source === "graph"
          ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-medium text-cream"
          : "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-[11px] font-medium text-cream"
      }
      aria-hidden="true"
    >
      {index}
    </span>
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.08em] text-sage">
        {step.source === "graph"
          ? t("knowledgeDemo.museo.graphStepLabel")
          : t("knowledgeDemo.museo.inferenceStepLabel")}
      </span>
      <p className="text-[14px] leading-snug text-forest">{tr(t, step.labelKey)}</p>
      <span className="flex flex-wrap gap-1.5">
        {step.terms.map((term) => (
          <TermBadge key={term}>{term}</TermBadge>
        ))}
      </span>
    </div>
  </li>
);

interface ResultRowProps {
  readonly result: MuseoResult;
  readonly t: HomeT;
}

const ResultRow = ({ result, t }: ResultRowProps) => {
  const matched = result.kind === "match";
  const Icon = matched ? Check : Minus;

  return (
    <li
      className={
        matched
          ? "flex items-start gap-2.5 rounded-[5px] border border-card-border bg-paper px-3.5 py-2.5"
          : "flex items-start gap-2.5 rounded-[5px] border border-dashed border-card-border px-3.5 py-2.5"
      }
    >
      <Icon
        size={15}
        strokeWidth={2.5}
        className={matched ? "mt-1 shrink-0 text-forest" : "mt-1 shrink-0 text-prose-muted"}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <strong
            className={
              matched
                ? "font-serif text-[15.5px] font-normal leading-tight text-forest"
                : "font-serif text-[15.5px] font-normal leading-tight text-prose-muted"
            }
          >
            {tr(t, result.labelKey)}
          </strong>
          <TermBadge>{result.className}</TermBadge>
        </span>
        <span className="text-[12.5px] leading-snug text-prose-muted">{tr(t, result.detailKey)}</span>
      </div>
    </li>
  );
};

interface AxiomRowProps {
  readonly axiom: MuseoAxiom;
  readonly t: HomeT;
}

const AxiomRow = ({ axiom, t }: AxiomRowProps) => (
  <li className="border-l border-card-border pl-3.5">
    <span className="flex flex-wrap gap-1.5">
      {axiom.terms.map((term) => (
        <TermBadge key={term}>{term}</TermBadge>
      ))}
    </span>
    <div className="mt-1.5">
      <QuoteBlock quote={axiom.quote} />
    </div>
    <p className="mt-1 text-[12.5px] leading-snug text-forest/80">{tr(t, axiom.glossKey)}</p>
  </li>
);
