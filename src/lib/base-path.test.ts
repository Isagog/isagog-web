import { afterEach, describe, expect, it, vi } from "vitest";

const load = async (basePath: string | undefined) => {
  vi.resetModules();
  if (basePath === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = basePath;
  }
  return import("./base-path");
};

afterEach(() => {
  delete process.env.NEXT_PUBLIC_BASE_PATH;
});

describe("BASE_PATH", () => {
  it("is empty when the env var is unset", async () => {
    const { BASE_PATH, IS_STAGING } = await load(undefined);
    expect(BASE_PATH).toBe("");
    expect(IS_STAGING).toBe(false);
  });

  it("is empty when the env var is blank", async () => {
    const { BASE_PATH, IS_STAGING } = await load("");
    expect(BASE_PATH).toBe("");
    expect(IS_STAGING).toBe(false);
  });

  it("normalises a bare segment to a leading slash", async () => {
    const { BASE_PATH } = await load("isagog-web");
    expect(BASE_PATH).toBe("/isagog-web");
  });

  it("strips a trailing slash", async () => {
    const { BASE_PATH } = await load("/isagog-web/");
    expect(BASE_PATH).toBe("/isagog-web");
  });

  it("reports staging when a base path is set", async () => {
    const { IS_STAGING } = await load("/isagog-web");
    expect(IS_STAGING).toBe(true);
  });
});

describe("asset", () => {
  it("returns the path unchanged at the domain root", async () => {
    const { asset } = await load(undefined);
    expect(asset("/articles-data/list.json")).toBe("/articles-data/list.json");
  });

  it("prefixes the path under a base path", async () => {
    const { asset } = await load("/isagog-web");
    expect(asset("/articles-data/list.json")).toBe(
      "/isagog-web/articles-data/list.json"
    );
  });

  it("does not double-prefix an already-prefixed path", async () => {
    const { asset } = await load("/isagog-web");
    expect(asset("/isagog-web/favicon.ico")).toBe("/isagog-web/favicon.ico");
  });

  it("does not double-prefix the base path with nothing after it", async () => {
    const { asset } = await load("/isagog-web");
    expect(asset("/isagog-web")).toBe("/isagog-web");
  });

  it("prefixes a path that merely shares the base path as a string prefix", async () => {
    const { asset } = await load("/isagog-web");
    expect(asset("/isagog-webbing/x")).toBe("/isagog-web/isagog-webbing/x");
  });

  it("leaves absolute URLs and data URIs untouched", async () => {
    const { asset } = await load("/isagog-web");
    expect(asset("https://example.com/a.png")).toBe("https://example.com/a.png");
    expect(asset("mailto:info@isagog.com")).toBe("mailto:info@isagog.com");
  });
});

describe("SITE_URL", () => {
  it("is the bare origin at the domain root", async () => {
    const { SITE_URL } = await load(undefined);
    expect(SITE_URL).toBe("https://isagog.com");
  });

  it("includes the base path on a staging build", async () => {
    const { SITE_URL } = await load("/isagog-web");
    expect(SITE_URL).toBe("https://isagog.com/isagog-web");
  });
});
