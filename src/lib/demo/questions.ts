import { CT_QUESTIONS } from "./ct-questions";
import { MATH_QUESTIONS } from "./math-questions";
import type { Question } from "./question-builder";
import type { SectionId } from "./topics";

export type { Question } from "./question-builder";

export const QUESTIONS_BY_SECTION: Record<SectionId, Question[]> = {
  math: MATH_QUESTIONS,
  ct: CT_QUESTIONS,
};

export const ALL_QUESTIONS: Question[] = [...MATH_QUESTIONS, ...CT_QUESTIONS];
