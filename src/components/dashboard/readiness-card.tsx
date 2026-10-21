import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { HISTORY, sectionDeltaAt } from "@/lib/demo/student";
import { SECTION_IDS, SECTIONS } from "@/lib/demo/topics";
import { percent, pluralRu } from "@/lib/format";
import { Delta, MonoDigits } from "./mono-digits";

const SPARK_WIDTH = 120;
const SPARK_HEIGHT = 40;
const SPARK_PAD = 4;
/** Headroom above/below the series so flat lines don't hug the edges, in percentage points. */
const SPARK_HEADROOM = 5;

type Point = { x: number; y: number };

function toPoints(values: number[]): Point[] {
  const min = Math.min(...values) - SPARK_HEADROOM;
  const max = Math.max(...values) + SPARK_HEADROOM;
  const step = (SPARK_WIDTH - SPARK_PAD * 2) / Math.max(1, values.length - 1);
  return values.map((value, index) => ({
    x: SPARK_PAD + index * step,
    y: SPARK_HEIGHT - SPARK_PAD - ((value - min) / (max - min)) * (SPARK_HEIGHT - SPARK_PAD * 2),
  }));
}

/** History in ink-3; only the latest step (and dot) is accent, so "now" reads first. */
function Sparkline({ values }: { values: number[] }) {
  const points = toPoints(values);
  const last = points[points.length - 1];
  const beforeLast = points[points.length - 2] ?? last;
  const history = points.slice(0, -1);

  return (
    <svg width={SPARK_WIDTH} height={SPARK_HEIGHT} viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`} aria-hidden className="shrink-0">
      <polyline
        points={history.map((point) => `${point.x},${point.y}`).join(" ")}
        fill="none"
        className="stroke-ink-3"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line x1={beforeLast.x} y1={beforeLast.y} x2={last.x} y2={last.y} className="stroke-accent" strokeWidth={2} strokeLinecap="round" />
      {history.map((point) => (
        <circle key={point.x} cx={point.x} cy={point.y} r={2} className="fill-surface stroke-ink-3" strokeWidth={1.5} />
      ))}
      <circle cx={last.x} cy={last.y} r={3.5} className="fill-accent" />
    </svg>
  );
}

type Props = { className?: string; style?: CSSProperties };

export function ReadinessCard({ className, style }: Props) {
  const lastIndex = HISTORY.length - 1;
  const attemptsLabel = `${HISTORY.length} ${pluralRu(HISTORY.length, ["попытка", "попытки", "попыток"])}`;

  return (
    <section
      style={style}
      aria-labelledby="readiness-title"
      className={cn("flex flex-col rounded-xl border border-line bg-surface p-5 shadow-card", className)}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="readiness-title" className="text-h2 text-ink">
          Готовность по разделам
        </h2>
        <MonoDigits text={attemptsLabel} className="text-caption text-ink-3" />
      </div>

      <ul className="mt-1 flex-1 divide-y divide-line">
        {SECTION_IDS.map((sectionId) => {
          const series = HISTORY.map((entry) => percent(entry[sectionId].correct, entry[sectionId].total));
          const current = series[series.length - 1];
          const delta = sectionDeltaAt(lastIndex, sectionId);
          return (
            <li key={sectionId} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-meta text-ink-2">{SECTIONS[sectionId].title}</p>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-stat tabular-nums text-ink">{current}%</span>
                  {delta !== null && <Delta value={delta} className="text-meta" />}
                </p>
              </div>
              <Sparkline values={series} />
            </li>
          );
        })}
      </ul>

      <p className="border-t border-line pt-3 text-caption text-ink-3">
        Доля верных ответов в пробных и диагностике — не официальный балл NUET.
      </p>
    </section>
  );
}
