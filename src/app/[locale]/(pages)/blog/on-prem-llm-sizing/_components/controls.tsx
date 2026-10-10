import type { SizingCopy } from "@/lib/llm-sizing/copy";
import type { Precision, Scenario } from "@/lib/llm-sizing/estimate";
import { cn } from "@/lib/utils";
import { useId } from "react";
import styles from "./sizing.module.css";

const PRECISIONS: readonly Precision[] = ["best", "rel", "8", "4", "2"];
const CONTEXTS = [8, 32, 128] as const;
const USERS = [1, 8, 32] as const;

interface Option<T> {
  value: T;
  label: string;
  title?: string;
}

interface SegmentedProps<T> {
  label: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** A labelled single-choice button group (role="radiogroup"), as on the original page. */
function Segmented<T extends string | number>({ label, options, value, onChange }: SegmentedProps<T>) {
  const labelId = useId();
  return (
    <div className={styles.ctl}>
      <span className={styles.ctlLabel} id={labelId}>
        {label}
      </span>
      <div className={styles.seg} role="radiogroup" aria-labelledby={labelId}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={option.value === value}
            title={option.title}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ControlsProps {
  copy: SizingCopy["controls"];
  scenario: Scenario;
  /** Receives only the changed fields, so rapid successive changes compose. */
  onChange: (patch: Partial<Scenario>) => void;
}

export function Controls({ copy, scenario, onChange }: ControlsProps) {
  const set =
    <K extends keyof Scenario>(key: K) =>
    (value: Scenario[K]) =>
      onChange({ [key]: value });

  return (
    <div className={styles.controls} role="group" aria-label={copy.ariaLabel}>
      <Segmented
        label={copy.precision}
        options={PRECISIONS.map((value) => ({ value, ...copy.precisionOptions[value] }))}
        value={scenario.prec}
        onChange={set("prec")}
      />
      <Segmented
        label={copy.context}
        options={CONTEXTS.map((value) => ({ value, label: `${value}K` }))}
        value={scenario.ctx}
        onChange={set("ctx")}
      />
      <Segmented
        label={copy.users}
        options={USERS.map((value) => ({ value, label: String(value) }))}
        value={scenario.users}
        onChange={set("users")}
      />
      <div className={styles.toggles}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={scenario.offload}
            onChange={(e) => onChange({ offload: e.target.checked })}
          />{" "}
          {copy.offload.label} <small>{copy.offload.hint}</small>
        </label>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={scenario.spec}
            onChange={(e) => onChange({ spec: e.target.checked })}
          />{" "}
          {copy.spec.label} <small>{copy.spec.hint}</small>
        </label>
      </div>
    </div>
  );
}

const RAMP = [
  { label: "<5", bg: "var(--s1)", ink: "var(--s1-ink)" },
  { label: "5–15", bg: "var(--s2)", ink: "var(--s2-ink)" },
  { label: "15–40", bg: "var(--s3)", ink: "var(--s3-ink)" },
  { label: "40–100", bg: "var(--s4)", ink: "var(--s4-ink)" },
  { label: "100+", bg: "var(--s5)", ink: "var(--s5-ink)" },
] as const;

export function Legend({ copy }: { copy: SizingCopy["legend"] }) {
  return (
    <div className={styles.legend} role="group" aria-label={copy.ariaLabel}>
      <span className={styles.ramp} role="group" aria-label={copy.rampLabel}>
        {RAMP.map((band) => (
          <span key={band.label} style={{ background: band.bg, color: band.ink }}>
            {band.label}
          </span>
        ))}
      </span>
      <span>{copy.unit}</span>
      <span className={styles.key}>
        <span className={cn(styles.sw, styles.swTight)} aria-hidden="true" />
        {copy.tight}
      </span>
      <span className={styles.key}>
        <span className={cn(styles.sw, styles.swOff)} aria-hidden="true" />
        {copy.offload}
      </span>
      <span className={styles.key}>
        <span className={cn(styles.sw, styles.swQ2)} aria-hidden="true" />
        {copy.q2}
      </span>
      <span className={styles.key}>
        <span className={cn(styles.sw, styles.swNone)} aria-hidden="true" />
        {copy.none}
      </span>
      <span className={styles.key}>
        <b>{copy.nodesSample}</b>
        {copy.nodes}
      </span>
    </div>
  );
}
