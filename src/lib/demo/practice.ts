import { DEMO_ATTEMPT } from "./attempt";
import { gradeAttempt } from "./grading";
import { QUESTIONS_BY_SECTION, type Question } from "./questions";
import { SECTION_IDS, TOPICS, type SectionId, type Topic } from "./topics";
import { percent } from "@/lib/format";

// Practice mode: untimed, topic-focused sets. Pure and deterministic so server and client agree.

export type PracticeLevel = "easy" | "mid" | "hard" | "any";

export type LevelInfo = { id: PracticeLevel; label: string; min: number; max: number };

export const PRACTICE_LEVELS: readonly LevelInfo[] = [
  { id: "easy", label: "Лёгкие", min: 1, max: 3 },
  { id: "mid", label: "Средние", min: 4, max: 5 },
  { id: "hard", label: "Сложные", min: 6, max: 8 },
  { id: "any", label: "Любые", min: 1, max: 8 },
];

export const PRACTICE_COUNTS = [5, 10, 15] as const;
export type PracticeCount = (typeof PRACTICE_COUNTS)[number];

export type PracticeConfig = {
  section: SectionId;
  /** null = every topic of the section. */
  topicId: string | null;
  level: PracticeLevel;
  count: PracticeCount;
  /** 1-based set number; a new number gives a new deterministic order. */
  set: number;
};

export const DEFAULT_PRACTICE: PracticeConfig = { section: "math", topicId: null, level: "any", count: 10, set: 1 };

/** Below this share of correct answers a topic counts as weak (red). */
export const WEAK_SHARE = 50;
const RECOMMENDED_COUNT = 3;
const MAX_SET = 999;

export function levelInfo(level: PracticeLevel): LevelInfo {
  return PRACTICE_LEVELS.find((item) => item.id === level) ?? PRACTICE_LEVELS[PRACTICE_LEVELS.length - 1];
}

export function topicsOf(section: SectionId): Topic[] {
  return TOPICS.filter((topic) => topic.section === section);
}

// ---- Demo accuracy per topic (from the last mock) ----

export type TopicAccuracy = { correct: number; total: number; share: number };

const DEMO_TOPICS = gradeAttempt(DEMO_ATTEMPT).topics;

export const TOPIC_ACCURACY: Readonly<Record<string, TopicAccuracy>> = Object.fromEntries(
  DEMO_TOPICS.map((score) => [score.topic.id, { correct: score.correct, total: score.total, share: percent(score.correct, score.total) }]),
);

/** Weakest topics first (ties: more evidence first). */
export const RECOMMENDED_TOPICS: readonly (TopicAccuracy & { topic: Topic })[] = DEMO_TOPICS.map((score) => ({
  topic: score.topic,
  ...TOPIC_ACCURACY[score.topic.id],
}))
  .sort((a, b) => a.share - b.share || b.total - a.total)
  .slice(0, RECOMMENDED_COUNT);

// ---- URL state ----

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isSection(value: string | undefined): value is SectionId {
  return SECTION_IDS.some((id) => id === value);
}

function isLevel(value: string | undefined): value is PracticeLevel {
  return PRACTICE_LEVELS.some((item) => item.id === value);
}

function isCount(value: number): value is PracticeCount {
  return PRACTICE_COUNTS.some((count) => count === value);
}

/** Never throws: unknown or inconsistent params fall back to defaults. */
export function parsePracticeParams(params: RawParams): PracticeConfig {
  const topic = TOPICS.find((item) => item.id === first(params.topic));
  const rawSection = first(params.section);
  const section = topic?.section ?? (isSection(rawSection) ? rawSection : DEFAULT_PRACTICE.section);
  const rawLevel = first(params.level);
  const count = Number(first(params.count));
  const set = Math.trunc(Number(first(params.set)));
  return {
    section,
    topicId: topic?.id ?? null,
    level: isLevel(rawLevel) ? rawLevel : DEFAULT_PRACTICE.level,
    count: isCount(count) ? count : DEFAULT_PRACTICE.count,
    set: Number.isFinite(set) && set >= 1 && set <= MAX_SET ? set : 1,
  };
}

export function practiceHref(config: PracticeConfig): string {
  const params = new URLSearchParams({ section: config.section });
  if (config.topicId) params.set("topic", config.topicId);
  params.set("level", config.level);
  params.set("count", String(config.count));
  if (config.set > 1) params.set("set", String(config.set));
  return `/practice/session?${params.toString()}`;
}

/** Same filters, next set number (wraps so links stay valid). */
export function nextSetHref(config: PracticeConfig): string {
  return practiceHref({ ...config, set: (config.set % MAX_SET) + 1 });
}

// ---- Set selection ----

/** FNV-1a: stable 32-bit hash of a string. */
function hash(text: string): number {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

/** mulberry32: small seeded PRNG in [0, 1). */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const random = seededRandom(hash(seed));
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function inLevel(question: Question, level: PracticeLevel): boolean {
  const { min, max } = levelInfo(level);
  return question.difficulty >= min && question.difficulty <= max;
}

function matchesExactly(question: Question, config: PracticeConfig): boolean {
  return (config.topicId === null || question.topicId === config.topicId) && inLevel(question, config.level);
}

/** How many bank questions fit the filters exactly. */
export function countExactMatches(config: PracticeConfig): number {
  return QUESTIONS_BY_SECTION[config.section].filter((question) => matchesExactly(question, config)).length;
}

export type PracticeSet = {
  questions: Question[];
  /** How many of `questions` match topic and difficulty exactly; the rest are the closest fallbacks. */
  exactCount: number;
};

/**
 * Exact matches first, then the same topic at other difficulty, then the section at the chosen
 * difficulty, then the rest of the section. Order is a seeded shuffle, so a set never changes on reload.
 */
export function buildPracticeSet(config: PracticeConfig): PracticeSet {
  const bank = QUESTIONS_BY_SECTION[config.section];
  const seed = `${config.section}|${config.topicId ?? "all"}|${config.level}|${config.set}`;
  const sameTopic = (question: Question) => config.topicId === null || question.topicId === config.topicId;
  const tiers: ((question: Question) => boolean)[] = [
    (question) => matchesExactly(question, config),
    sameTopic,
    (question) => inLevel(question, config.level),
    () => true,
  ];

  const picked = new Map<string, Question>();
  tiers.forEach((test, tier) => {
    const pool = seededShuffle(
      bank.filter((question) => !picked.has(question.id) && test(question)),
      `${seed}|${tier}`,
    );
    for (const question of pool) {
      if (picked.size >= config.count) return;
      picked.set(question.id, question);
    }
  });

  const chosen = [...picked.values()];
  const exactCount = chosen.filter((question) => matchesExactly(question, config)).length;
  return { questions: seededShuffle(chosen, `${seed}|order`), exactCount };
}

/** Topic name, or a generic label when the whole section is practised. */
export function practiceTitle(config: PracticeConfig): string {
  const topic = config.topicId ? TOPICS.find((item) => item.id === config.topicId) : undefined;
  return topic ? topic.name : "Все темы раздела";
}
