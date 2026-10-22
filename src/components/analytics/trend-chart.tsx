"use client";

import { useState } from "react";
import { MonoDigits } from "@/components/dashboard/mono-digits";
import { cn } from "@/lib/cn";
import type { TrendPoint } from "@/lib/demo/analytics";
import { SECTIONS } from "@/lib/demo/topics";
import { SrTable } from "./sr-table";
import {
  GRID_VALUES,
  SERIES,
  columnOf,
  domainOf,
  polylinePoints,
  spreadLabels,
  xPercent,
  yPercent,
  type Domain,
  type SeriesSpec,
} from "./trend-scale";

/** Plot height: fixed in px so text stays readable while the width scales with the card. */
const PLOT_HEIGHT = "h-[200px] sm:h-[240px]";
const LINE_WIDTH = 2;
const KEY_WIDTH = 20;
const KEY_HEIGHT = 8;

type Props = { points: TrendPoint[] };

export function TrendChart({ points }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const domain = domainOf(points);
  const lastIndex = points.length - 1;
  const shown = points[activeIndex ?? lastIndex];
  const endTops = spreadLabels(SERIES.map((series) => yPercent(points[lastIndex].values[series.section], domain)));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <Legend />
        <p aria-hidden className="min-w-0 truncate text-meta text-ink-2">
          <span className="text-ink">{shown.title}</span> · <MonoDigits text={shown.dateLabel} />
          {SERIES.map((series) => (
            <span key={series.section}>
              {" "}
              · {series.label} <span className="font-mono font-medium tabular-nums text-ink">{shown.values[series.section]}%</span>
            </span>
          ))}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-[32px_minmax(0,1fr)_64px] gap-x-2">
        <YAxis domain={domain} />

        <div className={cn("relative", PLOT_HEIGHT)} onMouseLeave={() => setActiveIndex(null)}>
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            {GRID_VALUES.map((value) => {
              const y = yPercent(value, domain);
              return <line key={value} x1={0} x2={100} y1={y} y2={y} className="stroke-line" strokeWidth={1} vectorEffect="non-scaling-stroke" />;
            })}
            {activeIndex !== null && (
              <line
                x1={xPercent(activeIndex, points.length)}
                x2={xPercent(activeIndex, points.length)}
                y1={0}
                y2={100}
                className="stroke-line-strong"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            )}
            {SERIES.map((series) => (
              <polyline
                key={series.section}
                points={polylinePoints(points, series.section, domain)}
                fill="none"
                className={series.stroke}
                strokeWidth={LINE_WIDTH}
                strokeDasharray={series.dash}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {points.map((point, index) =>
            SERIES.map((series) => (
              <Marker
                key={`${point.id}-${series.section}`}
                series={series}
                left={xPercent(index, points.length)}
                top={yPercent(point.values[series.section], domain)}
                isActive={index === activeIndex}
              />
            )),
          )}

          {points.map((point, index) => {
            const column = columnOf(index, points.length);
            return (
              <button
                key={point.id}
                type="button"
                aria-label={`${point.title}, ${point.dateLabel}: ${SERIES.map(
                  (series) => `${series.label} ${point.values[series.section]}%`,
                ).join(", ")}`}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                className="absolute inset-y-0 cursor-default rounded-md focus-visible:outline-offset-0"
                style={{ left: `${column.left}%`, width: `${column.width}%` }}
              />
            );
          })}
        </div>

        <div aria-hidden className={cn("relative", PLOT_HEIGHT)}>
          {SERIES.map((series, index) => (
            <span
              key={series.section}
              className="absolute left-0 -translate-y-1/2 whitespace-nowrap text-meta text-ink-2"
              style={{ top: `${endTops[index]}%` }}
            >
              {series.label}{" "}
              <span className="font-mono font-medium tabular-nums text-ink">{points[lastIndex].values[series.section]}%</span>
            </span>
          ))}
        </div>

        <XAxis points={points} activeIndex={activeIndex} />
      </div>

      <SrTable
        caption="Доля верных ответов по попыткам, %"
        headers={["Попытка", "Дата", ...SERIES.map((series) => series.label)]}
        rows={points.map((point) => [
          point.title,
          point.dateLabel,
          ...SERIES.map((series) => `${point.values[series.section]}%`),
        ])}
      />
    </div>
  );
}

function YAxis({ domain }: { domain: Domain }) {
  return (
    <div aria-hidden className={cn("relative", PLOT_HEIGHT)}>
      {GRID_VALUES.map((value) => (
        <span
          key={value}
          className="absolute right-0 -translate-y-1/2 font-mono text-caption tabular-nums text-ink-3"
          style={{ top: `${yPercent(value, domain)}%` }}
        >
          {value}%
        </span>
      ))}
    </div>
  );
}

function XAxis({ points, activeIndex }: { points: TrendPoint[]; activeIndex: number | null }) {
  return (
    <div aria-hidden className="relative col-start-2 mt-2 h-9">
      {points.map((point, index) => (
        <span
          key={point.id}
          className="absolute top-0 flex -translate-x-1/2 flex-col items-center whitespace-nowrap text-caption leading-4"
          style={{ left: `${xPercent(index, points.length)}%` }}
        >
          <span className={cn("transition-colors", index === activeIndex ? "text-ink" : "text-ink-2")}>
            <MonoDigits text={point.shortLabel} />
          </span>
          <MonoDigits text={point.dateLabel} className="text-ink-3" />
        </span>
      ))}
    </div>
  );
}

type MarkerProps = { series: SeriesSpec; left: number; top: number; isActive: boolean };

/** HTML marker so it stays round at any plot width; 2px surface ring keeps it legible over the other line. */
function Marker({ series, left, top, isActive }: MarkerProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 ring-2 ring-surface transition-transform duration-150 ease-out",
        series.marker === "circle" ? "size-2.5 rounded-full bg-accent" : "size-2 rotate-45 rounded-[1px] bg-ink-2",
        isActive && "scale-150",
      )}
      style={{ left: `${left}%`, top: `${top}%` }}
    />
  );
}

function Legend() {
  return (
    <ul aria-label="Обозначения" className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-ink-2">
      {SERIES.map((series) => (
        <li key={series.section} className="flex items-center gap-1.5">
          <svg aria-hidden width={KEY_WIDTH} height={KEY_HEIGHT} viewBox={`0 0 ${KEY_WIDTH} ${KEY_HEIGHT}`}>
            <line
              x1={1}
              x2={KEY_WIDTH - 1}
              y1={KEY_HEIGHT / 2}
              y2={KEY_HEIGHT / 2}
              className={series.stroke}
              strokeWidth={LINE_WIDTH}
              strokeDasharray={series.dash === undefined ? undefined : "4 3"}
              strokeLinecap="round"
            />
          </svg>
          {SECTIONS[series.section].title}
        </li>
      ))}
    </ul>
  );
}
