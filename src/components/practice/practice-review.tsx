"use client";

import { Check, ChevronDown, Minus, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { MathText } from "@/components/math-text";
import { cn } from "@/lib/cn";
import type { QuestionStatus } from "@/lib/demo/grading";
import type { Question } from "@/lib/demo/questions";
import { topicById } from "@/lib/demo/topics";
import { OPTION_LETTERS } from "@/lib/format";

export type PracticeResult = { question: Question; position: number; choice: number | null; status: QuestionStatus };

export const STATUS_LABEL: Record<QuestionStatus, string> = {
  correct: "верно",
  wrong: "ошибка",
  skipped: "без ответа",
};

const STATUS_ICON: Record<QuestionStatus, ReactNode> = {
  correct: <Check aria-hidden className="size-4 text-success" strokeWidth={2.5} />,
  wrong: <X aria-hidden className="size-4 text-danger" strokeWidth={2.5} />,
  skipped: <Minus aria-hidden className="size-4 text-ink-3" strokeWidth={2.5} />,
};

/** Per-question list with the full step-by-step solution behind each row. */
export function PracticeReview({ results }: { results: readonly PracticeResult[] }) {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set());

  function toggle(id: string) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      {results.map((result) => (
        <ReviewRow
          key={result.question.id}
          result={result}
          isOpen={openIds.has(result.question.id)}
          onToggle={() => toggle(result.question.id)}
        />
      ))}
    </ul>
  );
}

type RowProps = { result: PracticeResult; isOpen: boolean; onToggle: () => void };

function ReviewRow({ result, isOpen, onToggle }: RowProps) {
  const { question, position, choice, status } = result;
  const detailId = `practice-detail-${question.id}`;
  const chosen = choice === null ? "—" : OPTION_LETTERS[choice];

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={isOpen ? detailId : undefined}
        className={cn(
          "grid min-h-11 w-full grid-cols-[24px_16px_minmax(0,1fr)_auto_16px] items-center gap-3 px-4 py-3 text-left text-body",
          "transition-colors hover:bg-subtle active:bg-muted focus-visible:outline-offset-[-2px] sm:px-5",
        )}
      >
        <span className="font-mono text-meta tabular-nums text-ink-2">
          <span className="sr-only">Задача </span>
          {position}
        </span>
        <span className="grid place-items-center">
          {STATUS_ICON[status]}
          <span className="sr-only">, {STATUS_LABEL[status]}</span>
        </span>
        <span className="truncate text-ink">{topicById(question.topicId).name}</span>
        <span className="text-meta font-medium text-ink-2">
          <span className="sr-only">Ответ </span>
          <span className={cn(status === "wrong" && "text-danger")}>{chosen}</span>
          {status !== "correct" && (
            <span className="text-ink-3">
              {" "}
              <span aria-hidden>→</span>
              <span className="sr-only">, верный</span> {OPTION_LETTERS[question.correctIndex]}
            </span>
          )}
        </span>
        <ChevronDown
          aria-hidden
          className={cn("size-4 text-ink-3 transition-transform duration-200 ease-out", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && <ReviewDetail id={detailId} question={question} choice={choice} />}
    </li>
  );
}

function ReviewDetail({ id, question, choice }: { id: string; question: Question; choice: number | null }) {
  const solutionId = `${id}-solution`;
  return (
    <div id={id} className="ui-enter border-t border-line bg-subtle px-4 py-6 sm:px-6">
      <div className="max-w-[680px]">
        <p className="text-reading text-ink">
          <MathText text={question.prompt} />
        </p>
        <ul className="mt-5 space-y-2">
          {question.options.map((option, index) => (
            <OptionBox
              key={index}
              letter={OPTION_LETTERS[index]}
              text={option}
              isCorrect={index === question.correctIndex}
              isChosen={index === choice}
            />
          ))}
        </ul>

        <h3 id={solutionId} className="mt-8 text-caption uppercase tracking-[0.08em] text-ink-3">
          Решение
        </h3>
        <ol aria-labelledby={solutionId} className="mt-3 space-y-3">
          {question.solution.map((step, index) => (
            <li key={index} className="flex gap-3 text-option text-ink">
              <span
                aria-hidden
                className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-line bg-surface font-mono text-[11px] tabular-nums text-ink-2"
              >
                {index + 1}
              </span>
              <span className="min-w-0">
                <MathText text={step} />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

type OptionBoxProps = { letter: string; text: string; isCorrect: boolean; isChosen: boolean };

function OptionBox({ letter, text, isCorrect, isChosen }: OptionBoxProps) {
  const isWrongChoice = isChosen && !isCorrect;
  return (
    <li
      className={cn(
        "flex flex-wrap items-start gap-x-3 gap-y-1 rounded-xl border px-4 py-3 text-option",
        isCorrect && "border-success/40 bg-success-soft text-ink",
        isWrongChoice && "border-danger/40 bg-danger-soft text-ink",
        !isCorrect && !isWrongChoice && "border-line bg-surface text-ink-2",
      )}
    >
      <span className="w-4 shrink-0 font-semibold">{letter}</span>
      <span className="min-w-0 flex-1">
        <MathText text={text} />
      </span>
      {isCorrect && (
        <span className="mt-1 shrink-0 text-caption text-success-ink">{isChosen ? "твой ответ · верно" : "верный ответ"}</span>
      )}
      {isWrongChoice && <span className="mt-1 shrink-0 text-caption text-danger">твой ответ</span>}
    </li>
  );
}
