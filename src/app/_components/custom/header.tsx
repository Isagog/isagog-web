"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { asset } from "@/lib/base-path";
import { stripLocale } from "@/lib/locale-href";
import { ontologySiteUrl } from "@/lib/ontology-site";
import { cn } from "@/lib/utils";
import { useCurrentLocale, useScopedI18n } from "@/packages/locales/client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSelector } from "./language-selector";
import { LocaleLink as Link } from "./locale-link";

const isActive = (pathname: string, href: string): boolean => pathname.startsWith(href);

export const Header = () => {
  const t = useScopedI18n("nav");
  const locale = useCurrentLocale();
  const pathname = stripLocale(usePathname());
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/approach", label: t("approach") },
    { href: "/platform", label: t("platform") },
    // The ontology minisite: absolute URL, so LocaleLink leaves it as is.
    { href: ontologySiteUrl(locale), label: t("ontologies") },
    { href: "/project", label: t("project") },
    { href: "/blog", label: t("blog") },
    { href: "/careers", label: t("careers") },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-page/90 backdrop-blur-sm border-b border-border">
      <div className="mx-auto flex max-w-[1224px] items-center justify-between gap-4 px-6 py-4 max-[640px]:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="shrink-0">
            <Image
              src={asset("/isagog-logo.svg")}
              alt={t("wordmark")}
              width={2410}
              height={309}
              loading="eager"
              className="h-5 w-auto sm:h-6"
            />
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
          </nav>
        </div>

        <div className="hidden xl:flex items-center gap-4">
          <Link
            href="/contact"
            className="rounded-[5px] bg-forest-deep px-5 py-3 text-[15px] font-medium text-white"
          >
            {t("cta")}
          </Link>
          <LanguageSelector className="text-forest/80 hover:text-forest" />
        </div>

        <div className="xl:hidden flex items-center gap-2">
          <LanguageSelector className="text-forest/80 hover:text-forest" />
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
              aria-label={t("menu")}
              className="flex h-8 w-8 items-center justify-center"
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
      </div>
    </header>
  );
};
