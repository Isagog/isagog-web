import { runCalibration } from "@/lib/llm-sizing/calibration";
import type { ToolStrings } from "@/lib/llm-sizing/copy";
import type { Hardware } from "@/lib/llm-sizing/data";
import { fmtTps } from "@/lib/llm-sizing/format";
import type { Locale } from "@/lib/locale-href";
import { cn } from "@/lib/utils";
import styles from "./sizing.module.css";

interface CalibrationTableProps {
  t: ToolStrings;
  locale: Locale;
  hardware: readonly Hardware[];
}

/** Estimates against published measurements; static, so rendered on the server. */
export function CalibrationTable({ t, locale, hardware }: CalibrationTableProps) {
  const [hConfig, hHardware, hMeasured, hEstimate, hAgreement, hSource] = t.cal_h;

  return (
    <div className={styles.calWrap}>
      <table className={styles.cal}>
        <thead>
          <tr>
            <th>{hConfig}</th>
            <th>{hHardware}</th>
            <th className={styles.num}>{hMeasured}</th>
            <th className={styles.num}>{hEstimate}</th>
            <th>{hAgreement}</th>
            <th>{hSource}</th>
          </tr>
        </thead>
        <tbody>
          {runCalibration(hardware).map(({ row, hardware: h, estimate, deviation, agrees }, i) => (
            <tr key={t.cal_labels[i]}>
              <td>{t.cal_labels[i]}</td>
              <td>{h.name}</td>
              <td className={styles.num}>
                {"meas" in row ? fmtTps(locale, row.meas) : `${row.measLo}–${row.measHi}`} tok/s
              </td>
              <td className={styles.num}>
                {fmtTps(locale, estimate)} tok/s{row.users > 1 ? t.agg_abbr : ""}
              </td>
              <td>
                <span className={cn(styles.pill, agrees ? styles.pillOk : styles.pillMeh)}>
                  {deviation === undefined
                    ? agrees
                      ? t.in_range
                      : t.out_range
                    : `${deviation >= 0 ? "+" : "−"}${Math.abs(Math.round(deviation * 100))}%`}
                </span>
              </td>
              <td>{t.cal_src[i]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
