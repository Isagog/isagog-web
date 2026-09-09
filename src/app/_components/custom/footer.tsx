"use client";

import { useScopedI18n } from "@/packages/locales/client";
import { LocaleLink as Link } from "./locale-link";

interface FooterProps {
  /**
   * The copyright year, resolved once at build time by the server-rendered
   * layout and passed down — never computed client-side. `new Date()` in a
   * client component reflects the visitor's clock, which drifts from the
   * year baked into the prerendered HTML the moment a calendar year turns
   * over, producing a hydration mismatch.
   */
  year: number;
}

const ROUTE_LINKS = [
  { href: "/", key: "home" },
  { href: "/approach", key: "approach" },
  { href: "/platform", key: "platform" },
  { href: "/project", key: "project" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export const Footer = ({ year }: FooterProps) => {
  const t = useScopedI18n("footer");

  return (
    <footer className="border-t border-card-border bg-page">
      <div className="mx-auto flex max-w-[1224px] flex-col gap-4 px-6 py-8 text-[14px] text-prose-muted sm:flex-row sm:items-center sm:justify-between">
        <span>
          {t("copyright", { year: String(year) })} — {t("street")}, {t("zip")}
        </span>
        <div className="flex flex-wrap gap-6">
          {ROUTE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-forest">
              {t(link.key)}
            </Link>
          ))}
          <a href="mailto:info@isagog.com" className="hover:text-forest">
            {t("email")}
          </a>
        </div>
      </div>
    </footer>
  );
};
