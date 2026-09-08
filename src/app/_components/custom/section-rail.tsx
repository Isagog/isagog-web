"use client";

import { SECTIONS, computeActiveSection } from "@/lib/sections";
import type { SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/packages/locales/client";
import { useEffect, useState } from "react";

export const SectionRail = () => {
  const t = useScopedI18n("rail");
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const tops = SECTIONS.flatMap((section) => {
        const el = document.getElementById(section.id);
        if (el === null) return [];
        return [{ id: section.id, top: el.offsetTop }];
      });
      setActive(computeActiveSection(tops, window.scrollY));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav
      aria-label={t("label")}
      className={cn(
        "hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3",
        "transition-opacity duration-500",
        active === null ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      {SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-3 text-[12px] tracking-[0.1em] uppercase"
          >
            <span
              className={cn(
                "h-px transition-all duration-300",
                isActive ? "w-8 bg-terracotta" : "w-4 bg-divider group-hover:w-6"
              )}
            />
            <span
              className={cn(
                "transition-colors duration-300",
                isActive ? "text-forest" : "text-num group-hover:text-forest"
              )}
            >
              <span className="tabular-nums mr-1">{section.number}</span>
              {t(section.id)}
            </span>
          </a>
        );
      })}
    </nav>
  );
};
