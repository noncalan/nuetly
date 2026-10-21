import type { SectionId } from "./topics";

export type Question = {
  id: string;
  number: number;
  section: SectionId;
  topicId: string;
  difficulty: number;
  /** Plain text with inline math between `$…$`. */
  prompt: string;
  options: string[];
  correctIndex: number;
  solution: string[];
};

type Value = string | number;

export type Variant = {
  prompt: string;
  answer: Value;
  distractors: Value[];
  solution: string[];
};

/** One question idea with three numeric variants (one per round of 10). */
export type Template = {
  topicId: string;
  difficulty: number;
  variants: readonly [Variant, Variant, Variant];
};

export function v(prompt: string, answer: Value, distractors: Value[], solution: string[]): Variant {
  return { prompt, answer, distractors, solution };
}

const MAX_DIFFICULTY = 8;
const ROUNDS = [0, 1, 2] as const;

const asOption = (value: Value) => (typeof value === "number" ? `$${value}$` : value);

export function buildSection(section: SectionId, templates: readonly Template[]): Question[] {
  return ROUNDS.flatMap((round) =>
    templates.map((template, index) => {
      const number = round * templates.length + index + 1;
      const variant = template.variants[round];
      const distractors = variant.distractors.map(asOption);
      // Deterministic answer position so the demo looks shuffled but never changes.
      const correctIndex = (number * 7) % (distractors.length + 1);
      const options = [
        ...distractors.slice(0, correctIndex),
        asOption(variant.answer),
        ...distractors.slice(correctIndex),
      ];
      return {
        id: `${section}-${number}`,
        number,
        section,
        topicId: template.topicId,
        difficulty: Math.min(MAX_DIFFICULTY, template.difficulty + round),
        prompt: variant.prompt,
        options,
        correctIndex,
        solution: variant.solution,
      };
    }),
  );
}
