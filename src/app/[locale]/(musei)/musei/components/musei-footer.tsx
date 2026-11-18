"use client";

import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { reopenConsent } from "@/lib/analytics-consent";
import { useScopedI18n } from "@/packages/locales/client";

interface MuseiFooterProps {
  /** The build-time copyright year; see src/lib/build-year.ts. */
  year: number;
}

/**
 * Footer for the museum page only: the company line, one link to the main
 * site home, the email, and the privacy button the consent banner points to.
 */
export const MuseiFooter = ({ year }: MuseiFooterProps) => {
  const footer = useScopedI18n("footer");
  const t = useScopedI18n("musei.footer");

  return (
    <footer className="border-t border-card-border bg-page">
      <div className="mx-auto flex max-w-[1224px] flex-col gap-4 px-6 py-8 text-[14px] text-prose-muted sm:flex-row sm:items-center sm:justify-between">
        <span>
          {footer("copyright", { year: String(year) })} — {footer("street")}, {footer("zip")}
        </span>
        <div className="flex flex-wrap gap-6">
          <Link href="/" className="hover:text-forest">
            {t("site")}
          </Link>
          <a href="mailto:info@isagog.com" className="hover:text-forest">
            {footer("email")}
          </a>
          <button type="button" onClick={reopenConsent} className="hover:text-forest">
            {footer("privacyPreferences")}
          </button>
        </div>
      </div>
    </footer>
  );
};
