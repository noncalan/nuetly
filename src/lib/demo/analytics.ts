import { DEMO_ATTEMPT } from "./attempt";
import { gradeAttempt, type QuestionResult } from "./grading";
import { HISTORY, sectionDeltaAt, type HistoryEntry } from "./student";
import { SECTION_IDS, SECTIONS, TOPICS, type SectionId } from "./topics";
import { percent, pluralRu } from "@/lib/format";

// Derived, deterministic figures for the analytics page. Everything is computed once at module load.

/** Below this share of correct answers a topic (or band) counts as weak. */
export const WEAK_THRESHOLD = 50;
/** A wrong answer given faster than this most likely skipped reading the prompt. */
export const FAST_MISTAKE_SECONDS = 30;
const SECONDS_PER_MINUTE = 60;

const GRADED = gradeAttempt(DEMO_ATTEMPT);
const LATEST_INDEX = HISTORY.length - 1;

/** Short attempt name for axes and captions: "Диагн.", "№1", "№2"… */
function shortLabelOf(entry: HistoryEntry): string {
  return entry.kind === "diagnostic" ? "Диагн." : entry.title.replace("Пробный NUET ", "");
}

export const SOURCE_ATTEMPT = {
  title: DEMO_ATTEMPT.title,
  shortLabel: shortLabelOf(HISTORY[LATEST_INDEX]),
};

// ---------- Trend across attempts ----------

export type TrendPoint = {
  id: string;
  title: string;
  shortLabel: string;
  dateLabel: string;
  values: Record<SectionId, number>;
};

export const TREND: TrendPoint[] = HISTORY.map((entry) => ({
  id: entry.id,
  title: entry.title,
  shortLabel: shortLabelOf(entry),
  dateLabel: entry.dateLabel,
  values: {
    math: percent(entry.math.correct, entry.math.total),
    ct: percent(entry.ct.correct, entry.ct.total),
  },
}));

// ---------- KPI row ----------

export type SectionKpi = { section: SectionId; share: number; delta: number | null };

export const SECTION_KPIS: SectionKpi[] = SECTION_IDS.map((section) => ({
  section,
  share: TREND[LATEST_INDEX].values[section],
  delta: sectionDeltaAt(LATEST_INDEX, section),
}));

function sizeOf(kind: HistoryEntry["kind"]): string {
  const entry = HISTORY.find((item) => item.kind === kind);
  return entry ? `${entry.math.total} + ${entry.ct.total}` : "—";
}

/** Questions per section in each attempt kind, e.g. "15 + 15". */
export const ATTEMPT_SIZES: Record<HistoryEntry["kind"], string> = {
  diagnostic: sizeOf("diagnostic"),
  mock: sizeOf("mock"),
};

export const PREVIOUS_SHORT_LABEL =TREND[LATEST_INDEX - 1]?.shortLabel ?? null;
export const MOCKS_TAKEN = HISTORY.filter((entry) => entry.kind === "mock").length;
export const DIAGNOSTICS_TAKEN = HISTORY.filter((entry) => entry.kind === "diagnostic").length;

// ---------- Time ----------

function averageSeconds(results: QuestionResult[]): number {
  const answered = results.filter((result) => result.status !== "skipped");
  if (answered.length === 0) return 0;
  return answered.reduce((sum, result) => sum + result.record.seconds, 0) / answered.length;
}

function countFastMistakes(results: QuestionResult[]): number {
  return results.filter((result) => result.status === "wrong" && result.record.seconds < FAST_MISTAKE_SECONDS).length;
}

export type SectionTime = {
  section: SectionId;
  avgSeconds: number;
  /** Official time per question: section minutes / question count. */
  budgetSeconds: number;
  fastMistakes: number;
};

export const SECTION_TIMES: SectionTime[] = SECTION_IDS.map((section) => {
  const own = GRADED.results.filter((result) => result.question.section === section);
  const info = SECTIONS[section];
  return {
    section,
    avgSeconds: Math.round(averageSeconds(own)),
    budgetSeconds: (info.minutes * SECONDS_PER_MINUTE) / info.questionCount,
    fastMistakes: countFastMistakes(own),
  };
});

export const AVG_SECONDS_PER_QUESTION = Math.round(averageSeconds(GRADED.results));
export const FAST_MISTAKES_TOTAL = countFastMistakes(GRADED.results);

/** One plain-Russian sentence: tempo against the budget first, then rushed mistakes. */
export function timeTakeaway(times: readonly SectionTime[], fastMistakes: number): string {
  const slow = times.filter((time) => time.avgSeconds > time.budgetSeconds);
  const tempo =
    slow.length === 0
      ? "Темп укладывается в бюджет времени"
      : slow.length === times.length
        ? "В обоих разделах ты медленнее бюджета"
        : `В ${SECTIONS[slow[0].section].short} ты на ${slow[0].avgSeconds - slow[0].budgetSeconds} с медленнее бюджета`;
  if (fastMistakes === 0) return `${tempo}, а поспешных ошибок нет — так держать.`;
  const noun = pluralRu(fastMistakes, ["ошибка", "ошибки", "ошибок"]);
  const verb = pluralRu(fastMistakes, ["сделана", "сделаны", "сделано"]);
  return `${tempo}, а ${fastMistakes} ${noun} ${verb} быстрее ${FAST_MISTAKE_SECONDS} с — дочитывай условие до конца.`;
}

// ---------- Topics ----------

export type TopicCell = {
  id: string;
  name: string;
  section: SectionId;
  correct: number;
  total: number;
  share: number;
  /** Position in the official syllabus order. */
  syllabusIndex: number;
};

export const TOPIC_CELLS: TopicCell[] = TOPICS.flatMap((topic, syllabusIndex) => {
  const score = GRADED.topics.find((item) => item.topic.id === topic.id);
  if (!score || score.total === 0) return [];
  return [
    {
      id: topic.id,
      name: topic.name,
      section: topic.section,
      correct: score.correct,
      total: score.total,
      share: percent(score.correct, score.total),
      syllabusIndex,
    },
  ];
});

export const SMALLEST_TOPIC_TOTAL = Math.min(...TOPIC_CELLS.map((cell) => cell.total));
/** How many percentage points one question moves the share in the smallest topic. */
export const ONE_QUESTION_SWING = percent(1, SMALLEST_TOPIC_TOTAL);

// ---------- Difficulty ----------

const DIFFICULTY_BANDS = [
  { id: "easy", label: "1–3", min: 1, max: 3 },
  { id: "medium", label: "4–5", min: 4, max: 5 },
  { id: "hard", label: "6–8", min: 6, max: 8 },
] as const;

export type DifficultyAccuracy = { id: string; label: string; correct: number; total: number; share: number };

export const DIFFICULTY_ACCURACY: DifficultyAccuracy[] = DIFFICULTY_BANDS.map((band) => {
  const own = GRADED.results.filter(
    (result) => result.question.difficulty >= band.min && result.question.difficulty <= band.max,
  );
  const correct = own.filter((result) => result.status === "correct").length;
  return { id: band.id, label: band.label, correct, total: own.length, share: percent(correct, own.length) };
});
