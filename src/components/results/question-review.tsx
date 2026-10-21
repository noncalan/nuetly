"use client";

import { Check, ChevronDown, Flag, Minus, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { MathText } from "@/components/math-text";
import { cn } from "@/lib/cn";
import type { QuestionResult, QuestionStatus } from "@/lib/demo/grading";
import { SECTIONS, topicById, type SectionId } from "@/lib/demo/topics";
import { OPTION_LETTERS, formatClock } from "@/lib/format";
import { QuestionTag } from "./numerals";
import { STATUS_LABEL } from "./score-summary";

type Filter = "all" | "wrong" | "skipped" | "flagged";

const FILTERS: { id: Filter; label: string; test: (result: QuestionResult) => boolean }[] = [
  { id: "all", label: "Все", test: () => true },
  { id: "wrong", label: "Ошибки", test: (result) => result.status === "wrong" },
  { id: "skipped", label: "Без ответа", test: (result) => result.status === "skipped" },
  { id: "flagged", label: "Отмеченные", test: (result) => result.record.flagged },
];

type Props = {
  results: QuestionResult[];
  initialOpenId: string | null;
};

export function QuestionReview({ results, initialOpenId }: Props) {
  const [filter, setFilter] = useState<Filter>(initialOpenId ? "all" : "wrong");
  const [section, setSection] = useState<SectionId | "all">("all");
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set(initialOpenId ? [initialOpenId] : []));

  useEffect(() => {
    if (initialOpenId) document.getElementById(`review-${initialOpenId}`)?.scrollIntoView({ block: "start" });
  }, [initialOpenId]);

  const inSection = results.filter((result) => section === "all" || result.question.section === section);
  const activeTest = FILTERS.find((item) => item.id === filter)?.test ?? (() => true);
  const visible = inSection.filter(activeTest);

  function toggle(id: string) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Фильтр по статусу"
          options={FILTERS.map((item) => ({ id: item.id, label: item.label, count: inSection.filter(item.test).length }))}
          value={filter}
          onChange={setFilter}
        />
        <Segmented
          label="Раздел"
          options={[
            { id: "all", label: "Оба раздела" },
            { id: "math", label: SECTIONS.math.short },
            { id: "ct", label: SECTIONS.ct.short },
          ]}
          value={section}
          onChange={setSection}
        />
      </div>

      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-card">
        {visible.length === 0 && <li className="px-4 py-10 text-center text-body text-ink-3">Здесь пусто.</li>}
        {visible.map((result) => (
          <QuestionRow
            key={result.question.id}
            result={result}
            isOpen={openIds.has(result.question.id)}
            onToggle={() => toggle(result.question.id)}
          />
        ))}
      </ul>
    </div>
  );
}

const STATUS_ICON: Record<QuestionStatus, ReactNode> = {
  correct: <Check aria-hidden className="size-4 text-success" strokeWidth={2.5} />,
  wrong: <X aria-hidden className="size-4 text-danger" strokeWidth={2.5} />,
  skipped: <Minus aria-hidden className="size-4 text-ink-3" strokeWidth={2.5} />,
};

function QuestionRow({ result, isOpen, onToggle }: { result: QuestionResult; isOpen: boolean; onToggle: () => void }) {
  const { question, record, status } = result;
  const chosen = record.choice === null ? "—" : OPTION_LETTERS[record.choice];
  const detailId = `review-detail-${question.id}`;

  return (
    <li id={`review-${question.id}`} className="scroll-mt-20">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={isOpen ? detailId : undefined}
        className={cn(
          "grid w-full grid-cols-[60px_16px_minmax(0,1fr)_auto_16px] items-center gap-3 px-4 py-3 text-left text-body",
          "transition-colors hover:bg-subtle active:bg-muted focus-visible:outline-offset-[-2px]",
          "sm:grid-cols-[60px_16px_minmax(0,1fr)_auto_56px_16px] sm:px-5",
        )}
      >
        <QuestionTag section={question.section} number={question.number} className="text-meta text-ink-2" />
        <span className="grid place-items-center">
          {STATUS_ICON[status]}
          <span className="sr-only">{STATUS_LABEL[status]}</span>
        </span>
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-ink">{topicById(question.topicId).name}</span>
          {record.flagged && (
            <>
              <Flag aria-hidden className="size-3 shrink-0 text-gold" fill="currentColor" strokeWidth={0} />
              <span className="sr-only">, отмечен</span>
            </>
          )}
        </span>
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
        <span className="hidden text-right font-mono text-meta tabular-nums text-ink-3 sm:block">{formatClock(record.seconds)}</span>
        <ChevronDown
          aria-hidden
          className={cn("size-4 text-ink-3 transition-transform duration-200 ease-out", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && <QuestionDetail id={detailId} result={result} />}
    </li>
  );
}

function QuestionDetail({ id, result }: { id: string; result: QuestionResult }) {
  const { question, record } = result;
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
              isChosen={index === record.choice}
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
              <MathText text={step} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

type OptionBoxProps = {
  letter: string;
  text: string;
  isCorrect: boolean;
  isChosen: boolean;
};

function OptionBox({ letter, text, isCorrect, isChosen }: OptionBoxProps) {
  const isWrongChoice = isChosen && !isCorrect;
  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-option",
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

type SegmentedProps<T extends string> = {
  label: string;
  options: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
};

function Segmented<T extends string>({ label, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap gap-0.5 rounded-lg bg-muted p-0.5">
      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-md px-2.5 text-meta font-medium",
              "transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.97] pointer-coarse:min-h-9",
              isActive ? "bg-surface text-ink shadow-card ring-1 ring-line" : "text-ink-2 hover:text-ink",
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={cn("font-mono text-caption tabular-nums", isActive ? "text-ink-2" : "text-ink-3")}>{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
