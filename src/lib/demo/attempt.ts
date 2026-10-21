import { ALL_QUESTIONS, type Question } from "./questions";

export type AnswerRecord = {
  choice: number | null;
  flagged: boolean;
  seconds: number;
};

export type AttemptRecord = {
  title: string;
  /** ISO timestamp */
  finishedAt: string;
  durationSec: number;
  answers: Record<string, AnswerRecord>;
  source: "live" | "demo";
};

export const EMPTY_ANSWER: AnswerRecord = { choice: null, flagged: false, seconds: 0 };

// The prototype keeps the last finished attempt in the tab only; the real app stores it server-side.
const STORAGE_KEY = "nuetly:prototype:last-attempt";

export function saveAttempt(attempt: AttemptRecord): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attempt));
  } catch {
    // Storage can be unavailable (private mode). Results then fall back to the demo attempt.
  }
}

export function readStoredAttempt(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function isAnswerRecord(value: unknown): value is AnswerRecord {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    (record.choice === null || typeof record.choice === "number") &&
    typeof record.flagged === "boolean" &&
    typeof record.seconds === "number"
  );
}

export function parseAttempt(raw: string | null): AttemptRecord | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    const answers = data.answers as Record<string, unknown> | undefined;
    const valid =
      typeof data.title === "string" &&
      typeof data.finishedAt === "string" &&
      typeof data.durationSec === "number" &&
      typeof answers === "object" &&
      answers !== null &&
      Object.values(answers).every(isAnswerRecord);
    return valid ? (data as AttemptRecord) : null;
  } catch {
    return null;
  }
}

// ---- Demo attempt: a believable mid-preparation student ----

/** Share of correct answers per topic, 0–100. */
const DEMO_STRENGTH: Record<string, number> = {
  arithmetic: 85,
  algebra: 80,
  sequences: 90,
  geometry: 45,
  functions: 75,
  probability: 35,
  patterns: 85,
  logic: 60,
  data: 75,
  spatial: 40,
  argument: 55,
  problem: 70,
};

const DEMO_SKIPPED = new Set(["math-28", "math-29", "math-30", "ct-30"]);
const DEMO_FLAGGED = new Set(["math-7", "math-17", "ct-12", "ct-24"]);

/** Deterministic pseudo-random number in [0, 1). */
function noise(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function demoAnswer(question: Question): AnswerRecord {
  const flagged = DEMO_FLAGGED.has(question.id);
  if (DEMO_SKIPPED.has(question.id)) return { choice: null, flagged, seconds: 0 };

  const seed = question.number + (question.section === "ct" ? 100 : 0);
  const correct = noise(seed) * 100 < (DEMO_STRENGTH[question.topicId] ?? 50);
  const wrongShift = 1 + Math.floor(noise(seed + 7) * (question.options.length - 1));
  const choice = correct ? question.correctIndex : (question.correctIndex + wrongShift) % question.options.length;
  const rushed = !correct && noise(seed + 13) < 0.35;
  const seconds = rushed
    ? Math.round(16 + noise(seed + 3) * 12)
    : Math.round(35 + question.difficulty * 14 + noise(seed + 5) * 70);
  return { choice, flagged, seconds };
}

export const DEMO_ATTEMPT: AttemptRecord = {
  title: "Пробный NUET №3",
  finishedAt: "2026-10-21T06:40:00.000Z",
  durationSec: 6720,
  answers: Object.fromEntries(ALL_QUESTIONS.map((question) => [question.id, demoAnswer(question)])),
  source: "demo",
};
