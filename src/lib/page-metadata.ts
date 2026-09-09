import type { Metadata } from "next";
import { IS_STAGING, SITE_URL } from "./base-path";
import { locales } from "./locale-href";

const SITE_NAME = "Isagog";
const SOCIAL_IMAGE_PATH = "/images/tree.avif";
const SOCIAL_IMAGE_ALT = "Illustrazione di un albero, Isagog";

interface BuildPageMetadataArgs {
  locale: string;
  /** Root-relative, locale-agnostic path with no leading/trailing slash quirks, e.g. "" for home or "/approach". */
  path: string;
  title: string;
  description: string;
}

/**
 * Builds this page's own metadata — canonical, hreflang alternates and
 * Open Graph/Twitter identity all derived from SITE_URL (which already
 * carries the deployment's base path), so a staging build never asserts
 * an identity at the old live site's domain root. See layout.tsx for why
 * the robots guard matters on staging.
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: BuildPageMetadataArgs): Metadata {
  const canonical = `${SITE_URL}/${locale}${path}/`;
  const languages = Object.fromEntries(
    locales.map((loc) => [loc, `${SITE_URL}/${loc}${path}/`])
  );
  const imageUrl = `${SITE_URL}${SOCIAL_IMAGE_PATH}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: SOCIAL_IMAGE_ALT }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical,
      languages,
    },
    robots: IS_STAGING ? { index: false, follow: false } : undefined,
  };
}
