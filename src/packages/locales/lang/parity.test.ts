import { describe, expect, it } from "vitest";
import en from "./en";
import itLocale from "./it";

/**
 * it.ts and en.ts must stay structurally identical: every scope, in every
 * component, reads its copy from a shared key path via getScopedI18n /
 * useScopedI18n, so a key present in one locale file but missing (or
 * differently named, or differently ordered) in the other either throws at
 * runtime or silently falls back in a way nothing else here catches. This
 * branch relocated five whole scopes across both files while keeping them
 * hand-verified in sync — nothing enforces that automatically. This test
 * does, the same way the article-order invariant in mdx.test.ts pins its
 * own cross-file assumption.
 *
 * Compares by sequence, not by set membership, so a key that moved to a
 * different position in only one file still fails the test.
 */
const collectKeyPaths = (value: unknown, prefix = ""): string[] => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    const isLeaf = child === null || typeof child !== "object" || Array.isArray(child);
    return isLeaf ? [path] : [path, ...collectKeyPaths(child, path)];
  });
};

describe("locale file parity (it.ts / en.ts)", () => {
  it("declares the same key sequence in both locale files", () => {
    const itKeys = collectKeyPaths(itLocale);
    const enKeys = collectKeyPaths(en);

    expect(enKeys).toEqual(itKeys);
  });
});
