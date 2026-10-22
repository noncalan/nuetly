import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { MathText } from "@/components/math-text";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { Lesson } from "@/lib/demo/syllabus";
import { SECTIONS, topicById } from "@/lib/demo/topics";

type Props = { lesson: Lesson; className?: string; style?: CSSProperties };

/** "Pick up where you left off" callout for the lesson in progress. */
export function ContinueCard({ lesson, className, style }: Props) {
  const topic = topicById(lesson.topicId);
  return (
    <section
      aria-labelledby="continue-title"
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden rounded-xl border border-line bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      style={style}
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-accent" />
      <div className="flex min-w-0 items-start gap-4">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-text">
          <BookOpen className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="text-meta text-ink-3">Продолжить урок</p>
          <h2 id="continue-title" className="mt-0.5 text-h2 text-ink">
            <MathText text={lesson.title} />
          </h2>
          <p className="mt-1 text-meta text-ink-3">
            {topic.name} · {SECTIONS[lesson.section].title} · <span className="font-mono tabular-nums">{lesson.minutes}</span>{" "}
            мин
          </p>
        </div>
      </div>
      <Link href={`/learn/${lesson.slug}`} className={buttonClasses({ variant: "primary", className: "self-start sm:self-auto" })}>
        Продолжить
        <span className="sr-only">: {lesson.title}</span>
        <ArrowRight />
      </Link>
    </section>
  );
}
