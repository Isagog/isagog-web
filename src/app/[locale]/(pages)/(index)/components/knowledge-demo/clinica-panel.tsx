import {
  clinicaDocuments,
  clinicaStatements,
  type ClinicaPolarity,
  type ClinicaQuestion,
} from "@/lib/knowledge-demo/data/clinica";
import type { HomeT } from "./i18n";
import { tr } from "./i18n";
import { QuoteBlock, TermBadge } from "./graph-primitives";
import { TraceDetails } from "./trace-details";

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
  const statements = question.statementIds.flatMap((id) => {
    const statement = clinicaStatements.find((s) => s.id === id);
    return statement === undefined ? [] : [statement];
  });
  const revision = statements.find((statement) => statement.supersedes !== undefined);

  return (
    <div className="flex flex-col gap-4">
      <p className="font-serif text-[19px] leading-snug text-forest">{tr(t, question.questionKey)}</p>
      <p className="rounded-[5px] bg-paper px-4 py-3 text-[16px] leading-relaxed text-forest">{tr(t, question.answerKey)}</p>

      <ol className="flex flex-col gap-4 border-l-2 border-terracotta pl-4">
        {statements.map((statement) => (
          <li key={statement.id}>
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-prose-muted">
              <TermBadge>{statement.polarity}</TermBadge>
              <span>{statement.docId}, {lineLabel} {statement.lineStart}</span>
            </div>
            <p className="mt-1 text-[14px] leading-relaxed text-forest">{statement.label}</p>
            <p className="mt-1 text-[12px] text-prose-muted">{tr(t, polarityKey(statement.polarity))}</p>
          </li>
        ))}
      </ol>

      {revision !== undefined && (
        <div className="text-[14px] leading-relaxed text-forest">
          <p>{t("knowledgeDemo.clinica.revision")}</p>
          <p className="mt-2 flex flex-wrap items-center gap-2">
            <span>{revision.docId}: {revision.polarity}</span>
            <TermBadge>supersedes</TermBadge>
            <span>{revision.supersedes?.flatMap((id) => {
              const previous = clinicaStatements.find((statement) => statement.id === id);
              return previous === undefined ? [] : [`${previous.docId}: ${previous.polarity}`];
            }).join(", ")}</span>
          </p>
        </div>
      )}
      <p className="text-[14px] leading-relaxed text-forest">{t("knowledgeDemo.clinica.knowledgeBoundary")}</p>

      <TraceDetails key={question.id} label={t("knowledgeDemo.clinica.traceLabel")}>
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

        <p className="text-[12px] leading-relaxed text-prose-muted">{t("knowledgeDemo.clinica.disclosure")}</p>
      </TraceDetails>
    </div>
  );
};
