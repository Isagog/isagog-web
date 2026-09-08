import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * article.action.ts reads BASE_PATH (via base-path.ts) at import time, so
 * each test that cares about the base path needs a fresh module graph.
 * Same reset-modules + dynamic-import pattern as src/lib/base-path.test.ts.
 */
const loadFetchArticles = async (basePath: string | undefined) => {
  vi.resetModules();
  if (basePath === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = basePath;
  }
  const mod = await import("./article.action");
  return mod.fetchArticles;
};

const jsonResponse = (body: unknown, ok = true): Response =>
  ({
    ok,
    json: () => Promise.resolve(body),
  }) as Response;

const validArticles = [{ title: "A", image: "/images/a.jpg", slug: "a" }];

afterEach(() => {
  delete process.env.NEXT_PUBLIC_BASE_PATH;
  vi.unstubAllGlobals();
});

describe("fetchArticles", () => {
  it("requests the asset()-wrapped URL under a staging base path", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(validArticles));
    vi.stubGlobal("fetch", fetchMock);

    const fetchArticles = await loadFetchArticles("/isagog-web");
    await fetchArticles();

    expect(fetchMock).toHaveBeenCalledWith("/isagog-web/articles-data/list.json");
    expect(fetchMock).not.toHaveBeenCalledWith("/articles-data/list.json");
  });

  it("requests the bare path at the domain root", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(validArticles));
    vi.stubGlobal("fetch", fetchMock);

    const fetchArticles = await loadFetchArticles(undefined);
    await fetchArticles();

    expect(fetchMock).toHaveBeenCalledWith("/articles-data/list.json");
  });

  it("throws instead of returning empty when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([], false)));

    const fetchArticles = await loadFetchArticles(undefined);
    await expect(fetchArticles()).rejects.toThrow("Failed to fetch articles");
  });

  it("throws instead of returning malformed data when the schema fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse([{ title: "A", slug: "a" }]))
    );

    const fetchArticles = await loadFetchArticles(undefined);
    await expect(fetchArticles()).rejects.toThrow("Invalid article data format");
  });
});
