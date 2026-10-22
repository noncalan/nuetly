import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MathText } from "@/components/math-text";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { Lesson, LessonNeighbors } from "@/lib/demo/syllabus";
import { LessonStatusChip } from "./lesson-status";

type Props = { neighbors: LessonNeighbors; practiceHref: string; showPractice: boolean };

export function LessonFooter({ neighbors, practiceHref, showPractice }: Props) {
  const { previous, next } = neighbors;
  return (
    <footer className="mt-16 border-t border-line pt-8">
      {showPractice && (
        <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-h2 text-ink">Закрепи на задачах</p>
            <p className="mt-1 text-meta text-ink-3">Задачи по теме в формате NUET, с разбором каждого решения.</p>
          </div>
          <Link href={practiceHref} className={buttonClasses({ variant: "primary", className: "self-start sm:self-auto" })}>
            Тренировать тему
            <ArrowRight />
          </Link>
        </div>
      )}

      {(previous || next) && (
        <nav aria-label="Уроки темы" className={cn("grid gap-3 sm:grid-cols-2", showPractice && "mt-6")}>
          {previous && <NeighborLink lesson={previous} direction="previous" />}
          {next && <NeighborLink lesson={next} direction="next" />}
        </nav>
      )}
    </footer>
  );
}

type NeighborProps = { lesson: Lesson; direction: "previous" | "next" };

function NeighborLink({ lesson, direction }: NeighborProps) {
  const isNext = direction === "next";
  const caption = isNext ? "Следующий урок" : "Предыдущий урок";
  const Icon = isNext ? ArrowRight : ArrowLeft;
  const body = (
    <>
      <span className={cn("flex items-center gap-1.5 text-caption text-ink-3", isNext && "sm:justify-end")}>
        {!isNext && <Icon aria-hidden className="size-3.5" />}
        {caption}
        {isNext && <Icon aria-hidden className="size-3.5" />}
      </span>
      <span className={cn("mt-1.5 flex flex-wrap items-center gap-2", isNext && "sm:justify-end")}>
        <span className="text-body font-medium">
          <MathText text={lesson.title} />
        </span>
        {lesson.status !== "not-started" && <LessonStatusChip status={lesson.status} />}
      </span>
    </>
  );
  const base = cn("block rounded-xl border border-line px-4 py-3.5", isNext && "sm:col-start-2 sm:text-right");

  // Unpublished lessons are announced but not linked, same as in the syllabus.
  if (lesson.status === "soon") {
    return <div className={cn(base, "bg-subtle text-ink-3")}>{body}</div>;
  }

  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className={cn(
        base,
        "bg-surface text-ink shadow-card transition-[border-color,background-color,transform] duration-150 ease-out hover:border-control-border hover:bg-subtle active:scale-[0.99]",
      )}
    >
      {body}
    </Link>
  );
}
