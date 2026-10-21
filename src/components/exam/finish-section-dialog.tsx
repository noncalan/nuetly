"use client";

import { Clock } from "lucide-react";
import { useId, useRef } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { EMPTY_ANSWER, type AnswerRecord } from "@/lib/demo/attempt";
import type { Question } from "@/lib/demo/questions";
import { formatClock } from "@/lib/format";
import { LOW_TIME_SECONDS } from "./exam-topbar";
import { closingAttr, trapTab, useFocusReturn } from "./overlay";

const MAX_LISTED = 12;

type Props = {
  sectionTitle: string;
  isLastSection: boolean;
  questions: Question[];
  answers: Record<string, AnswerRecord>;
  remainingSec: number;
  isClosing: boolean;
  onJump: (index: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

type ListedQuestion = { question: Question; index: number };

export function FinishSectionDialog({
  sectionTitle,
  isLastSection,
  questions,
  answers,
  remainingSec,
  isClosing,
  onJump,
  onCancel,
  onConfirm,
}: Props) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  useFocusReturn(dialogRef, cancelRef);

  const listed = questions.map((question, index) => ({ question, index }));
  const unanswered = listed.filter(({ question }) => (answers[question.id] ?? EMPTY_ANSWER).choice === null);
  const flagged = listed.filter(({ question }) => answers[question.id]?.flagged);
  const answeredCount = questions.length - unanswered.length;
  const isLow = remainingSec <= LOW_TIME_SECONDS;

  return (
    <div
      data-closing={closingAttr(isClosing)}
      className="ui-backdrop fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 data-closing:pointer-events-none"
      // The backdrop never dismisses; keep focus inside the dialog when it is clicked.
      onMouseDown={(event) => event.target === event.currentTarget && event.preventDefault()}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onKeyDown={trapTab}
        className="ui-modal w-full outline-none! max-w-[440px] rounded-2xl border border-line bg-surface p-5 shadow-popover sm:p-6"
      >
        <div className="flex items-center justify-between gap-3 rounded-lg bg-subtle px-3 py-2 text-meta text-ink-2">
          <span className="flex items-center gap-1.5">
            <Clock aria-hidden className="size-3.5" strokeWidth={2} />
            Осталось
            <span className={cn("font-mono font-medium tabular-nums", isLow ? "text-danger" : "text-ink")}>
              {formatClock(remainingSec)}
            </span>
          </span>
          <span>
            Отвечено{" "}
            <span className="font-mono font-medium tabular-nums text-ink">
              {answeredCount}/{questions.length}
            </span>
          </span>
        </div>

        <h2 id={titleId} className="mt-5 text-h2 text-ink">
          Завершить раздел {sectionTitle}?
        </h2>
        <p id={descriptionId} className="mt-1.5 text-body text-ink-2">
          {isLastSection
            ? "Это последний раздел. После завершения ты увидишь результаты и разбор."
            : "Вернуться к этому разделу будет нельзя. Следующий раздел начнётся после короткой паузы."}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <JumpList label="Без ответа" tone="danger" items={unanswered} onJump={onJump} />
          <JumpList label="Отмечено" tone="gold" items={flagged} onJump={onJump} />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button ref={cancelRef} type="button" onClick={onCancel} className={buttonClasses()}>
            Вернуться к вопросам
          </button>
          <Button variant="primary" onClick={onConfirm}>
            Завершить раздел
          </Button>
        </div>
      </div>
    </div>
  );
}

const TONE_CLASS = { danger: "text-danger", gold: "text-gold-ink" } as const;

type JumpListProps = {
  label: string;
  tone: keyof typeof TONE_CLASS;
  items: ListedQuestion[];
  onJump: (index: number) => void;
};

function JumpList({ label, tone, items, onJump }: JumpListProps) {
  const hasItems = items.length > 0;
  return (
    <div className="rounded-xl border border-line bg-subtle p-3">
      <p className="flex items-baseline justify-between gap-2 text-meta text-ink-2">
        {label}
        <span className={cn("font-mono text-stat tabular-nums", hasItems ? TONE_CLASS[tone] : "text-ink-3")}>
          {items.length}
        </span>
      </p>
      {hasItems && (
        <div className="mt-3 flex flex-wrap gap-1">
          {items.slice(0, MAX_LISTED).map(({ question, index }) => (
            <button
              key={question.id}
              type="button"
              onClick={() => onJump(index)}
              aria-label={`Перейти к вопросу ${question.number}`}
              className="h-8 min-w-8 rounded-md border border-line bg-surface px-1.5 font-mono text-meta tabular-nums text-ink-2 transition-transform duration-150 ease-out hover:border-control-border hover:text-ink active:scale-[0.95]"
            >
              {question.number}
            </button>
          ))}
          {items.length > MAX_LISTED && (
            <span className="flex h-8 items-center px-1 font-mono text-meta tabular-nums text-ink-3">
              +{items.length - MAX_LISTED}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
