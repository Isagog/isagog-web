import { SITE_URL } from "@/lib/base-path";
import { locales } from "@/lib/locale-href";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE = SITE_URL;
const PATHS = [
  { path: "", priority: 1, changeFrequency: "monthly" as const },
  { path: "/platform", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/project", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return locales.flatMap((locale) =>
    PATHS.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
    }))
  );
}
