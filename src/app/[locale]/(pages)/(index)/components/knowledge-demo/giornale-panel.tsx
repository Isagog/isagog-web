import { CircleAlert } from "lucide-react";
import type { GiornaleQuestion } from "@/lib/knowledge-demo/data/giornale";
import type { HomeT } from "./i18n";
import { tr } from "./i18n";
import { TermBadge } from "./graph-primitives";
import { TraceDetails } from "./trace-details";

interface GiornalePanelProps {
  readonly question: GiornaleQuestion;
  readonly t: HomeT;
}

/**
 * One archive entity, several facts, each tagged with its descriptor class
 * and the descriptor's own rdfs:comment as its "standing" — the same
 * answer contains claims of visibly different provenance.
 */
export const GiornalePanel = ({ question, t }: GiornalePanelProps) => (
  <div className="flex flex-col gap-4">
    <p className="font-serif text-[19px] leading-snug text-forest">{tr(t, question.questionKey)}</p>
    <p className="rounded-[5px] bg-paper px-4 py-3 text-[16px] leading-relaxed text-forest">{tr(t, question.answerKey)}</p>

    <div className="rounded-[5px] bg-forest px-4 py-2.5 text-[14px] text-cream">
      {tr(t, question.entityLabelKey)}
    </div>

    <ul className="flex flex-col divide-y divide-card-border">
      {question.facts.map((fact) => (
        <li key={fact.id} className="py-3 first:pt-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[14.5px] text-forest">{tr(t, fact.textKey)}</p>
            <TermBadge>{fact.descriptorClassName}</TermBadge>
          </div>
        </li>
      ))}
    </ul>

    {question.kind === "refusal" && (
      <div className="flex items-start gap-2 rounded-[5px] bg-tecnologia px-3.5 py-3 text-[13px] text-forest">
        <CircleAlert size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
        <span>{t("knowledgeDemo.refusalCaption")}.</span>
      </div>
    )}
    <TraceDetails key={question.id} label={t("knowledgeDemo.giornale.traceLabel")}>
      <ul className="flex flex-col gap-4">
        {question.facts.map((fact) => (
          <li key={fact.id}>
            <TermBadge>{fact.descriptorClassName}</TermBadge>
            <p className="mt-2 text-[14px] italic leading-relaxed text-prose-muted">&ldquo;{fact.standingQuote}&rdquo;</p>
          </li>
        ))}
      </ul>
      <p className="text-[12px] leading-relaxed text-prose-muted">{t("knowledgeDemo.giornale.disclosure")}</p>
    </TraceDetails>
  </div>
);
