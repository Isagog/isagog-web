import { fill, type ToolStrings } from "@/lib/llm-sizing/copy";
import type { Hardware, LlmModel } from "@/lib/llm-sizing/data";
import { RAM_USABLE, type Evaluation, type Scenario } from "@/lib/llm-sizing/estimate";
import { fmtGB, fmtParams, fmtTps } from "@/lib/llm-sizing/format";
import type { Locale } from "@/lib/locale-href";
import styles from "./sizing.module.css";
import { RichText } from "./rich-text";

interface DetailPanelProps {
  t: ToolStrings;
  locale: Locale;
  model: LlmModel;
  hardware: Hardware;
  result: Evaluation;
  scenario: Scenario;
}

interface ReadoutProps {
  t: ToolStrings;
  locale: Locale;
  r: Evaluation;
  scenario: Scenario;
}

function statusText(t: ToolStrings, locale: Locale, r: Evaluation, h: Hardware, m: LlmModel, s: Scenario): string {
  const base =
    r.status === "fit"
      ? fill(t.st_fit, { label: r.label })
      : r.status === "tight"
        ? fill(t.st_tight, { label: r.label })
        : r.status === "offload"
          ? fill(t.st_off, { label: r.label, pct: Math.round(r.offFrac * 100) })
          : r.status === "nodes"
            ? fill(t.st_nodes, { n: r.nodes, label: r.label, gb: fmtGB(locale, r.need.total) })
            : fill(t.st_none, {
                gb: fmtGB(locale, r.need.total),
                label: r.label,
                usable: fmtGB(locale, r.usable),
                hint: h.offload && !s.offload ? t.st_hint : "",
              });
  return s.ctx > m.ctx ? base + fill(t.st_cap, { k: m.ctx }) : base;
}

function SpeedReadout({ t, locale, r, scenario }: ReadoutProps) {
  if (r.status === "nodes" || r.status === "none") {
    return <div className={styles.speed2}>{t.sp_none}</div>;
  }
  if (scenario.users > 1) {
    return (
      <>
        <div className={styles.speed}>
          {fmtTps(locale, r.agg)}
          <small>{t.sp_agg}</small>
        </div>
        <div className={styles.speed2}>
          {fill(t.sp_multi, {
            per: fmtTps(locale, r.perUser),
            users: scenario.users,
            bound: r.memBound ? t.b_bw : t.b_cp,
          })}
        </div>
      </>
    );
  }
  return (
    <>
      <div className={styles.speed}>
        {fmtTps(locale, r.perUser)}
        <small>{t.sp_one}</small>
      </div>
      <div className={styles.speed2}>
        {r.status === "offload" ? t.sp_ram : r.memBound ? t.sp_bwd : t.b_cp}
        {scenario.spec ? t.sp_spec : ""}
      </div>
    </>
  );
}

/** Memory bar: weights, KV cache and overhead against the usable capacity line. */
function MemoryBar({ t, locale, r, scenario }: ReadoutProps) {
  const n = r.need;
  const cap = r.status === "nodes" ? r.usable * r.nodes : r.usable;
  const scale = Math.max(n.total, cap) || 1;
  const pct = (v: number) => `${((v / scale) * 100).toFixed(2)}%`;
  const text = fill(t.mt, {
    w: fmtGB(locale, n.w),
    kv: fmtGB(locale, n.kv),
    ctx: n.ctx,
    users: scenario.users,
    o: fmtGB(locale, n.over),
    tot: fmtGB(locale, n.total),
    cap: fmtGB(locale, cap),
    across: r.status === "nodes" ? fill(t.mt_across, { n: r.nodes }) : "",
    ram: r.status === "offload" ? fill(t.mt_ram, { gb: RAM_USABLE }) : "",
  });

  return (
    <>
      <div className={styles.membar} aria-hidden="true">
        <span className={styles.barW} style={{ width: pct(n.w) }} />
        <span className={styles.barK} style={{ width: pct(n.kv) }} />
        <span className={styles.barO} style={{ width: pct(n.over) }} />
        <span className={styles.barCap} style={{ left: `calc(${pct(cap)} - 1px)` }} />
      </div>
      <div className={styles.memtext}>
        <RichText text={text} />
      </div>
    </>
  );
}

export function DetailPanel({ t, locale, model: m, hardware: h, result: r, scenario }: DetailPanelProps) {
  return (
    <div className={styles.detail} aria-live="polite">
      <div>
        <h3>
          {m.name} {t.on} {h.name}
        </h3>
        <p className={styles.status}>
          <RichText text={statusText(t, locale, r, h, m, scenario)} />
        </p>
        <SpeedReadout t={t} locale={locale} r={r} scenario={scenario} />
        <MemoryBar t={t} locale={locale} r={r} scenario={scenario} />
      </div>
      <div className={styles.notes}>
        <p>
          <span className={styles.lab}>
            {fill(t.lab_m, {
              maker: m.maker,
              total: fmtParams(locale, m.total),
              active: fmtParams(locale, m.active),
              rel: m.rel,
            })}
          </span>
          {m.note}
        </p>
        <p>
          <span className={styles.lab}>
            {h.name} · {fmtGB(locale, h.mem)} · {h.price}
          </span>
          {h.note}
        </p>
      </div>
    </div>
  );
}
