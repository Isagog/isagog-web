import type { Hardware, LlmModel } from "./data";

/**
 * Memory and decode-speed estimates for the on-prem LLM sizing matrix.
 * Ported unchanged from the delivered page's script; the page's "How the
 * estimates work" section documents the formulas in prose.
 */

export type Precision = "best" | "rel" | "8" | "4" | "2";

export interface Scenario {
  prec: Precision;
  /** Context per user, K tokens. */
  ctx: number;
  users: number;
  offload: boolean;
  spec: boolean;
}

/** The model fields the formulas read; calibration rows supply only these. */
export type ModelShape = Pick<LlmModel, "total" | "active" | "layers" | "kv" | "moe" | "ctx">;

/** System RAM available for offloaded weights, GB, and its read bandwidth, GB/s. */
export const RAM_USABLE = 110;
export const RAM_BW = 60;

/** Effective bits per weight for 8-bit, 4-bit and ~2.5-bit quantisation. */
export const P8 = 8.5;
export const P4 = 4.7;
export const P2 = 2.7;

export const usableOf = (h: Hardware): number => (h.usable !== undefined ? h.usable : h.mem * 0.93);
const tpEff = (h: Hardware): number =>
  h.n === 1 ? 1 : h.link === "nvlink" ? 0.75 : h.n === 2 ? 0.6 : 0.5;
const commPerLayer = (h: Hardware): number =>
  h.n === 1 ? 0 : h.link === "nvlink" ? 0.15 : h.n === 2 ? 0.06 : 0.1;

export function precLabel(m: LlmModel, bits: number): string {
  if (Math.abs(bits - m.bits) < 1e-6) return m.rel;
  if (bits === P8) return "FP8";
  if (bits === P4) return "Q4";
  if (bits === P2) return "Q2";
  return `${bits}-bit`;
}

export const serveBits = (m: LlmModel): number => Math.min(m.bits, P8);
export const fourBits = (m: LlmModel): number => (m.bits <= 5.0 ? m.bits : P4);

/** Precisions to try, best first. Datacenter hardware never drops to ~2.5-bit. */
export function candidates(m: LlmModel, prec: Precision, h?: Hardware): number[] {
  if (prec === "rel") return [m.bits];
  if (prec === "8") return [serveBits(m)];
  if (prec === "4") return [Math.min(serveBits(m), fourBits(m))];
  if (prec === "2") return [P2];
  const s = serveBits(m);
  return [s, ...(s > 5.0 ? [P4] : []), ...(!h || !h.dc ? [P2] : [])];
}

export interface MemoryNeed {
  w: number;
  kv: number;
  kvUser: number;
  over: number;
  total: number;
  /** Effective context, K tokens, after the model's own cap. */
  ctx: number;
}

/** Memory needed in GB: weights + KV cache + 3% runtime overhead and 1 GB per GPU. */
export function memNeed(m: ModelShape, bits: number, ctxK: number, users: number, n: number): MemoryNeed {
  const ctx = Math.min(ctxK, m.ctx);
  const w = (m.total * bits) / 8;
  const kvUser = (m.kv * ctx) / 1024;
  const kv = kvUser * users;
  const over = w * 0.03 + n;
  return { w, kv, kvUser, over, total: w + kv + over, ctx };
}

export interface Speed {
  perUser: number;
  agg: number;
  memBound: boolean;
}

/** Decode speed in tokens/s; `offFrac` is the share of weights offloaded to system RAM. */
export function speed(
  m: ModelShape,
  bits: number,
  h: Hardware,
  users: number,
  ctxK: number,
  offFrac: number,
  spec: boolean
): Speed {
  const ctx = Math.min(ctxK, m.ctx);
  const effBW = h.bw * h.n * tpEff(h) * (h.apple ? 0.7 : 0.75);
  const r = m.active / m.total;
  const cover = m.moe ? 1 - Math.pow(1 - r, users) : 1;
  const wTouched = ((m.total * bits) / 8) * cover;
  const kvRead = ((m.kv * ctx) / 1024) * 0.5 * users;
  const memT =
    offFrac > 0
      ? (wTouched * (1 - offFrac) + kvRead) / effBW + (wTouched * offFrac) / RAM_BW
      : (wTouched + kvRead) / effBW;
  const compT =
    (2 * m.active * 1e9 * users) / (h.tf * 1e12 * h.n * tpEff(h) * 0.35 * (bits <= P8 ? 1.5 : 1));
  const perLayer = (m.moe ? 0.1 : 0.03) * (h.plat || 1) + commPerLayer(h);
  const fixed = (m.layers * perLayer + 0.5) / 1000;
  const t = Math.max(memT, compT) + fixed;
  const batchEff = 1 / (1 + 0.02 * (users - 1));
  const sp = spec ? (users === 1 ? 1.6 : users <= 8 ? 1.3 : 1.1) : 1;
  const perUser = (1 / t) * batchEff * sp;
  return { perUser, agg: perUser * users, memBound: memT >= compT };
}

interface EvaluationBase {
  bits: number;
  label: string;
  need: MemoryNeed;
  usable: number;
}

export type Evaluation =
  | (EvaluationBase & Speed & { status: "fit" | "tight" })
  | (EvaluationBase & Speed & { status: "offload"; offFrac: number })
  | (EvaluationBase & { status: "nodes"; nodes: number })
  | (EvaluationBase & { status: "none" });

/** Whether model `m` runs on hardware `h` under the scenario, and how fast. */
export function evaluate(m: LlmModel, h: Hardware, scenario: Scenario): Evaluation {
  const { prec, ctx, users, offload, spec } = scenario;
  const cands = candidates(m, prec, h);
  const usable = usableOf(h);
  for (const b of cands) {
    const need = memNeed(m, b, ctx, users, h.n);
    if (need.total <= usable) {
      const s = speed(m, b, h, users, ctx, 0, spec);
      const status = need.total > usable * 0.9 ? "tight" : "fit";
      return { status, bits: b, label: precLabel(m, b), need, usable, ...s };
    }
  }
  if (offload && h.offload) {
    for (const b of cands) {
      const need = memNeed(m, b, ctx, users, h.n);
      const gpuW = usable - need.kv - need.over;
      if (gpuW > need.w * 0.04 && need.w - gpuW <= RAM_USABLE) {
        const offFrac = (need.w - gpuW) / need.w;
        const s = speed(m, b, h, users, ctx, offFrac, spec);
        return { status: "offload", bits: b, label: precLabel(m, b), need, usable, offFrac, ...s };
      }
    }
  }
  const base = cands.filter((b) => b !== P2 || prec === "2");
  const b0 = base.length ? base : cands;
  if (h.node) {
    for (let k = 2; k <= 4; k++) {
      for (const b of b0) {
        const need = memNeed(m, b, ctx, users, h.n * k);
        if (need.total <= usable * k) {
          return { status: "nodes", nodes: k, bits: b, label: precLabel(m, b), need, usable };
        }
      }
    }
  }
  const b = b0[b0.length - 1] ?? P2;
  return { status: "none", bits: b, label: precLabel(m, b), need: memNeed(m, b, ctx, users, h.n), usable };
}

/** Speed bucket 1–5 for the matrix colour ramp: <5, 5–15, 15–40, 40–100, 100+ tok/s. */
export const bucket = (v: number): number => (v < 5 ? 1 : v < 15 ? 2 : v < 40 ? 3 : v < 100 ? 4 : 5);
