import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { MathText } from "@/components/math-text";
import { buttonClasses } from "@/components/ui/button";
import type { Lesson } from "@/lib/demo/syllabus";
import type { TocItem } from "./lesson-toc";

export const PLACEHOLDER_TOC: readonly TocItem[] = [
  { id: "outline", title: "Что будет в уроке" },
  { id: "coming-soon", title: "Пока урок готовится" },
];

const SECTION_SPACING = "scroll-mt-20 lg:scroll-mt-10";

type Props = { lesson: Lesson; sampleLesson?: Lesson; practiceHref: string };

/** Lessons ship gradually: until the text is published, show the outline and a way to practise. */
export function LessonPlaceholder({ lesson, sampleLesson, practiceHref }: Props) {
  return (
    <div className="space-y-12">
      <section id="outline" aria-labelledby="outline-title" className={SECTION_SPACING}>
        <h2 id="outline-title" className="text-h2 text-ink">
          Что будет в уроке
        </h2>
        <ol className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-card">
          {lesson.outline.map((point, index) => (
            <li key={point} className="flex gap-3 px-4 py-3 text-option text-ink sm:px-5">
              <span aria-hidden className="w-4 shrink-0 font-mono text-meta leading-6 tabular-nums text-ink-3">
                {index + 1}
              </span>
              <span className="min-w-0">
                <MathText text={point} />
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section id="coming-soon" aria-labelledby="coming-soon-title" className={SECTION_SPACING}>
        <div className="rounded-xl border border-line bg-subtle p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-ink-3" strokeWidth={1.75} />
            <div className="min-w-0">
              <h2 id="coming-soon-title" className="text-h2 text-ink">
                Урок появится скоро
              </h2>
              <p className="mt-2 max-w-[560px] text-body text-ink-2">
                Мы добавляем уроки постепенно и начинаем с тем, где на NUET ошибаются чаще всего. А пока тему можно
                потренировать на задачах — у каждой есть разбор решения.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={practiceHref} className={buttonClasses({ variant: "primary" })}>
                  Тренировать тему
                  <ArrowRight />
                </Link>
                {sampleLesson && (
                  <Link href={`/learn/${sampleLesson.slug}`} className={buttonClasses()}>
                    Открыть готовый урок
                    <span className="sr-only">: {sampleLesson.title}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
