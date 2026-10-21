import { DEMO_ATTEMPT } from "./attempt";
import { gradeAttempt } from "./grading";
import type { SectionId } from "./topics";
import { percent } from "@/lib/format";

// Prototype data. "Today" is fixed so the demo renders identically on server and client.

const DAY_MS = 86_400_000;

export const STUDENT = {
  name: "Айдана",
  initials: "А",
  grade: "11 класс",
  examDateLabel: "17 января 2027",
};

export const TODAY_LABEL = "Среда, 21 октября";

export const DAYS_UNTIL_EXAM = Math.round((Date.UTC(2027, 0, 17) - Date.UTC(2026, 9, 21)) / DAY_MS);

export const NEXT_MOCK_TITLE = "Пробный NUET №4";

export type DayActivity = { label: string; minutes: number | null; isToday?: boolean };

export const WEEKLY_GOAL_MINUTES = 360;

export const WEEK_ACTIVITY: DayActivity[] = [
  { label: "Пн", minutes: 50 },
  { label: "Вт", minutes: 70 },
  { label: "Ср", minutes: 40, isToday: true },
  { label: "Чт", minutes: null },
  { label: "Пт", minutes: null },
  { label: "Сб", minutes: null },
  { label: "Вс", minutes: null },
];

export type Score = { correct: number; total: number };

export type HistoryEntry = {
  id: string;
  title: string;
  kind: "diagnostic" | "mock";
  dateLabel: string;
  durationSec: number;
  math: Score;
  ct: Score;
  href?: string;
};

const demoGraded = gradeAttempt(DEMO_ATTEMPT);

export const HISTORY: HistoryEntry[] = [
  {
    id: "diagnostic",
    title: "Диагностика",
    kind: "diagnostic",
    dateLabel: "5 окт",
    durationSec: 3480,
    math: { correct: 7, total: 15 },
    ct: { correct: 7, total: 15 },
  },
  {
    id: "mock-1",
    title: "Пробный NUET №1",
    kind: "mock",
    dateLabel: "9 окт",
    durationSec: 7020,
    math: { correct: 15, total: 30 },
    ct: { correct: 14, total: 30 },
  },
  {
    id: "mock-2",
    title: "Пробный NUET №2",
    kind: "mock",
    dateLabel: "14 окт",
    durationSec: 6900,
    math: { correct: 17, total: 30 },
    ct: { correct: 15, total: 30 },
  },
  {
    id: "mock-3",
    title: DEMO_ATTEMPT.title,
    kind: "mock",
    dateLabel: "21 окт",
    durationSec: DEMO_ATTEMPT.durationSec,
    math: demoGraded.sections.math,
    ct: demoGraded.sections.ct,
    href: "/results",
  },
];

/** The most recent history entry that is not the given attempt itself. */
export function previousAttemptFor(title: string): HistoryEntry | undefined {
  return HISTORY.filter((entry) => entry.title !== title).at(-1);
}

/**
 * Percentage-point change of one section between HISTORY[index] and the attempt before it.
 * Null for the first attempt (nothing to compare with).
 */
export function sectionDeltaAt(index: number, section: SectionId): number | null {
  const current = HISTORY[index];
  const previous = HISTORY[index - 1];
  if (!current || !previous) return null;
  return percent(current[section].correct, current[section].total) - percent(previous[section].correct, previous[section].total);
}

export const WEAK_TOPICS = demoGraded.topics.slice(0, 4);

export type TaskKind = "practice" | "review" | "lesson";

export type TodayTask = {
  id: string;
  kind: TaskKind;
  title: string;
  detail: string;
  minutes: number;
  href?: string;
};

export const TODAY_TASKS: TodayTask[] = [
  {
    id: "practice-weakest",
    kind: "practice",
    title: `Практика: ${WEAK_TOPICS[0].topic.name}`,
    detail: "10 задач · сложность 3–4",
    minutes: 20,
  },
  {
    id: "review-mock-3",
    kind: "review",
    title: `Разбор ошибок: ${DEMO_ATTEMPT.title}`,
    detail: "Повтори решения задач с ошибками",
    minutes: 15,
    href: "/results",
  },
  {
    id: "practice-second",
    kind: "practice",
    title: `Практика: ${WEAK_TOPICS[1].topic.name}`,
    detail: "10 задач · сложность 2–3",
    minutes: 20,
  },
];
