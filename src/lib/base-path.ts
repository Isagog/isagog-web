/**
 * Where this build is served from.
 *
 * The site deploys first to https://isagog.com/isagog-web/ so it can be
 * reviewed live while isagog.com keeps serving the old site; at cutover
 * NEXT_PUBLIC_BASE_PATH is removed and everything moves to the domain root.
 * Next prefixes next/link hrefs on its own, but NOT next/image src — Next's
 * own docs say so, and a fresh basePath build confirmed it (image src came
 * out unprefixed). These helpers cover that plus every raw string Next never
 * touches: fetch() URLs, <iframe src>, and anything under public/.
 */
import { normaliseBasePath } from "./normalise-base-path.mjs";

const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const BASE_PATH = normaliseBasePath(raw);

export const IS_STAGING = BASE_PATH !== "";

const ORIGIN = "https://isagog.com";

export const SITE_URL = `${ORIGIN}${BASE_PATH}`;

/**
 * Prefix a root-relative asset path with the deployment's base path.
 * Use for fetch() URLs, <iframe src>, next/image src, and any other raw
 * string Next does not rewrite. Absolute URLs and non-path hrefs pass
 * through unchanged.
 */
export const asset = (path: string): string => {
  if (!path.startsWith("/")) return path;
  if (BASE_PATH === "") return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
};
