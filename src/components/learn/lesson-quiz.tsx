"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { MathText } from "@/components/math-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { QuizQuestion } from "@/lib/demo/lessons/types";
import { OPTION_LETTERS } from "@/lib/format";

type Answers = Readonly<Record<string, number>>;

type Props = { questions: readonly QuizQuestion[] };

/** Inline practice with instant feedback: fine in a lesson, never in the exam. */
export function LessonQuiz({ questions }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const answeredCount = questions.filter((question) => answers[question.id] !== undefined).length;
  const correctCount = questions.filter((question) => answers[question.id] === question.correctIndex).length;

  function choose(questionId: string, choice: number) {
    setAnswers((current) => (current[questionId] === undefined ? { ...current, [questionId]: choice } : current));
  }

  function reset(questionId: string) {
    setAnswers((current) => Object.fromEntries(Object.entries(current).filter(([id]) => id !== questionId)));
  }

  return (
    <div className="space-y-4">
      <ol className="space-y-4">
        {questions.map((question, index) => (
          <li key={question.id}>
            <QuizCard
              question={question}
              number={index + 1}
              choice={answers[question.id]}
              onChoose={(choice) => choose(question.id, choice)}
              onReset={() => reset(question.id)}
            />
          </li>
        ))}
      </ol>
      <p className="text-meta text-ink-3">
        {answeredCount === questions.length ? (
          <>
            Итог: <span className="font-mono font-medium tabular-nums text-ink">{correctCount}</span> из{" "}
            <span className="font-mono tabular-nums">{questions.length}</span> верно.
          </>
        ) : (
          <>
            Решено <span className="font-mono tabular-nums">{answeredCount}</span> из{" "}
            <span className="font-mono tabular-nums">{questions.length}</span>
          </>
        )}
      </p>
    </div>
  );
}

type CardProps = {
  question: QuizQuestion;
  number: number;
  choice: number | undefined;
  onChoose: (choice: number) => void;
  onReset: () => void;
};

function QuizCard({ question, number, choice, onChoose, onReset }: CardProps) {
  const promptId = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const isAnswered = choice !== undefined;
  const isCorrect = choice === question.correctIndex;

  // The reset button unmounts on click, so hand focus to the first option instead of losing it.
  function handleReset() {
    onReset();
    groupRef.current?.querySelector("button")?.focus();
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-caption text-ink-3">
          Задача <span className="font-mono tabular-nums">{number}</span>
        </p>
        {isAnswered && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="-mr-2 -mt-1.5">
            <RotateCcw aria-hidden />
            Ещё раз
          </Button>
        )}
      </div>
      <p id={promptId} lang="en" className="mt-2 text-option text-ink">
        <MathText text={question.prompt} />
      </p>

      <div ref={groupRef} role="group" aria-labelledby={promptId} className="mt-4 space-y-2">
        {question.options.map((option, index) => (
          <QuizOption
            key={index}
            index={index}
            text={option}
            state={optionState(index, choice, question.correctIndex)}
            isLocked={isAnswered}
            isChosen={choice === index}
            onChoose={() => onChoose(index)}
          />
        ))}
      </div>

      <div aria-live="polite">
        {isAnswered && (
          <p className={cn("ui-enter mt-4 flex gap-2.5 text-body", isCorrect ? "text-success-ink" : "text-danger")}>
            {isCorrect ? (
              <Check aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
            ) : (
              <X aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
            )}
            <span className="min-w-0">
              <span className="font-semibold">
                {isCorrect ? "Верно." : `Неверно, правильный ответ — ${OPTION_LETTERS[question.correctIndex]}.`}
              </span>{" "}
              <span className="text-ink">
                <MathText text={question.explanation} />
              </span>
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

type OptionState = "idle" | "correct" | "wrong-choice" | "dimmed";

function optionState(index: number, choice: number | undefined, correctIndex: number): OptionState {
  if (choice === undefined) return "idle";
  if (index === correctIndex) return "correct";
  if (index === choice) return "wrong-choice";
  return "dimmed";
}

type OptionProps = {
  index: number;
  text: string;
  state: OptionState;
  isLocked: boolean;
  isChosen: boolean;
  onChoose: () => void;
};

function QuizOption({ index, text, state, isLocked, isChosen, onChoose }: OptionProps) {
  const letter = OPTION_LETTERS[index];
  return (
    <button
      type="button"
      onClick={isLocked ? undefined : onChoose}
      aria-disabled={isLocked || undefined}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-option",
        "transition-[background-color,border-color,color,transform] duration-150 ease-out",
        !isLocked && "active:scale-[0.99]",
        state === "idle" && "border-line bg-surface text-ink hover:border-control-border hover:bg-subtle",
        state === "correct" && "border-success/40 bg-success-soft text-ink",
        state === "wrong-choice" && "border-danger/40 bg-danger-soft text-ink",
        state === "dimmed" && "cursor-default border-line bg-surface text-ink-3",
        isLocked && "cursor-default",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-md border font-mono text-[12px] font-semibold",
          state === "correct" && "border-success bg-surface text-success-ink",
          state === "wrong-choice" && "border-danger bg-surface text-danger",
          (state === "idle" || state === "dimmed") && "border-line-strong bg-surface text-ink-2",
        )}
      >
        {letter}
      </span>
      <span className="sr-only">{letter}.</span>
      <span lang="en" className="min-w-0 flex-1">
        <MathText text={text} />
      </span>
      {state === "correct" && (
        <span className="mt-1 shrink-0 text-caption text-success-ink">{isChosen ? "твой ответ · верно" : "верный ответ"}</span>
      )}
      {state === "wrong-choice" && <span className="mt-1 shrink-0 text-caption text-danger">твой ответ</span>}
    </button>
  );
}
