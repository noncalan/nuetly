import Link from "next/link";
import type { CSSProperties } from "react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { DEFAULT_PRACTICE, RECOMMENDED_TOPICS, WEAK_SHARE, practiceHref } from "@/lib/demo/practice";
import { SECTIONS } from "@/lib/demo/topics";

const FULL_SHARE = 100;
const RECOMMENDED_SET_SIZE = 10;

type Props = { className?: string; style?: CSSProperties };

export function RecommendedTopics({ className, style }: Props) {
  return (
    <section aria-labelledby="recommended-title" className={className} style={style}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="recommended-title" className="text-h2 text-ink">
          Рекомендуем сегодня
        </h2>
        <p className="text-meta text-ink-3">
          Самые слабые темы · по <span className="font-mono tabular-nums">{RECOMMENDED_SET_SIZE}</span> задач
        </p>
      </div>
      <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface shadow-card">
        {RECOMMENDED_TOPICS.map(({ topic, correct, total, share }) => {
          const isWeak = share < WEAK_SHARE;
          const href = practiceHref({
            ...DEFAULT_PRACTICE,
            section: topic.section,
            topicId: topic.id,
            count: RECOMMENDED_SET_SIZE,
          });
          return (
            <li key={topic.id} className="flex items-center gap-4 px-4 py-3.5 sm:px-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="flex min-w-0 items-baseline gap-2">
                    <span className="truncate text-body font-medium text-ink">{topic.name}</span>
                    <span className="shrink-0 text-caption text-ink-3">{SECTIONS[topic.section].short}</span>
                  </p>
                  <p className="flex shrink-0 items-baseline gap-2 font-mono tabular-nums">
                    <span className={cn("text-body font-medium", isWeak ? "text-danger" : "text-ink")}>{share}%</span>
                    <span className="hidden text-meta text-ink-3 sm:inline">
                      {correct}/{total}
                    </span>
                  </p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                  <div
                    className={cn("ui-progress rounded-full", isWeak ? "bg-danger" : "bg-ink-3")}
                    style={{ "--progress": share / FULL_SHARE } as CSSProperties}
                  />
                </div>
              </div>
              <Link
                href={href}
                aria-label={`Начать: ${topic.name}, ${RECOMMENDED_SET_SIZE} задач`}
                className={buttonClasses({ size: "sm" })}
              >
                Начать
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
