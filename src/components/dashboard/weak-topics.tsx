import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { WEAK_TOPICS } from "@/lib/demo/student";
import { SECTIONS } from "@/lib/demo/topics";
import { percent } from "@/lib/format";

/** Below this share of correct answers a topic counts as weak (red). */
const WEAK_THRESHOLD = 50;
const FULL_SHARE = 100;

// Weakest first; on a tie, the topic with more evidence (more questions) leads.
const SORTED_TOPICS = [...WEAK_TOPICS]
  .map((score) => ({ ...score, share: percent(score.correct, score.total) }))
  .sort((a, b) => a.share - b.share || b.total - a.total);

type Props = { className?: string; style?: CSSProperties };

export function WeakTopics({ className, style }: Props) {
  return (
    <section aria-labelledby="weak-title" className={className} style={style}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="weak-title" className="text-h2 text-ink">
          Что подтянуть
        </h2>
        <Link
          href="/results"
          className="inline-flex min-h-6 items-center rounded-md text-meta font-medium text-accent-text hover:underline pointer-coarse:min-h-11"
        >
          Разбор ошибок
        </Link>
      </div>
      <ul className="mt-3 space-y-4 rounded-xl border border-line bg-surface p-5 shadow-card">
        {SORTED_TOPICS.map(({ topic, correct, total, share }) => {
          const isWeak = share < WEAK_THRESHOLD;
          return (
            <li key={topic.id}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="flex min-w-0 items-baseline gap-2">
                  <span className="truncate text-body font-medium text-ink">{topic.name}</span>
                  <span className="shrink-0 text-caption text-ink-3">{SECTIONS[topic.section].short}</span>
                </p>
                <p className="flex shrink-0 items-baseline gap-2 font-mono tabular-nums">
                  <span className={cn("text-body font-medium", isWeak ? "text-danger" : "text-ink")}>{share}%</span>
                  <span className="text-meta text-ink-3">
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
            </li>
          );
        })}
      </ul>
    </section>
  );
}
