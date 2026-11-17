import { BUILD_YEAR } from "@/lib/build-year";
import type { ReactNode } from "react";
import { MuseiFooter } from "./components/musei-footer";
import { MuseiHeader } from "./components/musei-header";

// The museum page has its own header and footer instead of the Isagog ones
// (src/app/[locale]/(pages)/layout.tsx), so visitors from museum outreach
// see only this page, with one link to the main site.
export default function MuseiLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <MuseiHeader />
      {children}
      <MuseiFooter year={BUILD_YEAR} />
    </>
  );
}
