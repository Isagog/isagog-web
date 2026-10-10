import { fill, type SizingCopy } from "@/lib/llm-sizing/copy";
import type { Hardware, LlmModel } from "@/lib/llm-sizing/data";
import {
  candidates,
  fourBits,
  memNeed,
  P2,
  serveBits,
  usableOf,
  type Scenario,
} from "@/lib/llm-sizing/estimate";
import { fmtGB } from "@/lib/llm-sizing/format";
import type { Locale } from "@/lib/locale-href";
import { Fragment } from "react";
import styles from "./sizing.module.css";

interface FootprintChartProps {
  copy: SizingCopy;
  locale: Locale;
  models: readonly LlmModel[];
  hardware: readonly Hardware[];
  scenario: Scenario;
}

const W = 1000;
const LEFT = 190;
const RIGHT = 64;
const TOP = 104;
const ROW_H = 22;
const GAP_G = 14;
const LO = Math.log2(4);
const HI = Math.log2(4096);
const TICKS = [4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096] as const;

const INK = "var(--color-forest)";
const MUTED = "var(--color-prose-muted)";
const LINE = "var(--color-card-border)";
const ACCENT = "var(--color-forest-deep)";
const WARN = "var(--color-terracotta)";

/** Log-scale x position for a footprint in GB, clamped to 4 GB – 4 TB. */
const x = (gb: number): number =>
  LEFT + ((Math.log2(Math.max(4, Math.min(4096, gb))) - LO) / (HI - LO)) * (W - LEFT - RIGHT);

/** Each model's footprint against every hardware tier's usable memory. */
export function FootprintChart({ copy, locale, models, hardware, scenario }: FootprintChartProps) {
  const t = copy.tool;
  const { prec, ctx, users } = scenario;
  const nGroups = new Set(models.map((m) => m.g)).size;
  const height = TOP + models.length * ROW_H + nGroups * GAP_G + 34;
  const caps = hardware
    .map((h) => ({ id: h.id, x: x(usableOf(h)), label: h.short, v: usableOf(h) }))
    .sort((a, b) => a.v - b.v);
  const rows = models.map((m, i) => {
    const groupGaps = models.slice(1, i + 1).filter((mm, j) => mm.g !== models[j]?.g).length;
    const cy = TOP + i * ROW_H + groupGaps * GAP_G + ROW_H / 2;
    const [bHi, bLo] =
      prec === "best"
        ? [serveBits(m), Math.min(serveBits(m), fourBits(m))]
        : [candidates(m, prec)[0] ?? m.bits, candidates(m, prec)[0] ?? m.bits];
    const nHi = memNeed(m, bHi, ctx, users, 1).total;
    const x1 = x(memNeed(m, bLo, ctx, users, 1).total);
    return { m, cy, nHi, x1, x2: Math.max(x(nHi), x1 + 4), x2bit: x(memNeed(m, P2, ctx, users, 1).total) };
  });
  const intro = fill(prec === "best" ? t.ch_best : t.ch_other, {
    ctx,
    users,
    u: users > 1 ? t.userN : t.user1,
  });

  return (
    <section className="flex flex-col gap-3.5">
      <h2 className="text-[clamp(22px,2.4vw,28px)] leading-[1.2] text-terracotta">{copy.chart.heading}</h2>
      <p className="max-w-[74ch] text-muted-ink">{intro}</p>
      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${W} ${height}`} role="img" aria-label={copy.chart.ariaLabel}>
          {TICKS.map((tick) => (
            <Fragment key={tick}>
              <line x1={x(tick)} y1={TOP - 6} x2={x(tick)} y2={height - 26} style={{ stroke: LINE }} strokeWidth={1} />
              <text x={x(tick)} y={height - 10} textAnchor="middle" fontSize={11} style={{ fill: MUTED }}>
                {tick >= 1024 ? `${tick / 1024} TB` : `${tick} GB`}
              </text>
            </Fragment>
          ))}
          {caps.map((c) => (
            <Fragment key={c.id}>
              <line
                x1={c.x}
                y1={TOP - 10}
                x2={c.x}
                y2={height - 26}
                style={{ stroke: WARN }}
                strokeWidth={1.2}
                strokeDasharray="3 3"
                opacity={0.85}
              />
              <text transform={`translate(${c.x + 3},${TOP - 14}) rotate(-42)`} fontSize={10.5} style={{ fill: WARN }}>
                {c.label}
              </text>
            </Fragment>
          ))}
          {rows.map(({ m, cy, nHi, x1, x2, x2bit }) => (
            <Fragment key={m.name}>
              <text x={LEFT - 10} y={cy + 4} textAnchor="end" fontSize={11.5} style={{ fill: INK }}>
                {m.name}
              </text>
              {prec === "best" && (
                <circle cx={x2bit} cy={cy} r={4} style={{ fill: "var(--color-paper)", stroke: ACCENT }} strokeWidth={1.5} />
              )}
              <rect x={x1} y={cy - 5} width={x2 - x1} height={10} rx={2} style={{ fill: ACCENT }} />
              <text x={x2 + 6} y={cy + 4} fontSize={10.5} style={{ fill: MUTED }}>
                {fmtGB(locale, nHi)}
              </text>
            </Fragment>
          ))}
        </svg>
      </div>
    </section>
  );
}
