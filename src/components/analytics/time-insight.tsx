import type { CSSProperties } from "react";
import { MonoDigits } from "@/components/dashboard/mono-digits";
import { cn } from "@/lib/cn";
import type { SectionTime } from "@/lib/demo/analytics";
import { SECTIONS } from "@/lib/demo/topics";
import { formatClock, pluralRu } from "@/lib/format";
import { ChartCard } from "./chart-card";
import { SrTable } from "./sr-table";

/** The time axis always shows at least 3 minutes so a 2-minute average sits mid-track. */
const MIN_SCALE_SECONDS = 180;
const SCALE_HEADROOM = 1.15;
const FULL = 100;

type Props = {
  times: SectionTime[];
  fastMistakes: number;
  fastThresholdSeconds: number;
  takeaway: string;
  sourceTitle: string;
  className?: string;
  style?: CSSProperties;
};

export function TimeInsight({ times, fastMistakes, fastThresholdSeconds, takeaway, sourceTitle, className, style }: Props) {
  const scaleMax = Math.max(MIN_SCALE_SECONDS, ...times.map((time) => time.avgSeconds * SCALE_HEADROOM));
  const toPercent = (seconds: number) => (seconds / scaleMax) * FULL;
  const first = times[0];
  const budget = first?.budgetSeconds ?? 0;
  const budgetSource = first
    ? `${SECTIONS[first.section].minutes} минут на ${SECTIONS[first.section].questionCount} вопросов`
    : "";
  const fastLabel = `${pluralRu(fastMistakes, ["ошибка", "ошибки", "ошибок"])} быстрее ${fastThresholdSeconds} с`;

  return (
    <ChartCard
      id="time"
      title="Время на вопрос"
      subtitle={<MonoDigits text={`${sourceTitle} · среднее по отвеченным вопросам`} />}
      className={className}
      style={style}
    >
      <ul aria-hidden className="space-y-5">
        {times.map((time) => (
          <li key={time.section}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-meta text-ink-2">{SECTIONS[time.section].title}</p>
              <p className="font-mono text-body font-medium tabular-nums text-ink">{formatClock(time.avgSeconds)}</p>
            </div>
            <div className="relative mt-2">
              <div className="h-2.5 overflow-hidden rounded-[4px] bg-muted">
                <div
                  className="ui-progress rounded-[4px] bg-accent"
                  style={{ "--progress": toPercent(time.avgSeconds) / FULL } as CSSProperties}
                />
              </div>
              <span
                className="absolute -inset-y-1 w-0.5 -translate-x-1/2 rounded-full bg-ink ring-2 ring-surface"
                style={{ left: `${toPercent(time.budgetSeconds)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <p aria-hidden className="mt-3 flex items-center gap-1.5 text-caption text-ink-3">
        <span className="h-3 w-0.5 rounded-full bg-ink" />
        <MonoDigits text={`бюджет ${formatClock(budget)} на вопрос — ${budgetSource}`} />
      </p>

      <div className="mt-5 flex items-baseline gap-3 border-t border-line pt-4">
        <span className={cn("font-mono text-stat tabular-nums", fastMistakes > 0 ? "text-danger" : "text-ink")}>
          {fastMistakes}
        </span>
        <span className="min-w-0 text-meta text-ink-2">
          <MonoDigits text={fastLabel} />
          <span className="block text-caption text-ink-3">
            <MonoDigits
              text={times.map((time) => `${SECTIONS[time.section].short} ${time.fastMistakes}`).join(" · ")}
            />
          </span>
        </span>
      </div>

      <p className="mt-4 rounded-lg bg-subtle px-3 py-2.5 text-body text-ink">
        <MonoDigits text={takeaway} />
      </p>

      <SrTable
        caption={`Среднее время на вопрос по разделам, ${sourceTitle}`}
        headers={["Раздел", "Среднее время", "Бюджет", `Ошибки быстрее ${fastThresholdSeconds} с`]}
        rows={times.map((time) => [
          SECTIONS[time.section].title,
          formatClock(time.avgSeconds),
          formatClock(time.budgetSeconds),
          String(time.fastMistakes),
        ])}
      />
    </ChartCard>
  );
}
