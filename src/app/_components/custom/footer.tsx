"use client";

import { useScopedI18n } from "@/packages/locales/client";
import { LocaleLink as Link } from "./locale-link";

export const Footer = () => {
  const t = useScopedI18n("footer");

  return (
    <footer className="border-t border-card-border bg-page">
      <div className="mx-auto flex max-w-[1224px] flex-col gap-4 px-6 py-8 text-[14px] text-prose-muted sm:flex-row sm:items-center sm:justify-between">
        <span>
          {t("copyright", { year: String(new Date().getFullYear()) })} — {t("street")}, {t("zip")}
        </span>
        <div className="flex flex-wrap gap-6">
          <Link href="/platform" className="hover:text-forest">{t("platform")}</Link>
          <Link href="/project" className="hover:text-forest">{t("project")}</Link>
          <Link href="/blog" className="hover:text-forest">{t("blog")}</Link>
        </div>
      </div>
    </footer>
  );
};
