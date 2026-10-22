import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { MathText } from "@/components/math-text";
import { cn } from "@/lib/cn";
import type { Lesson, TopicSyllabus } from "@/lib/demo/syllabus";
import { LessonSegments, LessonStatusChip } from "./lesson-status";

/** Below this share of correct answers a topic counts as weak (red). */
const WEAK_THRESHOLD = 50;

const ROW_GRID = "grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 sm:px-5";

type Props = { entry: TopicSyllabus; className?: string; style?: CSSProperties };

export function TopicCard({ entry, className, style }: Props) {
  const { topic, lessons, doneCount, accuracy } = entry;
  const titleId = `topic-${topic.id}-title`;
  const isWeak = accuracy !== null && accuracy.share < WEAK_THRESHOLD;

  return (
    <article
      id={`topic-${topic.id}`}
      aria-labelledby={titleId}
      className={cn("scroll-mt-20 overflow-hidden rounded-xl border border-line bg-surface shadow-card", className)}
      style={style}
    >
      <header className="px-4 pb-3 pt-4 sm:px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 id={titleId} className="text-h2 text-ink">
              {topic.name}
            </h3>
            <p className="mt-1 text-meta text-ink-3">
              <span className="font-mono tabular-nums">{doneCount}</span> из{" "}
              <span className="font-mono tabular-nums">{lessons.length}</span> пройдено
            </p>
          </div>
          <AccuracyBadge accuracy={accuracy} isWeak={isWeak} />
        </div>
        <LessonSegments statuses={lessons.map((lesson) => lesson.status)} className="mt-3" />
      </header>

      <ol className="divide-y divide-line border-t border-line">
        {lessons.map((lesson) => (
          <li key={lesson.slug}>
            <LessonRow lesson={lesson} />
          </li>
        ))}
      </ol>
    </article>
  );
}

type AccuracyProps = { accuracy: TopicSyllabus["accuracy"]; isWeak: boolean };

function AccuracyBadge({ accuracy, isWeak }: AccuracyProps) {
  return (
    <div className="shrink-0 text-right">
      <p className={cn("flex items-center justify-end gap-1.5 text-body font-medium", isWeak ? "text-danger" : "text-ink")}>
        {isWeak && <span aria-hidden className="size-1.5 rounded-full bg-danger" />}
        {accuracy ? <span className="font-mono tabular-nums">{accuracy.share}%</span> : <span className="text-ink-3">—</span>}
      </p>
      <p className="text-caption text-ink-3">
        точность
        <span className="sr-only">
          {accuracy ? ` в последнем пробном: ${accuracy.correct} из ${accuracy.total}` : ": нет данных"}
          {isWeak && ", слабая тема"}
        </span>
      </p>
    </div>
  );
}

type RowProps = { lesson: Lesson };

function LessonRow({ lesson }: RowProps) {
  const isSoon = lesson.status === "soon";
  const content = (
    <>
      <span aria-hidden className="font-mono text-meta tabular-nums text-ink-3">
        {lesson.number}
      </span>
      <span className={cn("min-w-0 text-body", isSoon ? "text-ink-3" : "text-ink")}>
        <MathText text={lesson.title} />
      </span>
      <span className="flex items-center gap-3">
        <LessonStatusChip status={lesson.status} />
        <span className="w-12 text-right text-meta text-ink-3">
          <span className="font-mono tabular-nums">{lesson.minutes}</span> мин
        </span>
        <ChevronRight
          aria-hidden
          className={cn(
            "-ml-1 hidden size-4 text-ink-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 sm:block",
            isSoon && "invisible",
          )}
        />
      </span>
    </>
  );

  if (isSoon) {
    return <div className={cn(ROW_GRID, "min-h-11")}>{content}</div>;
  }

  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className={cn(
        ROW_GRID,
        "group min-h-11 transition-colors hover:bg-subtle active:bg-muted focus-visible:outline-offset-[-2px]",
      )}
    >
      {content}
    </Link>
  );
}
