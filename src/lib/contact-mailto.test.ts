import { describe, expect, it } from "vitest";
import { buildMailtoHref } from "./contact-mailto";

const draft = {
  name: "Anna Rossi",
  email: "anna@example.org",
  organisation: "Museo Aurora",
  message: "Vorremmo collegare le schede delle mostre.",
};

describe("buildMailtoHref", () => {
  it("targets info@isagog.com by default", () => {
    expect(buildMailtoHref(draft)).toMatch(/^mailto:info@isagog\.com\?/);
  });

  it("accepts a different recipient", () => {
    expect(buildMailtoHref(draft, "ciao@isagog.com")).toMatch(/^mailto:ciao@isagog\.com\?/);
  });

  it("puts every field in the body", () => {
    const body = new URL(buildMailtoHref(draft)).searchParams.get("body") ?? "";
    expect(body).toContain("Anna Rossi");
    expect(body).toContain("anna@example.org");
    expect(body).toContain("Museo Aurora");
    expect(body).toContain("Vorremmo collegare le schede delle mostre.");
  });

  it("encodes characters that would break the URL", () => {
    const href = buildMailtoHref({ ...draft, message: "a&b c=d\nsecond line" });
    expect(href).not.toContain("&b c=d");
    const body = new URL(href).searchParams.get("body") ?? "";
    expect(body).toContain("a&b c=d");
    expect(body).toContain("second line");
  });

  it("omits empty fields rather than printing blank labels", () => {
    const body =
      new URL(buildMailtoHref({ ...draft, organisation: "" })).searchParams.get("body") ?? "";
    expect(body).not.toContain("Organizzazione");
    expect(body).toContain("Anna Rossi");
  });
});
