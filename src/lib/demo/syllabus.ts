import { DEMO_ATTEMPT } from "./attempt";
import { gradeAttempt } from "./grading";
import { CT_SYLLABUS } from "./lessons/ct-syllabus";
import { MATH_SYLLABUS } from "./lessons/math-syllabus";
import { PERCENT_CHANGE_LESSON } from "./lessons/percent-change";
import type { Lesson, LessonContent, LessonSeed } from "./lessons/types";
import { TOPICS, type SectionId, type Topic } from "./topics";
import { percent } from "@/lib/format";

export type { Lesson, LessonContent, LessonStatus } from "./lessons/types";

const SEEDS_BY_TOPIC: Readonly<Record<string, readonly LessonSeed[]>> = { ...MATH_SYLLABUS, ...CT_SYLLABUS };

/** Lessons with published text. Every other lesson shows its outline and a "coming soon" note. */
const LESSON_CONTENT: Readonly<Record<string, LessonContent>> = {
  "percent-change": PERCENT_CHANGE_LESSON,
};

export type TopicAccuracy = { correct: number; total: number; share: number };

export type TopicSyllabus = {
  topic: Topic;
  lessons: readonly Lesson[];
  doneCount: number;
  /** Share of correct answers on the topic in the last mock; null when the mock had no such questions. */
  accuracy: TopicAccuracy | null;
};

const demoTopicScores = gradeAttempt(DEMO_ATTEMPT).topics;

function accuracyFor(topicId: string): TopicAccuracy | null {
  const score = demoTopicScores.find((item) => item.topic.id === topicId);
  if (!score) return null;
  return { correct: score.correct, total: score.total, share: percent(score.correct, score.total) };
}

function buildTopic(topic: Topic): TopicSyllabus {
  const seeds = SEEDS_BY_TOPIC[topic.id] ?? [];
  const lessons = seeds.map((seed, index) => ({ ...seed, topicId: topic.id, section: topic.section, number: index + 1 }));
  return {
    topic,
    lessons,
    doneCount: lessons.filter((lesson) => lesson.status === "done").length,
    accuracy: accuracyFor(topic.id),
  };
}

/** Topics in syllabus order (same as TOPICS). */
export const SYLLABUS: readonly TopicSyllabus[] = TOPICS.map(buildTopic);

export const ALL_LESSONS: readonly Lesson[] = SYLLABUS.flatMap((entry) => entry.lessons);

const LESSON_BY_SLUG = new Map(ALL_LESSONS.map((lesson) => [lesson.slug, lesson]));

export function lessonBySlug(slug: string): Lesson | undefined {
  return LESSON_BY_SLUG.get(slug);
}

export function lessonContent(slug: string): LessonContent | undefined {
  return LESSON_CONTENT[slug];
}

export function topicSyllabus(topicId: string): TopicSyllabus | undefined {
  return SYLLABUS.find((entry) => entry.topic.id === topicId);
}

export function syllabusForSection(section: SectionId): readonly TopicSyllabus[] {
  return SYLLABUS.filter((entry) => entry.topic.section === section);
}

export type Progress = { done: number; total: number };

function countProgress(lessons: readonly Lesson[]): Progress {
  return { done: lessons.filter((lesson) => lesson.status === "done").length, total: lessons.length };
}

export const SYLLABUS_PROGRESS: Progress = countProgress(ALL_LESSONS);

export function sectionProgress(section: SectionId): Progress {
  return countProgress(ALL_LESSONS.filter((lesson) => lesson.section === section));
}

/** The lesson the student is in the middle of, for the "continue" callout. */
export const CURRENT_LESSON: Lesson | undefined = ALL_LESSONS.find((lesson) => lesson.status === "in-progress");

export type LessonNeighbors = { previous: Lesson | undefined; next: Lesson | undefined };

/** Previous and next lesson inside the same topic. */
export function lessonNeighbors(lesson: Lesson): LessonNeighbors {
  const lessons = topicSyllabus(lesson.topicId)?.lessons ?? [];
  const index = lessons.findIndex((item) => item.slug === lesson.slug);
  return { previous: lessons[index - 1], next: lessons[index + 1] };
}
