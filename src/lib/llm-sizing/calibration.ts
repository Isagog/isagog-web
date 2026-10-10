import { HARDWARE, MODELS, type Hardware, type LlmModel } from "./data";
import { speed, type ModelShape } from "./estimate";

/**
 * Configurations with published single-machine measurements, run through
 * the same formulas as the matrix. Labels and sources are in the copy
 * (`tool.cal_labels`, `tool.cal_src`), index-aligned with these rows.
 */

type CalibrationModel = ModelShape & { bits: number };

interface CalibrationRowBase {
  hw: string;
  m: CalibrationModel;
  /** Context, K tokens. */
  ctx: number;
  users: number;
}

export type CalibrationRow = CalibrationRowBase &
  ({ meas: number } | { measLo: number; measHi: number });

const QWEN_32B: CalibrationModel = { total: 32.8, active: 32.8, bits: 4.85, layers: 64, kv: 256, moe: false, ctx: 128 };
const LLAMA_8B: CalibrationModel = { total: 8, active: 8, bits: 4.85, layers: 32, kv: 128, moe: false, ctx: 128 };
const LLAMA_70B_FP8: CalibrationModel = { total: 70.6, active: 70.6, bits: 8.5, layers: 80, kv: 320, moe: false, ctx: 128 };

const findModel = (name: string): LlmModel => {
  const model = MODELS.find((m) => m.name === name);
  if (!model) throw new Error(`Unknown calibration model: ${name}`);
  return model;
};

export const CALIBRATION: readonly CalibrationRow[] = [
  { hw: "5090", m: QWEN_32B, ctx: 4, users: 1, meas: 61.4 },
  { hw: "4090", m: QWEN_32B, ctx: 4, users: 1, meas: 42 },
  { hw: "5090", m: LLAMA_8B, ctx: 4, users: 1, meas: 220 },
  { hw: "spark", m: findModel("gpt-oss-120b"), ctx: 0.5, users: 1, meas: 60.6 },
  { hw: "spark", m: LLAMA_70B_FP8, ctx: 1, users: 1, meas: 2.7 },
  { hw: "h100", m: LLAMA_70B_FP8, ctx: 2, users: 64, measLo: 460, measHi: 984 },
];

export interface CalibrationResult {
  row: CalibrationRow;
  hardware: Hardware;
  /** Estimated tokens/s: aggregate when users > 1, otherwise per user. */
  estimate: number;
  /** Signed deviation from a single measurement, e.g. 0.12 for +12%. */
  deviation?: number;
  /** Within ±30% of a single measurement, or within 20% of a measured range. */
  agrees: boolean;
}

export function runCalibration(hardware: readonly Hardware[] = HARDWARE): CalibrationResult[] {
  return CALIBRATION.map((row) => {
    const h = hardware.find((x) => x.id === row.hw);
    if (!h) throw new Error(`Unknown calibration hardware: ${row.hw}`);
    const s = speed(row.m, row.m.bits, h, row.users, row.ctx, 0, false);
    const estimate = row.users > 1 ? s.agg : s.perUser;
    if ("meas" in row) {
      const ratio = estimate / row.meas;
      return { row, hardware: h, estimate, deviation: ratio - 1, agrees: ratio >= 0.7 && ratio <= 1.3 };
    }
    const agrees = estimate >= row.measLo * 0.8 && estimate <= row.measHi * 1.2;
    return { row, hardware: h, estimate, agrees };
  });
}
