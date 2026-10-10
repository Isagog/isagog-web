import { fill, type ToolStrings } from "@/lib/llm-sizing/copy";
import type { Hardware, LlmModel } from "@/lib/llm-sizing/data";
import {
  bucket,
  candidates,
  fourBits,
  memNeed,
  precLabel,
  serveBits,
  type Evaluation,
  type Scenario,
} from "@/lib/llm-sizing/estimate";
import { fmtBW, fmtGB, fmtParams, fmtTps } from "@/lib/llm-sizing/format";
import type { Locale } from "@/lib/locale-href";
import { cn } from "@/lib/utils";
import { Fragment, type ReactNode } from "react";
import styles from "./sizing.module.css";

export interface Selection {
  m: number;
  h: number;
}

interface MatrixTableProps {
  t: ToolStrings;
  locale: Locale;
  models: readonly LlmModel[];
  hardware: readonly Hardware[];
  scenario: Scenario;
  /** evaluations[modelIndex][hardwareIndex] */
  evaluations: readonly (readonly Evaluation[])[];
  selected: Selection;
  onSelect: (selection: Selection) => void;
}

const startsGroup = <T extends { g: number }>(list: readonly T[], i: number): boolean =>
  i === 0 || list[i - 1]?.g !== list[i]?.g;

/** Short accessible description of one cell. */
function describeShort(t: ToolStrings, locale: Locale, r: Evaluation, users: number): string {
  if (r.status === "none") return fill(t.d_none, { gb: fmtGB(locale, r.need.total) });
  if (r.status === "nodes") return fill(t.d_nodes, { n: r.nodes });
  const v =
    users > 1
      ? fill(t.d_multi, { agg: fmtTps(locale, r.agg), per: fmtTps(locale, r.perUser) })
      : fill(t.d_single, { x: fmtTps(locale, r.perUser) });
  const s = r.status === "offload" ? t.d_off : r.status === "tight" ? t.d_tight : t.d_fit;
  return fill(t.d_join, { s, label: r.label, v });
}

/** The model's own memory need at 1 GPU: serving and 4-bit for best fit, else the chosen precision. */
function needText(locale: Locale, m: LlmModel, scenario: Scenario): string {
  const at = (bits: number) =>
    `${precLabel(m, bits)} ${fmtGB(locale, memNeed(m, bits, scenario.ctx, scenario.users, 1).total)}`;
  if (scenario.prec !== "best") return at(candidates(m, scenario.prec)[0] ?? m.bits);
  const s = serveBits(m);
  const fb = Math.min(s, fourBits(m));
  return Math.abs(s - fb) < 1e-6 ? at(s) : `${at(s)} · ${at(fb)}`;
}

function Cell({ t, locale, r, users }: { t: ToolStrings; locale: Locale; r: Evaluation; users: number }) {
  if (r.status === "none") return <span>—</span>;
  if (r.status === "nodes") return <span>{fill(t.nodes, { n: r.nodes })}</span>;
  const label: ReactNode = r.label === "Q2" ? <span className={styles.q2}>{t.q2}</span> : r.label;
  return (
    <>
      <span>{fmtTps(locale, users > 1 ? r.agg : r.perUser)}</span>
      <span className={styles.cellSub}>
        {users > 1 ? (
          <>
            {label} · {fmtTps(locale, r.perUser)}/u
          </>
        ) : (
          label
        )}
      </span>
    </>
  );
}

const cellClass = (r: Evaluation): string | undefined =>
  r.status === "none"
    ? styles.none
    : r.status === "nodes"
      ? styles.nodes
      : r.status === "offload"
        ? styles.offload
        : r.status === "tight"
          ? styles.tight
          : undefined;

const speedBucket = (r: Evaluation): number | undefined =>
  r.status === "fit" || r.status === "tight" ? bucket(r.perUser) : undefined;

export function MatrixTable({
  t,
  locale,
  models,
  hardware,
  scenario,
  evaluations,
  selected,
  onSelect,
}: MatrixTableProps) {
  const { users } = scenario;

  return (
    <div className={styles.matrixBlock}>
      <div className={styles.matrixWrap}>
        <table className={styles.matrix}>
          <thead>
            <tr className={styles.groups}>
              <th className={styles.corner} rowSpan={2}>
                {t.model}
                <br />
                <span className={styles.cornerSub}>{t.model_sub}</span>
              </th>
              {t.hwg.map((group, gi) => (
                <th key={group} className={styles.g} colSpan={hardware.filter((h) => h.g === gi).length}>
                  {group}
                </th>
              ))}
            </tr>
            <tr>
              {hardware.map((h, i) => (
                <th key={h.id} className={cn(startsGroup(hardware, i) && styles.gstart)} scope="col">
                  <div className={styles.hwh}>
                    <span className={styles.hwName}>{h.name}</span>
                    <span className={styles.hwMem}>{fmtGB(locale, h.mem)}</span>
                    <span className={styles.hwBw}>
                      {h.n > 1 ? `${h.n} × ${fmtBW(locale, h.bw)}` : fmtBW(locale, h.bw)}
                    </span>
                    <span className={styles.hwPrice}>{h.price}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((m, mi) => (
              <Fragment key={m.name}>
                {startsGroup(models, mi) && (
                  <tr className={styles.grp}>
                    <td colSpan={hardware.length + 1}>
                      <span className={styles.groupLabel}>{t.groups[m.g]}</span>
                    </td>
                  </tr>
                )}
                <tr>
                  <th className={styles.model} scope="row">
                    <span className={styles.modelName}>{m.name}</span>
                    <span className={styles.modelMeta}>
                      {fmtParams(locale, m.active)} {t.of} {fmtParams(locale, m.total)} ·{" "}
                      {m.moe ? t.moe : t.dense}
                    </span>
                    <span className={styles.modelNeed}>{needText(locale, m, scenario)}</span>
                  </th>
                  {hardware.map((h, hi) => {
                    const r = evaluations[mi]?.[hi];
                    if (!r) return <td key={h.id} />;
                    const aria = `${m.name} ${t.on} ${h.name}: ${describeShort(t, locale, r, users)}`;
                    const isSelected = selected.m === mi && selected.h === hi;
                    return (
                      <td key={h.id} className={cn(startsGroup(hardware, hi) && styles.gstart)}>
                        <button
                          type="button"
                          className={cn(styles.cell, cellClass(r), isSelected && styles.sel)}
                          data-b={speedBucket(r)}
                          aria-label={aria}
                          aria-pressed={isSelected}
                          title={aria}
                          onClick={() => onSelect({ m: mi, h: hi })}
                        >
                          <Cell t={t} locale={locale} r={r} users={users} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.caption}>
        {users > 1 ? fill(t.cap_multi, { users, ctx: scenario.ctx }) : fill(t.cap_single, { ctx: scenario.ctx })}
      </p>
    </div>
  );
}
