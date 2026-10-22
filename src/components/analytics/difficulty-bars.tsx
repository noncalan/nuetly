import type { CSSProperties } from "react";
import { MonoDigits } from "@/components/dashboard/mono-digits";
import { cn } from "@/lib/cn";
import type { DifficultyAccuracy } from "@/lib/demo/analytics";
import { ChartCard } from "./chart-card";
import { SrTable } from "./sr-table";

const FULL_SHARE = 100;

type Props = {
  bands: DifficultyAccuracy[];
  weakThreshold: number;
  sourceTitle: string;
  className?: string;
  style?: CSSProperties;
};

export function DifficultyBars({ bands, weakThreshold, sourceTitle, className, style }: Props) {
  return (
    <ChartCard
      id="difficulty"
      title="Точность по сложности"
      subtitle={<MonoDigits text={`${sourceTitle} · сложность задач по шкале 1–8`} />}
      className={className}
      style={style}
    >
      <ul aria-hidden className="space-y-5">
        {bands.map((band) => {
          const isWeak = band.share < weakThreshold;
          return (
            <li key={band.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-meta text-ink-2">
                  <MonoDigits text={`Сложность ${band.label}`} />
                  {isWeak && <span className="ml-2 text-caption text-danger">слабо</span>}
                </p>
                <p className="flex items-baseline gap-2 font-mono tabular-nums">
                  <span className="text-body font-medium text-ink">{band.share}%</span>
                  <span className="text-caption text-ink-3">
                    {band.correct}/{band.total}
                  </span>
                </p>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-[4px] bg-muted">
                <div
                  className={cn("ui-progress rounded-[4px]", isWeak ? "bg-danger" : "bg-accent")}
                  style={{ "--progress": band.share / FULL_SHARE } as CSSProperties}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-caption text-ink-3">Пропущенные вопросы считаются неверными.</p>

      <SrTable
        caption={`Доля верных ответов по сложности, ${sourceTitle}`}
        headers={["Сложность", "Доля верных", "Верно из"]}
        rows={bands.map((band) => [band.label, `${band.share}%`, `${band.correct} из ${band.total}`])}
      />
    </ChartCard>
  );
}
