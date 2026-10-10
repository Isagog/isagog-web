"use client";

import type { SizingCopy } from "@/lib/llm-sizing/copy";
import type { Hardware, LlmModel } from "@/lib/llm-sizing/data";
import { evaluate, type Scenario } from "@/lib/llm-sizing/estimate";
import type { Locale } from "@/lib/locale-href";
import { useMemo, useState } from "react";
import { Controls, Legend } from "./controls";
import { DetailPanel } from "./detail-panel";
import { FootprintChart } from "./footprint-chart";
import { MatrixTable, type Selection } from "./matrix-table";
import styles from "./sizing.module.css";

const INITIAL_SCENARIO: Scenario = { prec: "best", ctx: 32, users: 1, offload: true, spec: false };
/** gpt-oss-120b on DGX Spark, as on the original page. */
const INITIAL_SELECTION: Selection = { m: 13, h: 4 };

interface SizingToolProps {
  locale: Locale;
  copy: SizingCopy;
  models: readonly LlmModel[];
  hardware: readonly Hardware[];
}

/**
 * The interactive part of the sizing page: scenario controls, the model ×
 * hardware matrix, the selected cell's breakdown and the footprint chart.
 * Rendered on the server with the initial scenario, then re-evaluated on
 * every change.
 */
export function SizingTool({ locale, copy, models, hardware }: SizingToolProps) {
  const [scenario, setScenario] = useState(INITIAL_SCENARIO);
  const [selected, setSelected] = useState(INITIAL_SELECTION);
  const evaluations = useMemo(
    () => models.map((m) => hardware.map((h) => evaluate(m, h, scenario))),
    [models, hardware, scenario]
  );

  const model = models[selected.m];
  const hw = hardware[selected.h];
  const result = evaluations[selected.m]?.[selected.h];

  return (
    <div className={styles.root}>
      <Controls
        copy={copy.controls}
        scenario={scenario}
        onChange={(patch) => setScenario((current) => ({ ...current, ...patch }))}
      />
      <Legend copy={copy.legend} />
      <MatrixTable
        t={copy.tool}
        locale={locale}
        models={models}
        hardware={hardware}
        scenario={scenario}
        evaluations={evaluations}
        selected={selected}
        onSelect={setSelected}
      />
      {model && hw && result && (
        <DetailPanel t={copy.tool} locale={locale} model={model} hardware={hw} result={result} scenario={scenario} />
      )}
      <FootprintChart copy={copy} locale={locale} models={models} hardware={hardware} scenario={scenario} />
    </div>
  );
}
