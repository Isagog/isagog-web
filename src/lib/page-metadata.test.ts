import { afterEach, describe, expect, it, vi } from "vitest";

const load = async (basePath: string | undefined) => {
  vi.resetModules();
  if (basePath === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = basePath;
  }
  return import("./page-metadata");
};

afterEach(() => {
  delete process.env.NEXT_PUBLIC_BASE_PATH;
});

describe("buildPageMetadata", () => {
  it("builds a locale-aware canonical with a trailing slash, not the site root", async () => {
    const { buildPageMetadata } = await load(undefined);
    const metadata = buildPageMetadata({
      locale: "it",
      path: "/approach",
      title: "Il nostro approccio",
      description: "Descrizione.",
    });

    expect(metadata.alternates?.canonical).toBe("https://isagog.com/it/approach/");
    expect(metadata.alternates?.canonical).not.toBe("https://isagog.com/");
  });

  it("resolves the home path (empty string) to a single trailing slash", async () => {
    const { buildPageMetadata } = await load(undefined);
    const metadata = buildPageMetadata({
      locale: "en",
      path: "",
      title: "Home",
      description: "Description.",
    });

    expect(metadata.alternates?.canonical).toBe("https://isagog.com/en/");
  });

  it("gives both locales' absolute URLs for the same path in alternates.languages", async () => {
    const { buildPageMetadata } = await load(undefined);
    const metadata = buildPageMetadata({
      locale: "it",
      path: "/platform",
      title: "La piattaforma",
      description: "Descrizione.",
    });

    expect(metadata.alternates?.languages).toEqual({
      it: "https://isagog.com/it/platform/",
      en: "https://isagog.com/en/platform/",
    });
  });

  it("sets openGraph.url equal to the canonical", async () => {
    const { buildPageMetadata } = await load(undefined);
    const metadata = buildPageMetadata({
      locale: "en",
      path: "/contact",
      title: "Contact",
      description: "Description.",
    });

    expect(metadata.openGraph?.url).toBe(metadata.alternates?.canonical);
  });

  it("sets openGraph.siteName", async () => {
    // Every page defines its own openGraph object, and Next.js does not
    // deep-merge nested metadata fields across layout and page — a page's
    // openGraph wholly replaces the layout's, per
    // node_modules/next/dist/docs/.../generate-metadata.md#merging. That's
    // also why layout.tsx does not declare its own openGraph.siteName: it
    // would be replaced by every page's own openGraph and so would never
    // reach the rendered output. buildPageMetadata is the one live source
    // of this field.
    const { buildPageMetadata } = await load(undefined);
    const metadata = buildPageMetadata({
      locale: "it",
      path: "/approach",
      title: "Il nostro approccio",
      description: "Descrizione.",
    });

    expect(metadata.openGraph?.siteName).toBe("Isagog");
  });

  it("carries the staging base path in every URL-bearing field", async () => {
    const { buildPageMetadata } = await load("/isagog-web");
    const metadata = buildPageMetadata({
      locale: "it",
      path: "/blog",
      title: "Approfondimenti",
      description: "Descrizione.",
    });

    expect(metadata.alternates?.canonical).toBe("https://isagog.com/isagog-web/it/blog/");
    expect(metadata.alternates?.languages).toEqual({
      it: "https://isagog.com/isagog-web/it/blog/",
      en: "https://isagog.com/isagog-web/en/blog/",
    });
    expect(metadata.openGraph?.url).toBe("https://isagog.com/isagog-web/it/blog/");

    const ogImages = metadata.openGraph?.images;
    const ogImageUrl =
      Array.isArray(ogImages) && typeof ogImages[0] === "object" && ogImages[0] !== null
        ? (ogImages[0] as { url: string | URL }).url.toString()
        : undefined;
    expect(ogImageUrl).toBe("https://isagog.com/isagog-web/images/tree.avif");

    const twitterImages = metadata.twitter && "images" in metadata.twitter ? metadata.twitter.images : undefined;
    const twitterImageUrl = Array.isArray(twitterImages) ? twitterImages[0]?.toString() : undefined;
    expect(twitterImageUrl).toBe("https://isagog.com/isagog-web/images/tree.avif");
  });

  it("sets robots to noindex/nofollow when staging", async () => {
    const { buildPageMetadata } = await load("/isagog-web");
    const metadata = buildPageMetadata({
      locale: "it",
      path: "/about",
      title: "Chi siamo",
      description: "Descrizione.",
    });

    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("omits robots outside of staging", async () => {
    const { buildPageMetadata } = await load(undefined);
    const metadata = buildPageMetadata({
      locale: "it",
      path: "/about",
      title: "Chi siamo",
      description: "Descrizione.",
    });

    expect(metadata.robots).toBeUndefined();
  });

  it("uses the page's own title, not the site's", async () => {
    const { buildPageMetadata } = await load(undefined);
    const metadata = buildPageMetadata({
      locale: "it",
      path: "/approach",
      title: "Il nostro approccio",
      description: "Descrizione.",
    });

    expect(metadata.title).toBe("Il nostro approccio");
    expect(metadata.title).not.toBe("Isagog — Un'IA che sa dire cosa sa");
    expect(metadata.openGraph?.title).toBe("Il nostro approccio");
  });
});
