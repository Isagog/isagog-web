"use client";

import { LanguageSelector } from "@/app/_components/custom/language-selector";
import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { asset } from "@/lib/base-path";
import { useScopedI18n } from "@/packages/locales/client";
import Image from "next/image";

/**
 * Header for the museum page only: no Isagog nav. The logo stays on this page
 * (#top scrolls to the document top without an element of that id); leaving
 * for the main site is the explicit "Chi è Isagog" link. Same container and
 * padding as the Isagog header, so it stays 72px tall and matches the root
 * layout's pt-[72px] offset and the .scroll-anchor margin.
 */
export const MuseiHeader = () => {
  const t = useScopedI18n("musei.header");

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-page/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1224px] items-center justify-between gap-3 px-6 py-4 sm:gap-4">
        <a href="#top" aria-label={t("logoLabel")} className="flex shrink-0 items-center gap-3">
          <Image
            src={asset("/isagog-logo.svg")}
            alt=""
            width={2410}
            height={309}
            loading="eager"
            className="h-4 w-auto sm:h-6"
          />
          <span className="hidden text-[12px] font-semibold uppercase tracking-[0.1em] text-sage sm:inline">
            {t("tag")}
          </span>
        </a>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="whitespace-nowrap text-[14px] text-forest/80 transition-colors hover:text-forest sm:text-[15px]"
          >
            {t("about")}
          </Link>
          <a
            href="#call"
            className="hidden whitespace-nowrap rounded-[5px] bg-terracotta px-5 py-3 text-[15px] font-medium text-white sm:inline-flex"
          >
            {t("cta")}
          </a>
          <LanguageSelector className="text-forest/80 hover:text-forest" />
        </div>
      </div>
    </header>
  );
};
