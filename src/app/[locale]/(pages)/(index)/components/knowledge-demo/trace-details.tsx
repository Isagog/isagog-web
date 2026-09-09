import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/** Native disclosure: the trace is accessible even before hydration. */
export const TraceDetails = ({ label, children }: { readonly label: ReactNode; readonly children: ReactNode }) => (
  <details className="group border-t border-card-border pt-4">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-medium text-forest [&::-webkit-details-marker]:hidden">
      {label}
      <ChevronDown size={18} className="shrink-0 group-open:rotate-180" aria-hidden="true" />
    </summary>
    <div className="mt-5 flex flex-col gap-5">{children}</div>
  </details>
);
