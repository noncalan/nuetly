import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell/app-shell";
import { LessonBody } from "@/components/learn/lesson-blocks";
import { LessonFooter } from "@/components/learn/lesson-footer";
import { LessonHeader } from "@/components/learn/lesson-header";
import { LessonPlaceholder, PLACEHOLDER_TOC } from "@/components/learn/lesson-placeholder";
import { LessonToc } from "@/components/learn/lesson-toc";
import { ALL_LESSONS, lessonBySlug, lessonContent, lessonNeighbors } from "@/lib/demo/syllabus";

/** Lesson shown as a sample of a finished lesson from the "coming soon" state. */
const SAMPLE_LESSON_SLUG = "percent-change";
const PRACTICE_HREF = "/practice";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ALL_LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = lessonBySlug(slug);
  return { title: lesson ? lesson.title :"Урок не найден" };
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = lessonBySlug(slug);
  if (!lesson) notFound();

  const content = lessonContent(lesson.slug);
  const tocItems = content ? content.sections.map(({ id, title }) => ({ id, title })) : PLACEHOLDER_TOC;
  const sampleLesson = lesson.slug === SAMPLE_LESSON_SLUG ? undefined : lessonBySlug(SAMPLE_LESSON_SLUG);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1040px] px-4 py-8 sm:px-8 lg:py-10">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,720px)_200px] lg:justify-between">
          <article aria-labelledby="lesson-title" className="min-w-0">
            <LessonHeader lesson={lesson} lead={content?.lead} />
            <div className="mt-10">
              {content ? (
                <LessonBody content={content} />
              ) : (
                <LessonPlaceholder lesson={lesson} sampleLesson={sampleLesson} practiceHref={PRACTICE_HREF} />
              )}
            </div>
            <LessonFooter neighbors={lessonNeighbors(lesson)} practiceHref={PRACTICE_HREF} showPractice={Boolean(content)} />
          </article>
          <aside className="hidden lg:block">
            <LessonToc items={tocItems} />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
