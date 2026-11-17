import type { ReactNode } from "react";

export const Question = ({ children }: { children: ReactNode }) => (
  <p className="ml-auto w-fit max-w-[88%] rounded-[14px] rounded-br-[3px] bg-forest-deep px-4 py-2.5 text-[14.5px] leading-[1.45] text-cream">
    {children}
  </p>
);

export const Answer = ({ label, children }: { label?: string; children: ReactNode }) => (
  <div className="w-fit max-w-[94%] rounded-[14px] rounded-bl-[3px] border border-card-border bg-persone px-4 py-3 text-[14.5px] leading-[1.5] text-forest">
    {label !== undefined && (
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-sage">
        {label}
      </span>
    )}
    {children}
  </div>
);

export const Steps = ({ steps }: { steps: readonly string[] }) => (
  <ol className="list-decimal space-y-1 pl-5">
    {steps.map((step) => (
      <li key={step}>{step}</li>
    ))}
  </ol>
);
