import type { TrendPoint } from "@/lib/demo/analytics";
import type { SectionId } from "@/lib/demo/topics";

/** Gridlines (share of correct answers, %). */
export const GRID_VALUES = [25, 50, 75] as const;

/** Default visible range keeps all three gridlines inside the plot with air above and below. */
const DEFAULT_DOMAIN = { min: 20, max: 80 } as const;
const DOMAIN_STEP = 5;
const FULL = 100;
/** Horizontal inset of the first and last attempt, % of plot width (room for x labels). */
const X_INSET = 10;
/** Minimum vertical distance between the two end labels, % of plot height. */
const LABEL_MIN_GAP = 10;

export type Domain = { min: number; max: number };

export type SeriesSpec = {
  section: SectionId;
  label: string;
  /** Stroke class for the line and legend key. */
  stroke: string;
  /** Dash pattern in screen pixels (non-scaling stroke); undefined = solid. */
  dash?: string;
  marker: "circle" | "diamond";
};

/** Two series told apart by colour, dash and marker shape — never colour alone. */
export const SERIES: readonly SeriesSpec[] = [
  { section: "math", label: "Math", stroke: "stroke-accent", marker: "circle" },
  { section: "ct", label: "CT", stroke: "stroke-ink-2", dash: "6 4", marker: "diamond" },
];

export function domainOf(points: readonly TrendPoint[]): Domain {
  const values = points.flatMap((point) => SERIES.map((series) => point.values[series.section]));
  const low = Math.floor((Math.min(...values) - DOMAIN_STEP) / DOMAIN_STEP) * DOMAIN_STEP;
  const high = Math.ceil((Math.max(...values) + DOMAIN_STEP) / DOMAIN_STEP) * DOMAIN_STEP;
  return { min: Math.max(0, Math.min(DEFAULT_DOMAIN.min, low)), max: Math.min(FULL, Math.max(DEFAULT_DOMAIN.max, high)) };
}

/** Centre of attempt `index`, % of plot width. */
export function xPercent(index: number, count: number): number {
  if (count <= 1) return FULL / 2;
  return X_INSET + (index * (FULL - X_INSET * 2)) / (count - 1);
}

/** Top offset of a value, % of plot height (0 = top). */
export function yPercent(value: number, domain: Domain): number {
  return ((domain.max - value) / (domain.max - domain.min)) * FULL;
}

/** Column hit area around attempt `index`: [left, width] in % of plot width. */
export function columnOf(index: number, count: number): { left: number; width: number } {
  const center = xPercent(index, count);
  const half = count <= 1 ? FULL / 2 : (FULL - X_INSET * 2) / (count - 1) / 2;
  const left = Math.max(0, center - half);
  const right = Math.min(FULL, center + half);
  return { left, width: right - left };
}

/**
 * Pushes end-label positions apart so they never overlap, keeping their order.
 * Labels stay attached to their line ends when the lines are already far enough apart.
 */
export function spreadLabels(tops: readonly number[]): number[] {
  const order = tops.map((top, index) => ({ top, index })).sort((a, b) => a.top - b.top);
  const placed: number[] = [];
  order.forEach(({ top }, rank) => {
    const previous = placed[rank - 1];
    placed.push(previous === undefined ? top : Math.max(top, previous + LABEL_MIN_GAP));
  });
  const result = [...tops];
  order.forEach(({ index }, rank) => {
    result[index] = placed[rank];
  });
  return result;
}

export function polylinePoints(points: readonly TrendPoint[], section: SectionId, domain: Domain): string {
  return points
    .map((point, index) => `${xPercent(index, points.length)},${yPercent(point.values[section], domain)}`)
    .join(" ");
}
