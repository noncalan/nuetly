"use client";

import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { MathText } from "@/components/math-text";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/cn";
import type { Question } from "@/lib/demo/questions";
import { OPTION_LETTERS } from "@/lib/format";

const STEP_BY_KEY: Partial<Record<string, number>> = { ArrowDown: 1, ArrowUp: -1 };

type Props = {
  question: Question;
  position: number;
  total: number;
  choice: number | null;
  /** Move focus to the heading on mount so screen readers announce the new question. */
  shouldFocusHeading: boolean;
  onChoose: (choice: number) => void;
};

/** One practice question. Mirrors the exam panel without flags; choices never animate colour. */
export function PracticeQuestion({ question, position, total, choice, shouldFocusHeading, onChoose }: Props) {
  const promptId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabStop = choice ?? 0;

  useEffect(() => {
    if (shouldFocusHeading) headingRef.current?.focus();
  }, [shouldFocusHeading]);

  function handleGroupKey(event: KeyboardEvent<HTMLDivElement>) {
    const step = STEP_BY_KEY[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const count = question.options.length;
    const focused = optionRefs.current.findIndex((node) => node === document.activeElement);
    const from = focused >= 0 ? focused : tabStop;
    const next = (from + step + count) % count;
    onChoose(next);
    optionRefs.current[next]?.focus();
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-8 sm:px-8 sm:py-12">
      <h1 ref={headingRef} tabIndex={-1} className="text-h2 text-ink outline-none!">
        Задача <span className="font-mono tabular-nums">{position}</span>
        <span className="font-normal text-ink-3">
          {" "}
          / <span className="font-mono tabular-nums">{total}</span>
        </span>
      </h1>

      <p id={promptId} className="mt-6 text-reading text-ink">
        <MathText text={question.prompt} />
      </p>

      <div role="radiogroup" aria-labelledby={promptId} onKeyDown={handleGroupKey} className="mt-8 space-y-2">
        {question.options.map((option, index) => {
          const isSelected = choice === index;
          return (
            <button
              key={index}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={index === tabStop ? 0 : -1}
              onClick={() => onChoose(index)}
              className={cn(
                "group flex w-full items-start gap-4 rounded-xl border px-4 py-3.5 text-left text-option text-ink",
                "transition-transform duration-150 ease-out active:scale-[0.99]",
                isSelected
                  ? "border-accent bg-accent-soft ring-1 ring-accent"
                  : "border-line bg-surface hover:border-control-border hover:bg-subtle",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-md border font-mono text-[13px] font-semibold",
                  isSelected
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line-strong bg-surface text-ink-2 group-hover:text-ink",
                )}
              >
                {OPTION_LETTERS[index]}
              </span>
              <span className="sr-only">{OPTION_LETTERS[index]}.</span>
              <span className="min-w-0 pt-0.5">
                <MathText text={option} />
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-8 hidden flex-wrap items-center gap-x-5 gap-y-2 text-caption font-normal text-ink-3 md:flex">
        <span className="flex items-center gap-1.5">
          <Kbd>A</Kbd>–<Kbd>{OPTION_LETTERS[question.options.length - 1]}</Kbd> выбрать ответ
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> по вариантам
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>←</Kbd>
          <Kbd>→</Kbd> переход
        </span>
      </p>
    </div>
  );
}
