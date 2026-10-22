import { HISTORY, NEXT_MOCK_TITLE, type HistoryEntry } from "./student";
import { SECTIONS } from "./topics";

export type MockStatus = "done" | "available" | "scheduled";

export type MockEntry = {
  id: string;
  title: string;
  kind: "diagnostic" | "mock";
  status: MockStatus;
  questionCount: number;
  minutes: number;
  /** What this paper leans on — shown as a hint, not a promise. */
  focus: string;
  result?: HistoryEntry;
  /** Where the primary action goes; absent for scheduled papers. */
  href?: string;
};

const FULL_QUESTIONS = SECTIONS.math.questionCount + SECTIONS.ct.questionCount;
const FULL_MINUTES = SECTIONS.math.minutes + SECTIONS.ct.minutes;
const DIAGNOSTIC_QUESTIONS = 30;
const DIAGNOSTIC_MINUTES = 60;

const historyById = new Map(HISTORY.map((entry) => [entry.id, entry]));

// Prototype catalogue. New papers are released after manual review, so scheduled ones carry no date.
export const MOCKS: MockEntry[] = [
  {
    id: "diagnostic",
    title: "Диагностика",
    kind: "diagnostic",
    status: "done",
    questionCount: DIAGNOSTIC_QUESTIONS,
    minutes: DIAGNOSTIC_MINUTES,
    focus: "Стартовый уровень по всем темам",
    result: historyById.get("diagnostic"),
  },
  {
    id: "mock-1",
    title: "Пробный NUET №1",
    kind: "mock",
    status: "done",
    questionCount: FULL_QUESTIONS,
    minutes: FULL_MINUTES,
    focus: "Базовый уровень, равномерно по темам",
    result: historyById.get("mock-1"),
  },
  {
    id: "mock-2",
    title: "Пробный NUET №2",
    kind: "mock",
    status: "done",
    questionCount: FULL_QUESTIONS,
    minutes: FULL_MINUTES,
    focus: "Больше алгебры и логики",
    result: historyById.get("mock-2"),
  },
  {
    id: "mock-3",
    title: "Пробный NUET №3",
    kind: "mock",
    status: "done",
    questionCount: FULL_QUESTIONS,
    minutes: FULL_MINUTES,
    focus: "Геометрия и работа с данными",
    result: historyById.get("mock-3"),
    href: "/results",
  },
  {
    id: "mock-4",
    title: NEXT_MOCK_TITLE,
    kind: "mock",
    status: "available",
    questionCount: FULL_QUESTIONS,
    minutes: FULL_MINUTES,
    focus: "Смешанный, ближе к реальной сложности",
    href: "/exam",
  },
  {
    id: "mock-5",
    title: "Пробный NUET №5",
    kind: "mock",
    status: "scheduled",
    questionCount: FULL_QUESTIONS,
    minutes: FULL_MINUTES,
    focus: "Проходит проверку",
  },
  {
    id: "mock-6",
    title: "Пробный NUET №6",
    kind: "mock",
    status: "scheduled",
    questionCount: FULL_QUESTIONS,
    minutes: FULL_MINUTES,
    focus: "В подготовке",
  },
];

export const NEXT_MOCK = MOCKS.find((mock) => mock.status === "available");

export const COMPLETED_MOCKS = MOCKS.filter((mock) => mock.status === "done" && mock.kind === "mock");
