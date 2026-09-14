import { describe, expect, it } from "vitest";
import { buildMailtoHref } from "./contact-mailto";

const draft = {
  name: "Anna Rossi",
  email: "anna@example.org",
  organisation: "Museo Aurora",
  message: "Vorremmo collegare le schede delle mostre.",
};

describe("buildMailtoHref", () => {
  it("defaults to the Italian subject and field labels", () => {
    const url = new URL(buildMailtoHref(draft));
    expect(url.searchParams.get("subject")).toBe("Isagog — richiesta di confronto");
    expect(url.searchParams.get("body") ?? "").toContain("Nome: Anna Rossi");
  });

  it("uses the supplied subject and field labels, so the English page drafts an English email", () => {
    const url = new URL(
      buildMailtoHref(draft, "info@isagog.com", {
        subject: "Isagog — request for a conversation",
        name: "Name",
        email: "Email",
        organisation: "Organization",
      })
    );
    expect(url.searchParams.get("subject")).toBe("Isagog — request for a conversation");
    const body = url.searchParams.get("body") ?? "";
    expect(body).toContain("Name: Anna Rossi");
    expect(body).toContain("Organization: Museo Aurora");
    expect(body).not.toContain("Organizzazione");
  });

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

  // The assertions above all read the body back through
  // `new URL(...).searchParams.get("body")`, which decodes "+" as a space —
  // exactly the ambiguity `URLSearchParams`-based encoding relies on. A
  // regression to `URLSearchParams` (encoding spaces as "+" instead of
  // "%20") would pass every test above unnoticed. These assertions inspect
  // the raw, undecoded href instead, so that regression cannot hide.

  it("encodes spaces in the raw href as %20, never as +", () => {
    const href = buildMailtoHref(draft);
    expect(href).toContain("Anna%20Rossi");
    expect(href).not.toContain("Anna+Rossi");
    expect(href).not.toContain("+");
  });

  it("keeps a newline inside a field as %0A in the raw href, not stripped or merged", () => {
    const href = buildMailtoHref({ ...draft, message: "a&b c=d\nsecond line" });
    // Exact encoding of "a&b c=d\nsecond line": the newline must survive as
    // %0A between "d" and "second" — a stripped-newline regression would
    // still satisfy a plain `toContain("second line")` on the decoded body,
    // since "...dsecond line" contains that substring too.
    expect(href).toContain("a%26b%20c%3Dd%0Asecond%20line");
  });

  it("encodes non-ASCII characters (as the shipped Italian copy uses)", () => {
    const href = buildMailtoHref({ ...draft, message: "Città è pronta" });
    expect(href).toContain("Citt%C3%A0%20%C3%A8%20pronta");

    const body = new URL(href).searchParams.get("body") ?? "";
    expect(body).toContain("Città è pronta");
  });
});
