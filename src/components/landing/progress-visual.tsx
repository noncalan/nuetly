import { cn } from "@/lib/cn";
import { Illustration } from "./landing-primitives";

/** Demo countdown — counted to the exam date the student enters, not an official NU date. */
const DAYS_LEFT = 64;

type Attempt = { label: string; share: number };

const ATTEMPTS: readonly Attempt[] = [
  { label: "Диагн.", share: 61 },
  { label: "№1", share: 63 },
  { label: "№2", share: 67 },
  { label: "№3", share: 70 },
  { label: "№4", share: 73 },
];

const CHART_WIDTH = 300;
const CHART_HEIGHT = 120;
const CHART_PAD = 10;
const Y_MIN = 50;
const Y_MAX = 80;
const GRID_LINES: readonly number[] = [50, 60, 70, 80];

const FIRST = ATTEMPTS[0];
const LAST = ATTEMPTS[ATTEMPTS.length - 1];
const DELTA = LAST.share - FIRST.share;

/** Points sit at the column centres, so they line up with the label grid below. */
function x(index: number): number {
  return ((index + 0.5) / ATTEMPTS.length) * CHART_WIDTH;
}

function y(share: number): number {
  return CHART_PAD + (1 - (share - Y_MIN) / (Y_MAX - Y_MIN)) * (CHART_HEIGHT - CHART_PAD * 2);
}

const LINE_POINTS = ATTEMPTS.map((attempt, index) => `${x(index)},${y(attempt.share)}`).join(" ");

/** Countdown number next to a sparkline of the Mathematics share across attempts. */
export function ProgressVisual() {
  return (
    <Illustration
      label={`Прогресс: ${DAYS_LEFT} дня до экзамена, доля верных по математике выросла с ${FIRST.share} до ${LAST.share} процентов за пять попыток`}
    >
      <div className="grid gap-6 rounded-xl border border-line bg-surface p-5 shadow-card sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8 sm:p-6">
        <div>
          <p className="text-h2 text-ink">До NUET</p>
          <p className="mt-4 flex items-baseline gap-3">
            <span className="font-mono text-display tabular-nums text-accent-text">{DAYS_LEFT}</span>
            <span className="text-h1 font-medium text-ink-2">дня</span>
          </p>
          <p className="mt-4 text-caption text-ink-3">дата из твоего профиля</p>
        </div>

        <div className="min-w-0 border-t border-line pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-meta font-medium text-ink">Mathematics, доля верных</p>
            <p className="text-meta font-medium text-success-ink">
              <span className="font-mono tabular-nums">+{DELTA}</span> п.п.
            </p>
          </div>
          <Sparkline />
        </div>
      </div>
    </Illustration>
  );
}

function Sparkline() {
  const lastIndex = ATTEMPTS.length - 1;
  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="h-auto w-full overflow-visible">
        {GRID_LINES.map((value) => (
          <line
            key={value}
            x1={0}
            x2={CHART_WIDTH}
            y1={y(value)}
            y2={y(value)}
            className="stroke-line"
            strokeDasharray={value === Y_MIN ? undefined : "2 4"}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <polyline
          points={LINE_POINTS}
          fill="none"
          className="stroke-accent"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {ATTEMPTS.map((attempt, index) => (
          <circle
            key={attempt.label}
            cx={x(index)}
            cy={y(attempt.share)}
            r={index === lastIndex ? 5 : 3.5}
            className={cn(index === lastIndex ? "fill-accent stroke-surface" : "fill-surface stroke-accent")}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <ol className="mt-2 grid grid-cols-5 text-center">
        {ATTEMPTS.map((attempt, index) => (
          <li key={attempt.label}>
            <span className={cn("block font-mono text-meta tabular-nums", index === lastIndex ? "text-ink" : "text-ink-3")}>
              {attempt.share}%
            </span>
            <span className="mt-0.5 block text-caption text-ink-3">{attempt.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
