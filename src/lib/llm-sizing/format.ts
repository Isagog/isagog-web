import type { Locale } from "@/lib/locale-href";
import {
  HARDWARE,
  HARDWARE_NOTES_IT,
  MODEL_NOTES_IT,
  MODELS,
  ON_QUOTE,
  type Hardware,
  type LlmModel,
} from "./data";

/**
 * Number formatting and localisation for the sizing matrix. Italian uses a
 * decimal comma (1,6 TB); English a decimal point (1.6 TB).
 */

const decimal = (locale: Locale, s: string | number): string =>
  locale === "it" ? String(s).replace(".", ",") : String(s);

export function fmtGB(locale: Locale, gb: number): string {
  if (gb >= 1000) return `${decimal(locale, (gb / 1000).toFixed(gb >= 10000 ? 0 : 1))} TB`;
  if (gb >= 100) return `${Math.round(gb)} GB`;
  return `${decimal(locale, gb < 10 ? gb.toFixed(1) : Math.round(gb))} GB`;
}

export const fmtTps = (locale: Locale, v: number): string =>
  decimal(locale, v >= 10 ? String(Math.round(v)) : v >= 1 ? v.toFixed(1) : v.toFixed(2));

export const fmtBW = (locale: Locale, bw: number): string =>
  decimal(
    locale,
    bw >= 1000
      ? `${(bw / 1000).toFixed(bw % 1000 === 0 ? 0 : 2).replace(/\.?0+$/, "")} TB/s`
      : `${bw} GB/s`
  );

export const fmtParams = (locale: Locale, b: number): string =>
  decimal(
    locale,
    b >= 1000
      ? `${(b / 1000).toFixed(b % 1000 === 0 ? 0 : 1).replace(/\.0$/, "")}T`
      : `${b % 1 ? b.toFixed(1) : b}B`
  );

/** Models with notes in the page's language; names and specs stay as published. */
export const localizeModels = (locale: Locale): readonly LlmModel[] =>
  locale === "it" ? MODELS.map((m) => ({ ...m, note: MODEL_NOTES_IT[m.name] ?? m.note })) : MODELS;

/** Hardware with localised notes, prices and node names. */
export const localizeHardware = (locale: Locale, onQuote: string): readonly Hardware[] =>
  HARDWARE.map((h) => {
    const price = h.price === ON_QUOTE ? onQuote : h.price;
    if (locale !== "it") return { ...h, price };
    return {
      ...h,
      note: HARDWARE_NOTES_IT[h.id] ?? h.note,
      price: price.replace(/(\d)\.(\d)/g, "$1,$2"),
      name: h.name.replace(/^(8× \w+) node$/, "Nodo $1"),
    };
  });
