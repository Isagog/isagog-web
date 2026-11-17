import { Footer } from "@/app/_components/custom/footer";
import { Header } from "@/app/_components/custom/header";
import { BUILD_YEAR } from "@/lib/build-year";
import type { ReactNode } from "react";

// The Isagog site's pages share the Isagog header and footer. Pages with
// their own chrome (the museum page) live in a sibling route group.
export default function PagesLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <Footer year={BUILD_YEAR} />
    </>
  );
}
