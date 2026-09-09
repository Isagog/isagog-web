"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { stripLocale } from "@/lib/locale-href";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/packages/locales/client";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LocaleLink as Link } from "./locale-link";

/**
 * "/" is a prefix of every pathname, so the home entry needs an exact match
 * or it would render as active on every page.
 */
const isActive = (pathname: string, href: string): boolean =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

export const Header = () => {
  const t = useScopedI18n("nav");
  const pathname = stripLocale(usePathname());
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/approach", label: t("approach") },
    { href: "/platform", label: t("platform") },
    { href: "/project", label: t("project") },
    { href: "/blog", label: t("blog") },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-page/90 backdrop-blur-sm border-b border-border">
      <div className="mx-auto flex max-w-[1224px] items-center justify-between gap-4 px-6 py-4 max-[640px]:px-6">
        <Link href="/" className="font-serif text-[22px] text-forest">
          {t("wordmark")}
        </Link>

        <nav className="hidden xl:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[15px] text-forest/80 hover:text-forest transition-colors",
                isActive(pathname, item.href) && "text-forest font-medium"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-[5px] bg-forest-deep px-5 py-3 text-[15px] font-medium text-white"
          >
            {t("cta")}
          </Link>
        </nav>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            aria-label={t("menu")}
            className="xl:hidden flex h-8 w-8 items-center justify-center"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-page border-card-border">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href} className="text-[15px] text-forest">
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem asChild>
              <Link href="/contact" className="text-[15px] text-terracotta">
                {t("cta")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
