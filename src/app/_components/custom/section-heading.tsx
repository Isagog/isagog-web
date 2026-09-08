import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const SectionHeading = ({
  eyebrow,
  title,
  lead,
  tone = "light",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
      className
    )}
  >
    <div>
      <span
        className={cn(
          "block text-[12px] font-semibold uppercase tracking-[0.1em]",
          tone === "dark" ? "text-cream-soft" : "text-forest"
        )}
      >
        {eyebrow}
      </span>
      <h3
        className={cn(
          "mt-4 text-[clamp(28px,3.4vw,39px)] leading-[1.15]",
          tone === "dark" ? "text-cream" : "text-forest"
        )}
      >
        {title}
      </h3>
    </div>
    {lead !== undefined && (
      <p
        className={cn(
          "max-w-[310px] text-[16px] font-semibold leading-[1.5]",
          tone === "dark" ? "text-cream-soft" : "text-terracotta"
        )}
      >
        {lead}
      </p>
    )}
  </div>
);
