import type { CSSProperties } from "react";
import { DAYS_UNTIL_EXAM, STUDENT } from "@/lib/demo/student";
import { cn } from "@/lib/cn";
import { pluralRu } from "@/lib/format";
import { WeekActivity } from "./week-activity";

type Props = { className?: string; style?: CSSProperties };

/** Hero card: days until NUET on the left, this week's study activity on the right. */
export function ExamCountdown({ className, style }: Props) {
  return (
    <section
      style={style}
      aria-labelledby="countdown-title"
      className={cn(
        "grid gap-6 rounded-xl border border-line bg-surface p-5 shadow-card",
        "sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8",
        className,
      )}
    >
      <div>
        <h2 id="countdown-title" className="text-h2 text-ink">
          До NUET
        </h2>
        <p className="mt-4 flex items-baseline gap-3">
          <span className="font-mono text-display tabular-nums text-accent-text">{DAYS_UNTIL_EXAM}</span>
          <span className="text-h1 font-medium text-ink-2">{pluralRu(DAYS_UNTIL_EXAM, ["день", "дня", "дней"])}</span>
        </p>
        <p className="mt-4 text-meta text-ink-3">{STUDENT.examDateLabel} · дата из твоего профиля</p>
      </div>

      <div className="border-t border-line pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
        <WeekActivity />
      </div>
    </section>
  );
}
