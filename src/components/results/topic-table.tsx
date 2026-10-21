import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { TopicScore } from "@/lib/demo/grading";
import { SECTION_IDS, SECTIONS } from "@/lib/demo/topics";
import { formatClock, percent } from "@/lib/format";

const WEAK_THRESHOLD = 50;
const COLUMN_COUNT = 4;

export function TopicTable({ topics }: { topics: TopicScore[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      {/* relative: keeps sr-only cells positioned inside the scroller, not the page */}
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[560px] text-body">
          <thead className="bg-subtle">
            <tr className="border-b border-line text-left text-caption text-ink-3">
              <th scope="col" className="py-2.5 pl-5 pr-4 font-medium">
                Тема
              </th>
              <th scope="col" className="py-2.5 pr-4 font-medium">
                Результат
              </th>
              <th scope="col" className="py-2.5 pr-4 text-right font-medium">
                Ср. время
              </th>
              <th scope="col" className="w-32 py-2.5 pr-5">
                <span className="sr-only">Действие</span>
              </th>
            </tr>
          </thead>
          {SECTION_IDS.map((sectionId) => {
            const rows = topics.filter((score) => score.topic.section === sectionId);
            if (rows.length === 0) return null;
            return (
              <tbody key={sectionId}>
                <tr className="border-b border-line">
                  <th scope="colgroup" colSpan={COLUMN_COUNT} className="pb-1.5 pl-5 pt-4 text-left text-caption text-ink-2">
                    {SECTIONS[sectionId].title}
                  </th>
                </tr>
                {rows.map((score) => (
                  <TopicRow key={score.topic.id} score={score} />
                ))}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}

function TopicRow({ score }: { score: TopicScore }) {
  const { topic, correct, total, avgSeconds } = score;
  const share = percent(correct, total);
  const isWeak = share < WEAK_THRESHOLD;

  return (
    <tr className="group border-b border-line transition-colors last:border-b-0 hover:bg-subtle">
      <th scope="row" className="py-3 pl-5 pr-4 text-left font-medium">
        <span className="flex items-center gap-2.5">
          <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", isWeak ? "bg-danger" : "bg-transparent")} />
          {topic.name}
          {isWeak && <span className="sr-only">, слабая тема</span>}
        </span>
      </th>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full", isWeak ? "bg-danger" : "bg-ink-3")} style={{ width: `${share}%` }} />
          </div>
          <span className="w-10 font-mono tabular-nums text-ink">
            {correct}/{total}
          </span>
          <span className="w-10 text-right font-mono tabular-nums text-ink-3">{share}%</span>
        </div>
      </td>
      <td className="py-3 pr-4 text-right font-mono tabular-nums text-ink-2">{formatClock(avgSeconds)}</td>
      <td className="py-3 pr-5 text-right">
        {isWeak && (
          <Link
            href="/dashboard"
            className={cn(
              "inline-flex items-center gap-1 rounded-md text-meta font-medium text-accent-text transition-opacity hover:underline",
              "md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100",
            )}
          >
            Тренировать
            <ArrowRight aria-hidden className="size-3.5" />
            <span className="sr-only">: {topic.name}</span>
          </Link>
        )}
      </td>
    </tr>
  );
}
