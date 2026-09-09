import { CircleAlert } from "lucide-react";
import type { MuseoNode, MuseoQuestion } from "@/lib/knowledge-demo/data/museo";
import type { HomeT } from "./i18n";
import { tr } from "./i18n";
import { DemoEdge, DemoNode, TermBadge } from "./graph-primitives";

interface MuseoPanelProps {
  readonly question: MuseoQuestion;
  readonly t: HomeT;
}

const findNode = (nodes: readonly MuseoNode[], id: string): MuseoNode | undefined =>
  nodes.find((node) => node.id === id);

export const MuseoPanel = ({ question, t }: MuseoPanelProps) => {
  const classLabel = t("knowledgeDemo.classLabel");
  const propertyLabel = t("knowledgeDemo.propertyLabel");

  return (
    <div className="flex flex-col gap-5">
      <p className="font-serif text-[19px] leading-snug text-forest">{tr(t, question.questionKey)}</p>

      {question.kind === "gather" && (
        <GatherGraph question={question} classLabel={classLabel} propertyLabel={propertyLabel} t={t} />
      )}
      {question.kind === "shared-value" && (
        <SharedValueGraph question={question} classLabel={classLabel} propertyLabel={propertyLabel} t={t} />
      )}
      {question.kind === "refusal" && (
        <RefusalGraph question={question} classLabel={classLabel} propertyLabel={propertyLabel} t={t} />
      )}

      <p className="text-[14px] leading-snug text-prose-muted">{tr(t, question.answerKey)}</p>

      {question.refusalExplanationKey !== undefined && (
        <div className="flex items-start gap-2 rounded-[5px] bg-tecnologia px-3.5 py-3 text-[13px] text-forest">
          <CircleAlert size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
          <span>
            <strong className="font-semibold">{t("knowledgeDemo.refusalCaption")}.</strong>{" "}
            {tr(t, question.refusalExplanationKey)}
          </span>
        </div>
      )}
    </div>
  );
};

interface SubGraphProps {
  readonly question: MuseoQuestion;
  readonly classLabel: string;
  readonly propertyLabel: string;
  readonly t: HomeT;
}

const GatherGraph = ({ question, classLabel, propertyLabel, t }: SubGraphProps) => {
  const origin = findNode(question.nodes, question.edges[0]?.from ?? "");
  return (
    <div className="flex flex-col items-start gap-1">
      {origin !== undefined && (
        <DemoNode className={origin.className} kindLabel={classLabel} label={tr(t, origin.labelKey)} variant="origin" />
      )}
      <div className="ml-2 flex flex-col gap-1.5 border-l border-card-border pl-4">
        {question.edges.map((edge) => {
          const target = findNode(question.nodes, edge.to);
          if (target === undefined) return null;
          return (
            <div key={`${edge.from}-${edge.to}`} className="flex flex-col gap-1">
              <DemoEdge propertyLabel={propertyLabel} propertyName={edge.propertyName} />
              <DemoNode className={target.className} kindLabel={classLabel} label={tr(t, target.labelKey)} />
            </div>
          );
        })}
      </div>
      {question.sharedClassName !== undefined && (
        <p className="mt-1 text-[12.5px] text-sage">
          {t("knowledgeDemo.museo.sharedClassCaption", {
            className: <TermBadge>{question.sharedClassName}</TermBadge>,
          })}
        </p>
      )}
    </div>
  );
};

const SharedValueGraph = ({ question, classLabel, propertyLabel, t }: SubGraphProps) => {
  const artworks = question.nodes.filter((node) => node.className === "Artwork");
  const value = question.nodes.find((node) => node.className !== "Artwork");
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-3">
        {artworks.map((artwork) => (
          <DemoNode key={artwork.id} className={artwork.className} kindLabel={classLabel} label={tr(t, artwork.labelKey)} />
        ))}
      </div>
      {value !== undefined && (
        <div className="ml-2 flex flex-col gap-1 border-l border-card-border pl-4">
          <DemoEdge propertyLabel={propertyLabel} propertyName="technique" />
          <DemoNode className={value.className} kindLabel={t("knowledgeDemo.museo.valueKind")} label={tr(t, value.labelKey)} />
        </div>
      )}
    </div>
  );
};

const RefusalGraph = ({ question, classLabel, propertyLabel, t }: SubGraphProps) => {
  const origin = findNode(question.nodes, question.edges[0]?.from ?? "");
  return (
    <div className="flex flex-col items-start gap-1">
      {origin !== undefined && (
        <DemoNode className={origin.className} kindLabel={classLabel} label={tr(t, origin.labelKey)} variant="origin" />
      )}
      <div className="ml-2 flex flex-col gap-1.5 border-l border-card-border pl-4">
        {question.edges.map((edge) => {
          const target = findNode(question.nodes, edge.to);
          if (target === undefined) return null;
          const isArtwork = target.className === "Artwork";
          return (
            <div key={`${edge.from}-${edge.to}`} className="flex flex-col gap-1">
              <DemoEdge propertyLabel={propertyLabel} propertyName={edge.propertyName} />
              <div className={isArtwork ? "opacity-70" : undefined}>
                <DemoNode className={target.className} kindLabel={classLabel} label={tr(t, target.labelKey)} />
              </div>
              {isArtwork && (
                <p className="pl-1 text-[12px] text-prose-muted">{t("knowledgeDemo.museo.noOutgoingEdges")}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
