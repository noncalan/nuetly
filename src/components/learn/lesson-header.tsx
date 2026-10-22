import { ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { MathText } from "@/components/math-text";
import type { Lesson } from "@/lib/demo/syllabus";
import { SECTIONS, topicById } from "@/lib/demo/topics";
import { LessonStatusChip } from "./lesson-status";

type Props = { lesson: Lesson; lead?: string };

export function LessonHeader({ lesson, lead }: Props) {
  const topic = topicById(lesson.topicId);
  return (
    <header>
      <nav aria-label="Навигационная цепочка">
        <ol className="flex flex-wrap items-center gap-1 text-meta text-ink-3">
          <li>
            <Link href="/learn" className="rounded-md text-accent-text hover:underline pointer-coarse:inline-flex pointer-coarse:min-h-11 pointer-coarse:items-center">
              Программа
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li>
            <Link
              href={`/learn#topic-${topic.id}`}
              className="rounded-md text-accent-text hover:underline pointer-coarse:inline-flex pointer-coarse:min-h-11 pointer-coarse:items-center"
            >
              {topic.name}
            </Link>
          </li>
        </ol>
      </nav>

      <h1 id="lesson-title" className="mt-3 text-h1 text-ink">
        <MathText text={lesson.title} />
      </h1>

      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-meta text-ink-3">
        <span className="inline-flex items-center gap-1.5">
          <Clock aria-hidden className="size-3.5" />
          <span>
            <span className="font-mono tabular-nums">{lesson.minutes}</span> мин
          </span>
        </span>
        <span aria-hidden>·</span>
        <span>{topic.name}</span>
        <span aria-hidden>·</span>
        <span>{SECTIONS[lesson.section].title}</span>
        {lesson.status !== "not-started" && <LessonStatusChip status={lesson.status} />}
      </p>

      {lead && <p className="mt-5 max-w-[640px] text-option text-ink-2">{lead}</p>}
    </header>
  );
}
