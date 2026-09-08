import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * project.action.ts reads BASE_PATH (via base-path.ts) at import time, so
 * each test that cares about the base path needs a fresh module graph.
 * Same reset-modules + dynamic-import pattern as src/lib/base-path.test.ts.
 */
const loadFetchProjects = async (basePath: string | undefined) => {
  vi.resetModules();
  if (basePath === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = basePath;
  }
  const mod = await import("./project.action");
  return mod.fetchProjects;
};

const jsonResponse = (body: unknown, ok = true): Response =>
  ({
    ok,
    json: () => Promise.resolve(body),
  }) as Response;

const validProjects = [
  {
    title: "A",
    description: "d",
    secondTitle: "s",
    value: "v",
    sector: "sec",
    valueName: "vn",
    name: "n",
    image: "/images/a.jpg",
    slug: "a",
  },
];

afterEach(() => {
  delete process.env.NEXT_PUBLIC_BASE_PATH;
  vi.unstubAllGlobals();
});

describe("fetchProjects", () => {
  it("requests the asset()-wrapped URL under a staging base path", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(validProjects));
    vi.stubGlobal("fetch", fetchMock);

    const fetchProjects = await loadFetchProjects("/isagog-web");
    await fetchProjects("en");

    expect(fetchMock).toHaveBeenCalledWith("/isagog-web/projects-data/list.en.json");
    expect(fetchMock).not.toHaveBeenCalledWith("/projects-data/list.en.json");
  });

  it("requests the bare path at the domain root", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(validProjects));
    vi.stubGlobal("fetch", fetchMock);

    const fetchProjects = await loadFetchProjects(undefined);
    await fetchProjects("it");

    expect(fetchMock).toHaveBeenCalledWith("/projects-data/list.it.json");
  });

  it("throws instead of returning empty when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([], false)));

    const fetchProjects = await loadFetchProjects(undefined);
    await expect(fetchProjects("en")).rejects.toThrow("Failed to fetch projects");
  });

  it("throws instead of returning malformed data when the schema fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse([{ title: "A", slug: "a" }]))
    );

    const fetchProjects = await loadFetchProjects(undefined);
    await expect(fetchProjects("en")).rejects.toThrow("Invalid project data format");
  });
});
