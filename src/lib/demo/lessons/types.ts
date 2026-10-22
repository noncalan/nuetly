import type { SectionId } from "../topics";

/** "soon" lessons are announced in the syllabus but not published yet (lessons ship gradually). */
export type LessonStatus = "done" | "in-progress" | "not-started" | "soon";

/** One lesson as authored in a syllabus file; topic and position are added by `syllabus.ts`. */
export type LessonSeed = {
  slug: string;
  title: string;
  minutes: number;
  status: LessonStatus;
  /** What the lesson covers; shown while the full text is not published. May contain `$…$`. */
  outline: readonly string[];
};

export type Lesson = LessonSeed & {
  topicId: string;
  section: SectionId;
  /** 1-based position inside its topic. */
  number: number;
};

export type Mistake = {
  title: string;
  wrong: string;
  right: string;
};

export type QuizQuestion = {
  id: string;
  /** English, like the exam itself. */
  prompt: string;
  options: readonly string[];
  correctIndex: number;
  /** One line in Russian, shown after the student answers. */
  explanation: string;
};

export type LessonBlock =
  | { kind: "text"; text: string }
  | { kind: "formulas"; items: readonly { label: string; formula: string }[]; note?: string }
  | { kind: "problem"; text: string }
  | { kind: "steps"; items: readonly string[] }
  | { kind: "answer"; text: string }
  | { kind: "insight"; title: string; text: string }
  | { kind: "mistakes"; items: readonly Mistake[] }
  | { kind: "quiz"; questions: readonly QuizQuestion[] };

export type LessonSection = {
  /** Anchor id, also used by the table of contents. */
  id: string;
  title: string;
  blocks: readonly LessonBlock[];
};

export type LessonContent = {
  lead: string;
  sections: readonly LessonSection[];
};
