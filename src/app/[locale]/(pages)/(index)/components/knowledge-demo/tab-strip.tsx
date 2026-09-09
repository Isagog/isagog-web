"use client";

import { useRef, type ReactNode } from "react";
import type { TabId } from "@/lib/knowledge-demo/types";

export interface TabDef {
  readonly id: TabId;
  readonly label: ReactNode;
}

interface TabStripProps {
  readonly tabs: readonly TabDef[];
  readonly activeTab: TabId;
  readonly onChange: (tab: TabId) => void;
  readonly tablistLabel: string;
}

/**
 * A real ARIA tablist: role="tablist"/"tab", aria-selected, roving tabIndex,
 * and Left/Right/Home/End arrow-key navigation that both moves focus and
 * activates the tab (the common "automatic activation" tabs pattern).
 */
export const TabStrip = ({ tabs, activeTab, onChange, tablistLabel }: TabStripProps) => {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const focusAndActivate = (tab: TabId) => {
    onChange(tab);
    buttonRefs.current[tab]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = tabs.length - 1;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = tabs[index === lastIndex ? 0 : index + 1];
      if (next !== undefined) focusAndActivate(next.id);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prev = tabs[index === 0 ? lastIndex : index - 1];
      if (prev !== undefined) focusAndActivate(prev.id);
    } else if (event.key === "Home") {
      event.preventDefault();
      const first = tabs[0];
      if (first !== undefined) focusAndActivate(first.id);
    } else if (event.key === "End") {
      event.preventDefault();
      const last = tabs[lastIndex];
      if (last !== undefined) focusAndActivate(last.id);
    }
  };

  return (
    <div role="tablist" aria-label={tablistLabel} className="flex gap-2">
      {tabs.map((tab, index) => {
        const selected = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              buttonRefs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            id={`knowledge-demo-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`knowledge-demo-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={
              selected
                ? "rounded-[5px] bg-forest px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-cream"
                : "rounded-[5px] border border-card-border bg-paper px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-forest/70 hover:text-forest"
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
