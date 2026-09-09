import { clinicaStatements } from "@/lib/knowledge-demo/data/clinica";
import type { HomeT } from "./i18n";
import { QuoteBlock, TermBadge } from "./graph-primitives";

/** A real negative statement is visible on the initial museum tab, too. */
export const NegativeKnowledge = ({ t, onExplore }: { readonly t: HomeT; readonly onExplore: () => void }) => {
  const negative = clinicaStatements.find((statement) => statement.id === "p-L1-test-allergologico");
  if (negative === undefined) return null;

  return (
    <section aria-labelledby="negative-knowledge-title" className="mt-6 border-t border-divider pt-5">
      <h3 id="negative-knowledge-title" className="font-sans text-[12px] font-semibold tracking-[0.06em] text-terracotta">
        {t("knowledgeDemo.negative.eyebrow")}
      </h3>
      <p className="mt-2 text-[16px] font-medium text-forest">{t("knowledgeDemo.negative.title")}</p>
      <div className="mt-3 border-l-2 border-terracotta pl-3">
        <QuoteBlock quote={negative.quote} />
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-prose-muted">
          <TermBadge>{negative.className}</TermBadge>
          <TermBadge>{negative.polarity}</TermBadge>
          <span>{negative.docId}, {t("knowledgeDemo.lineLabel")} {negative.lineStart}</span>
        </div>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-forest">{t("knowledgeDemo.negative.explanation")}</p>
      <button type="button" onClick={onExplore} className="mt-3 text-left text-[14px] font-medium text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest">
        {t("knowledgeDemo.negative.explore")}
      </button>
      <p className="mt-2 text-[12px] text-prose-muted">{t("knowledgeDemo.clinica.shortDisclosure")}</p>
    </section>
  );
};
