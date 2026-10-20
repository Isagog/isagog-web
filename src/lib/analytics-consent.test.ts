import { describe, expect, it } from "vitest";
import { DECLINE_MAX_AGE_MS, declinedValue, parseConsent } from "./analytics-consent";

const NOW = Date.UTC(2026, 9, 20);

describe("parseConsent", () => {
  it("reads an acceptance", () => {
    expect(parseConsent("accepted", NOW)).toBe("accepted");
  });

  it("treats a missing or unknown value as no choice", () => {
    expect(parseConsent(null, NOW)).toBe("unset");
    expect(parseConsent("maybe", NOW)).toBe("unset");
    expect(parseConsent("declined:abc", NOW)).toBe("unset");
  });

  it("keeps a refusal for about six months, then asks again", () => {
    expect(parseConsent(declinedValue(NOW), NOW)).toBe("declined");
    expect(parseConsent(declinedValue(NOW - DECLINE_MAX_AGE_MS + 1), NOW)).toBe("declined");
    expect(parseConsent(declinedValue(NOW - DECLINE_MAX_AGE_MS), NOW)).toBe("unset");
  });

  it("ignores a refusal dated in the future", () => {
    expect(parseConsent(declinedValue(NOW + 1000), NOW)).toBe("unset");
  });
});
