import { describe, expect, it } from "vitest";
import { runCalibration } from "./calibration";
import { HARDWARE, MODELS, type Hardware, type LlmModel } from "./data";
import { bucket, candidates, evaluate, memNeed, P2, P4, P8, type Scenario } from "./estimate";

/**
 * Pinned against the delivered static page's script: the port was checked
 * cell-for-cell against it over every precision × context × users × offload
 * × speculative-decoding combination; these cases guard that behaviour.
 */

const model = (name: string): LlmModel => {
  const m = MODELS.find((x) => x.name === name);
  if (!m) throw new Error(name);
  return m;
};
const hw = (id: string): Hardware => {
  const h = HARDWARE.find((x) => x.id === id);
  if (!h) throw new Error(id);
  return h;
};
const DEFAULT: Scenario = { prec: "best", ctx: 32, users: 1, offload: true, spec: false };

describe("candidates", () => {
  it("tries serving precision, then 4-bit, then ~2.5-bit off the datacenter", () => {
    expect(candidates(model("Gemma 4 12B"), "best", hw("5090"))).toEqual([P8, P4, P2]);
    expect(candidates(model("Gemma 4 12B"), "best", hw("h100"))).toEqual([P8, P4]);
  });

  it("keeps a sub-5-bit release precision as the only non-~2.5-bit candidate", () => {
    expect(candidates(model("Kimi K3"), "best", hw("8b300"))).toEqual([4.45]);
    expect(candidates(model("Kimi K3"), "rel")).toEqual([4.45]);
  });
});

describe("memNeed", () => {
  it("caps context at the model's maximum", () => {
    const need = memNeed(model("Gemma 4 12B"), P4, 1000, 1, 1);
    expect(need.ctx).toBe(128);
  });

  it("sums weights, KV cache and runtime overhead", () => {
    const need = memNeed(model("gpt-oss-120b"), 4.44, 32, 1, 1);
    expect(need.total).toBeCloseTo(need.w + need.kv + need.over, 10);
    expect(need.w).toBeCloseTo((117 * 4.44) / 8, 10);
  });
});

describe("evaluate", () => {
  it("fits gpt-oss-120b on a DGX Spark at its release precision", () => {
    const r = evaluate(model("gpt-oss-120b"), hw("spark"), DEFAULT);
    expect(r.status).toBe("fit");
    expect(r.label).toBe("MXFP4");
    if (r.status === "fit") expect(r.perUser).toBeCloseTo(46.7477, 3);
  });

  it("needs three 8× H100 nodes for Kimi K3", () => {
    const r = evaluate(model("Kimi K3"), hw("8h100"), DEFAULT);
    expect(r.status).toBe("nodes");
    if (r.status === "nodes") expect(r.nodes).toBe(3);
  });

  it("offloads to system RAM only when offload is on", () => {
    const on = evaluate(model("gpt-oss-120b"), hw("5090"), DEFAULT);
    expect(on.status).toBe("offload");
    if (on.status === "offload") expect(on.offFrac).toBeCloseTo(0.6044, 3);

    const off = evaluate(model("gpt-oss-120b"), hw("5090"), { ...DEFAULT, offload: false });
    expect(off.status).toBe("none");
  });

  it("flags fits with under 10% headroom as tight", () => {
    const r = evaluate(model("gpt-oss-120b"), hw("h100"), DEFAULT);
    expect(r.status).toBe("tight");
  });

  it("applies the 1.6× speculative-decoding speed-up for a single user", () => {
    const base = evaluate(model("Gemma 4 12B"), hw("5060ti"), DEFAULT);
    const spec = evaluate(model("Gemma 4 12B"), hw("5060ti"), { ...DEFAULT, spec: true });
    if (base.status !== "fit" || spec.status !== "fit") throw new Error("expected fits");
    expect(spec.perUser / base.perUser).toBeCloseTo(1.6, 10);
  });
});

describe("bucket", () => {
  it("maps speeds onto the five legend bands", () => {
    expect([4.9, 5, 14.9, 15, 39.9, 40, 99.9, 100].map(bucket)).toEqual([1, 2, 2, 3, 3, 4, 4, 5]);
  });
});

describe("calibration", () => {
  it("lands every published measurement within the stated tolerance", () => {
    const results = runCalibration();
    expect(results).toHaveLength(6);
    expect(results.every((r) => r.agrees)).toBe(true);
    expect(results.map((r) => r.estimate)).toEqual([
      56.85885297417492, 34.03179542029268, 190.3078909807653, 53.51284639093343,
      2.699022242118312, 695.516245094648,
    ]);
  });
});
