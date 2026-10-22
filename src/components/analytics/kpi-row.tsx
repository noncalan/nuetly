import type { CSSProperties, ReactNode } from "react";
import { Delta, MonoDigits } from "@/components/dashboard/mono-digits";
import { cn } from "@/lib/cn";
import type { SectionKpi } from "@/lib/demo/analytics";
import { SECTIONS } from "@/lib/demo/topics";
import { formatClock, pluralRu } from "@/lib/format";

type Props = {
  sections: SectionKpi[];
  previousLabel: string | null;
  mocksTaken: number;
  diagnosticsTaken: number;
  avgSeconds: number;
  budgetSeconds: number;
  sourceLabel: string;
  className?: string;
  style?: CSSProperties;
};

export function KpiRow({
  sections,
  previousLabel,
  mocksTaken,
  diagnosticsTaken,
  avgSeconds,
  budgetSeconds,
  sourceLabel,
  className,
  style,
}: Props) {
  const diagnosticsHint = `и ${diagnosticsTaken} ${pluralRu(diagnosticsTaken, ["диагностика", "диагностики", "диагностик"])}`;

  return (
    <dl aria-label="Ключевые показатели" style={style} className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4", className)}>
      {sections.map(({ section, share, delta }) => (
        <Tile key={section} label={SECTIONS[section].title} value={`${share}%`}>
          {delta !== null && previousLabel ? (
            <>
              <Delta value={delta} />
              <span aria-hidden>
                {" "}
                п. п. <MonoDigits text={`к ${previousLabel}`} />
              </span>
            </>
          ) : (
            "первая попытка"
          )}
        </Tile>
      ))}
      <Tile label="Пробных пройдено" value={String(mocksTaken)}>
        {diagnosticsTaken > 0 && <MonoDigits text={diagnosticsHint} />}
      </Tile>
      <Tile label="Среднее на вопрос" value={formatClock(avgSeconds)}>
        <MonoDigits text={`бюджет ${formatClock(budgetSeconds)} · ${sourceLabel}`} />
      </Tile>
    </dl>
  );
}

type TileProps = { label: string; value: string; children?: ReactNode };

function Tile({ label, value, children }: TileProps) {
  return (
    <div className="min-w-0 rounded-xl border border-line bg-surface p-4 shadow-card sm:p-5">
      <dt className="truncate text-meta text-ink-2">{label}</dt>
      <dd className="mt-3 font-mono text-stat tabular-nums text-ink">{value}</dd>
      {children && <dd className="mt-2 text-caption text-ink-3">{children}</dd>}
    </div>
  );
}
