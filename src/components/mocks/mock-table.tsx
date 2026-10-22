import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { MockEntry, MockStatus } from "@/lib/demo/mocks";
import type { Score } from "@/lib/demo/student";
import { formatDuration, percent } from "@/lib/format";

const STATUS: Record<MockStatus, { label: string; className: string }> = {
  done: { label: "пройден", className: "bg-accent-soft text-accent-text" },
  available: { label: "доступен", className: "border border-accent text-accent-text" },
  scheduled: { label: "скоро", className: "bg-muted text-ink-3" },
};

function ScoreCell({ score }: { score?: Score }) {
  if (!score) return <span className="text-ink-3">—</span>;
  return (
    <span className="font-mono tabular-nums text-ink">
      {score.correct}
      <span className="text-ink-3">/{score.total}</span>
    </span>
  );
}

function totalShare(mock: MockEntry): number | null {
  if (!mock.result) return null;
  const { math, ct } = mock.result;
  return percent(math.correct + ct.correct, math.total + ct.total);
}

type Props = { mocks: MockEntry[]; className?: string; style?: CSSProperties };

export function MockTable({ mocks, className, style }: Props) {
  return (
    <section aria-labelledby="mock-list-title" className={className} style={style}>
      <h2 id="mock-list-title" className="text-h2 text-ink">
        Все пробные
      </h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[640px] text-body">
            <thead className="bg-subtle">
              <tr className="border-b border-line text-left text-caption text-ink-3">
                <th scope="col" className="py-2.5 pl-5 pr-4 font-medium">
                  Пробный
                </th>
                <th scope="col" className="py-2.5 pr-4 font-medium">
                  Статус
                </th>
                <th scope="col" className="py-2.5 pr-4 font-medium">
                  Math
                </th>
                <th scope="col" className="py-2.5 pr-4 font-medium">
                  CT
                </th>
                <th scope="col" className="py-2.5 pr-4 font-medium">
                  Итог
                </th>
                <th scope="col" className="py-2.5 pr-5 text-right font-medium">
                  <span className="sr-only">Действие</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {mocks.map((mock) => (
                <MockRow key={mock.id} mock={mock} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function MockRow({ mock }: { mock: MockEntry }) {
  const status = STATUS[mock.status];
  const share = totalShare(mock);
  const isScheduled = mock.status === "scheduled";

  return (
    <tr className={cn("transition-colors", isScheduled ? "text-ink-3" : "hover:bg-subtle")}>
      <th scope="row" className="py-3 pl-5 pr-4 text-left font-normal">
        <p className={cn("font-medium", isScheduled ? "text-ink-3" : "text-ink")}>{mock.title}</p>
        <p className="mt-0.5 text-meta text-ink-3">
          {mock.focus}
          {mock.result && (
            <>
              {" · "}
              {mock.result.dateLabel} · {formatDuration(mock.result.durationSec)}
            </>
          )}
        </p>
      </th>
      <td className="py-3 pr-4">
        <span className={cn("inline-flex rounded-md px-1.5 py-0.5 text-caption", status.className)}>{status.label}</span>
      </td>
      <td className="py-3 pr-4">
        <ScoreCell score={mock.result?.math} />
      </td>
      <td className="py-3 pr-4">
        <ScoreCell score={mock.result?.ct} />
      </td>
      <td className="py-3 pr-4">
        {share === null ? (
          <span className="text-ink-3">—</span>
        ) : (
          <span className="font-mono tabular-nums font-medium text-ink">{share}%</span>
        )}
      </td>
      <td className="py-3 pr-5 text-right">
        <RowAction mock={mock} />
      </td>
    </tr>
  );
}

function RowAction({ mock }: { mock: MockEntry }) {
  if (!mock.href) return null;
  const label = mock.status === "available" ? "Начать" : "Разбор";
  return (
    <Link
      href={mock.href}
      className="inline-flex min-h-6 items-center gap-1 whitespace-nowrap rounded-md text-meta font-medium text-accent-text hover:underline pointer-coarse:min-h-11"
    >
      {label}
      <ArrowRight aria-hidden className="size-3.5" />
      <span className="sr-only">: {mock.title}</span>
    </Link>
  );
}
