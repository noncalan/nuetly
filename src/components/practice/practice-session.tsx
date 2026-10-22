"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonClasses } from "@/components/ui/button";
import type { QuestionStatus } from "@/lib/demo/grading";
import { levelInfo, practiceTitle, type PracticeConfig } from "@/lib/demo/practice";
import type { Question } from "@/lib/demo/questions";
import { SECTIONS } from "@/lib/demo/topics";
import { OPTION_LETTERS } from "@/lib/format";
import { PracticeQuestion } from "./practice-question";
import type { PracticeResult } from "./practice-review";
import { PracticeSummary } from "./practice-summary";

const TYPING_TARGET = "input, textarea, select, [contenteditable]:not([contenteditable='false'])";

type Props = {
  config: PracticeConfig;
  questions: Question[];
  exactCount: number;
};

function isTypingTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(TYPING_TARGET) !== null;
}

function statusOf(question: Question, choice: number | null): QuestionStatus {
  if (choice === null) return "skipped";
  return choice === question.correctIndex ? "correct" : "wrong";
}

/** Untimed practice set: one question at a time, no feedback until the summary. */
export function PracticeSession({ config, questions, exactCount }: Props) {
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<ReadonlyArray<number | null>>(() => questions.map(() => null));
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const total = questions.length;
  const question = questions[index];
  const choice = choices[index] ?? null;
  const isLast = index === total - 1;
  const answeredCount = choices.filter((value) => value !== null).length;

  function choose(value: number) {
    setChoices((current) => current.map((item, position) => (position === index ? value : item)));
  }

  function goTo(next: number) {
    if (next < 0 || next >= total || next === index) return;
    setIndex(next);
    setHasNavigated(true);
  }

  function handleKey(event: KeyboardEvent) {
    if (isFinished || !question) return;
    if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
    const key = event.key.toLowerCase();
    const letter = OPTION_LETTERS.findIndex((item) => item.toLowerCase() === key);
    if (letter >= 0 && letter < question.options.length) choose(letter);
    else if (key === "arrowright") goTo(index + 1);
    else if (key === "arrowleft") goTo(index - 1);
  }

  const keyHandlerRef = useRef(handleKey);
  useEffect(() => {
    keyHandlerRef.current = handleKey;
  });
  useEffect(() => {
    const listener = (event: KeyboardEvent) => keyHandlerRef.current(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const results: PracticeResult[] = questions.map((item, position) => ({
    question: item,
    position: position + 1,
    choice: choices[position] ?? null,
    status: statusOf(item, choices[position] ?? null),
  }));

  const progress = isFinished ? 1 : total === 0 ? 0 : (index + 1) / total;

  return (
    <div className="flex h-dvh flex-col bg-canvas">
      <header className="relative flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-4 sm:px-6">
        <Link href="/practice" className={buttonClasses({ variant: "ghost", size: "sm", className: "-ml-2" })}>
          <ArrowLeft aria-hidden />
          <span className="sr-only sm:not-sr-only">К практике</span>
        </Link>
        <span aria-hidden className="h-5 w-px bg-line" />
        <div className="flex min-w-0 items-center gap-2.5">
          <p className="truncate text-body font-medium text-ink">{practiceTitle(config)}</p>
          <span className="hidden shrink-0 rounded-md border border-line px-1.5 py-0.5 text-caption text-ink-2 sm:inline">
            {SECTIONS[config.section].short} · {levelInfo(config.level).label}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-caption text-ink-3 md:inline">Без таймера</span>
          <ThemeToggle />
        </div>
        <div aria-hidden className="absolute inset-x-0 -bottom-px h-[3px] overflow-hidden">
          <div className="ui-progress bg-accent" style={{ "--progress": progress } as CSSProperties} />
        </div>
      </header>

      <main className="min-w-0 flex-1 overflow-y-auto">
        {isFinished || !question ? (
          <PracticeSummary config={config} results={results} exactCount={exactCount} />
        ) : (
          <PracticeQuestion
            key={question.id}
            question={question}
            position={index + 1}
            total={total}
            choice={choice}
            shouldFocusHeading={hasNavigated}
            onChoose={choose}
          />
        )}
      </main>

      {!isFinished && question && (
        <footer className="flex h-16 shrink-0 items-center justify-between gap-3 border-t border-line bg-surface px-4 sm:px-6">
          <Button onClick={() => goTo(index - 1)} disabled={index === 0}>
            <ArrowLeft aria-hidden />
            <span className="sr-only sm:not-sr-only">Назад</span>
          </Button>

          <p className="text-meta text-ink-3">
            <span className="font-mono tabular-nums text-ink-2">
              {answeredCount}/{total}
            </span>{" "}
            <span className="sr-only sm:not-sr-only">с ответом</span>
          </p>

          <ForwardButton
            isLast={isLast}
            hasChoice={choice !== null}
            onNext={() => goTo(index + 1)}
            onFinish={() => setIsFinished(true)}
          />
        </footer>
      )}
    </div>
  );
}

type ForwardProps = { isLast: boolean; hasChoice: boolean; onNext: () => void; onFinish: () => void };

/** One slot on the right: "Пропустить" until a choice is made, then "Дальше"; the last question finishes. */
function ForwardButton({ isLast, hasChoice, onNext, onFinish }: ForwardProps) {
  if (isLast) {
    return (
      <Button variant="primary" onClick={onFinish}>
        <Check aria-hidden />
        Завершить
      </Button>
    );
  }
  if (!hasChoice) {
    return (
      <Button variant="ghost" onClick={onNext}>
        Пропустить
      </Button>
    );
  }
  return (
    <Button variant="primary" onClick={onNext}>
      Дальше
      <ArrowRight aria-hidden />
    </Button>
  );
}
