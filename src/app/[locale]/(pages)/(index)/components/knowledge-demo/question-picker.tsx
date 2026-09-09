"use client";

import type { ReactNode } from "react";

export interface QuestionOption {
  readonly id: string;
  readonly question: ReactNode;
}

interface QuestionPickerProps {
  readonly options: readonly QuestionOption[];
  readonly activeId: string;
  readonly onChange: (id: string) => void;
  readonly groupLabel: string;
}

/** A small button group for picking which of a tab's 2-3 questions is shown. */
export const QuestionPicker = ({ options, activeId, onChange, groupLabel }: QuestionPickerProps) => (
  <div role="group" aria-label={groupLabel} className="flex flex-wrap gap-2">
    {options.map((option) => {
      const active = option.id === activeId;
      return (
        <button
          key={option.id}
          type="button"
          aria-pressed={active}
          onClick={() => onChange(option.id)}
          className={
            active
              ? "rounded-full bg-sage px-3.5 py-1.5 text-[12.5px] font-medium text-cream"
              : "rounded-full border border-card-border bg-paper px-3.5 py-1.5 text-[12.5px] text-prose-muted hover:text-forest"
          }
        >
          {option.question}
        </button>
      );
    })}
  </div>
);
