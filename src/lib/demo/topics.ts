export type SectionId = "math" | "ct";

export const SECTION_IDS: readonly SectionId[] = ["math", "ct"];

export type SectionInfo = {
  title: string;
  short: string;
  questionCount: number;
  minutes: number;
};

/** Current official NUET format: 2 sections × 30 MCQ × 60 min. Keep configurable. */
export const SECTIONS: Record<SectionId, SectionInfo> = {
  math: { title: "Mathematics", short: "Math", questionCount: 30, minutes: 60 },
  ct: { title: "Critical Thinking", short: "CT", questionCount: 30, minutes: 60 },
};

export type Topic = {
  id: string;
  section: SectionId;
  name: string;
};

export const TOPICS: readonly Topic[] = [
  { id: "arithmetic", section: "math", name: "Числа и проценты" },
  { id: "algebra", section: "math", name: "Алгебра" },
  { id: "sequences", section: "math", name: "Последовательности" },
  { id: "geometry", section: "math", name: "Геометрия" },
  { id: "functions", section: "math", name: "Функции" },
  { id: "probability", section: "math", name: "Вероятность" },
  { id: "patterns", section: "ct", name: "Закономерности" },
  { id: "logic", section: "ct", name: "Логика" },
  { id: "data", section: "ct", name: "Работа с данными" },
  { id: "spatial", section: "ct", name: "Время и пространство" },
  { id: "argument", section: "ct", name: "Анализ аргументов" },
  { id: "problem", section: "ct", name: "Решение задач" },
];

const TOPIC_BY_ID = new Map(TOPICS.map((topic) => [topic.id, topic]));

export function topicById(id: string): Topic {
  const topic = TOPIC_BY_ID.get(id);
  if (!topic) throw new Error(`Unknown topic: ${id}`);
  return topic;
}
