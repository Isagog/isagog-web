import { IS_STAGING, SITE_URL } from "@/lib/base-path";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // A staging build lives at a subpath, where /robots.txt is not read by
  // crawlers at all — the noindex meta tag in the layout is what actually
  // keeps it out of the index. This still refuses politely at the root.
  return {
    rules: IS_STAGING
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
