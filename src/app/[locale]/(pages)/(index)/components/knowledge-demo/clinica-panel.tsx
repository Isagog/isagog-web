import {
  clinicaDocuments,
  clinicaStatements,
  type ClinicaPolarity,
  type ClinicaQuestion,
} from "@/lib/knowledge-demo/data/clinica";
import type { HomeT } from "./i18n";
import { tr } from "./i18n";
import { QuoteBlock, TermBadge } from "./graph-primitives";

interface ClinicaPanelProps {
  readonly question: ClinicaQuestion;
  readonly t: HomeT;
}

const polarityKey = (polarity: ClinicaPolarity) =>
  `knowledgeDemo.clinica.polarityGloss.${polarity}` as const;

/**
 * Real graph data: an ordered evidence thread, each statement carrying its
 * document, line range, polarity and verbatim source quote — the "sa dire
 * come lo sa" claim made visible, row by row.
 */
export const ClinicaPanel = ({ question, t }: ClinicaPanelProps) => {
  const lineLabel = t("knowledgeDemo.lineLabel");

  return (
    <div className="flex flex-col gap-4">
      <p className="font-serif text-[19px] leading-snug text-forest">{tr(t, question.questionKey)}</p>

      <ol className="flex flex-col gap-3">
        {question.statementIds.map((statementId) => {
          const statement = clinicaStatements.find((s) => s.id === statementId);
          if (statement === undefined) return null;
          const doc = clinicaDocuments.find((d) => d.id === statement.docId);

          return (
            <li key={statement.id} className="rounded-[5px] border border-card-border bg-paper px-4 py-3">
              <div className="flex flex-wrap items-center gap-2 text-[11.5px] uppercase tracking-[0.06em] text-num">
                <span>{doc?.date}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {doc?.id} ({lineLabel} {statement.lineStart}
                  {statement.lineEnd !== statement.lineStart ? `–${statement.lineEnd}` : ""})
                </span>
                <TermBadge>{statement.className}</TermBadge>
                <TermBadge>{statement.polarity}</TermBadge>
              </div>

              <p className="mt-1.5 text-[13px] text-forest/70">{tr(t, polarityKey(statement.polarity))}</p>

              <div className="mt-2">
                <QuoteBlock quote={statement.quote} />
              </div>

              {statement.noteKey !== undefined && (
                <p className="mt-1.5 text-[12.5px] text-prose-muted">{tr(t, statement.noteKey)}</p>
              )}
            </li>
          );
        })}
      </ol>

      <p className="text-[14px] font-medium leading-snug text-forest">{tr(t, question.answerKey)}</p>
    </div>
  );
};
