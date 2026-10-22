import { ArrowRight, Clock, ListChecks } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { MockEntry } from "@/lib/demo/mocks";
import { pluralRu } from "@/lib/format";

const MINUTES_PER_HOUR = 60;

/** 120 → "2:00:00" */
function formatHours(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  return `${hours}:${String(minutes).padStart(2, "0")}:00`;
}

type Props = { mock: MockEntry; className?: string; style?: CSSProperties };

export function NextMockCard({ mock, className, style }: Props) {
  return (
    <section
      aria-labelledby="next-mock-title"
      style={style}
      className={cn(
        "grid gap-6 rounded-xl border border-line bg-surface p-6 shadow-card sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-caption text-ink-3">Следующий пробный</p>
        <h2 id="next-mock-title" className="mt-2 text-h1 text-ink">
          {mock.title}
        </h2>
        <p className="mt-2 text-body text-ink-2">{mock.focus}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-meta text-ink-2">
          <li className="flex items-center gap-1.5">
            <ListChecks aria-hidden className="size-4 text-ink-3" strokeWidth={1.75} />
            <span className="font-mono tabular-nums text-ink">{mock.questionCount}</span>{" "}
            {pluralRu(mock.questionCount, ["вопрос", "вопроса", "вопросов"])}
          </li>
          <li className="flex items-center gap-1.5">
            <Clock aria-hidden className="size-4 text-ink-3" strokeWidth={1.75} />2 раздела по{" "}
            <span className="font-mono tabular-nums text-ink">60</span> мин
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:items-end sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
        <p className="font-mono text-score tabular-nums text-ink">{formatHours(mock.minutes)}</p>
        {mock.href && (
          <Link href={mock.href} className={buttonClasses({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}>
            Начать пробный
            <ArrowRight />
          </Link>
        )}
      </div>
    </section>
  );
}
