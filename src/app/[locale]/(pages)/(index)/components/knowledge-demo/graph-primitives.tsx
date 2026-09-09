import type { ReactNode } from "react";

/**
 * Small presentational pieces shared by the three tab panels — a node with
 * its real ontology class name as a badge, an edge with its real property
 * name, and a source-quote block. Follows the node/edge idiom of the
 * homepage's previous knowledge-card.tsx, generalised to show a technical
 * class/property name alongside the (locale-provided) human label.
 */

interface TermBadgeProps {
  readonly children: ReactNode;
}

/** A verbatim ontology class or property name, rendered as a technical identifier. */
export const TermBadge = ({ children }: TermBadgeProps) => (
  <code className="rounded-[4px] bg-forest/10 px-1.5 py-0.5 font-sans text-[11px] font-medium text-forest">
    {children}
  </code>
);

interface DemoNodeProps {
  readonly className: string;
  readonly kindLabel: string;
  readonly label: ReactNode;
  readonly variant?: "plain" | "origin";
}

export const DemoNode = ({ className, kindLabel, label, variant = "plain" }: DemoNodeProps) => (
  <div
    className={
      variant === "origin"
        ? "flex flex-col gap-1 rounded-[5px] bg-forest px-4 py-3 text-cream"
        : "flex flex-col gap-1 rounded-[5px] border border-card-border bg-paper px-4 py-3 text-forest"
    }
  >
    <span className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.08em] opacity-70">{kindLabel}</span>
      <TermBadge>{className}</TermBadge>
    </span>
    <strong className="font-serif text-[16px] font-normal leading-tight">{label}</strong>
  </div>
);

interface DemoEdgeProps {
  readonly propertyLabel: string;
  readonly propertyName: string;
}

export const DemoEdge = ({ propertyLabel, propertyName }: DemoEdgeProps) => (
  <div className="flex items-center gap-2 py-1.5 pl-2 text-[13px] text-sage" aria-hidden="true">
    <span aria-hidden="true">↳</span>
    <span>{propertyLabel}</span>
    <TermBadge>{propertyName}</TermBadge>
  </div>
);

interface QuoteBlockProps {
  readonly quote: string;
}

/**
 * Renders a source quote, turning `**word**` spans from the vendored
 * excerpt (the source's own emphasis markers) into <strong>. Every quote
 * passed here must be the exact excerpt string — ontology-verification.test.ts
 * checks that against src/lib/knowledge-demo/ontology-excerpts.
 */
export const QuoteBlock = ({ quote }: QuoteBlockProps) => {
  const parts = quote.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-[13.5px] italic leading-snug text-prose-muted">
      &ldquo;
      {parts.map((part, index) => {
        const match = /^\*\*([^*]+)\*\*$/.exec(part);
        if (match?.[1] !== undefined) {
          return (
            <strong key={index} className="font-semibold not-italic text-forest">
              {match[1]}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
      &rdquo;
    </p>
  );
};
