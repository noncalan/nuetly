"use client";

import { Info, RotateCcw, Target } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { DEMO_ATTEMPT, parseAttempt, readStoredAttempt } from "@/lib/demo/attempt";
import { gradeAttempt } from "@/lib/demo/grading";
import { previousAttemptFor } from "@/lib/demo/student";
import { SECTION_IDS } from "@/lib/demo/topics";
import { formatDuration, percent } from "@/lib/format";
import { MonoDigits } from "./numerals";
import { QuestionReview } from "./question-review";
import { ScoreSummary, StatusLegend } from "./score-summary";
import { TimeChart } from "./time-chart";
import { TopicTable } from "./topic-table";

type Tab = "topics" | "questions" | "time";

const TABS: { id: Tab; label: string }[] = [
  { id: "topics", label: "По темам" },
  { id: "questions", label: "Разбор вопросов" },
  { id: "time", label: "Время" },
];

const DATE_FORMAT = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Almaty",
});

const subscribeToNothing = () => () => {};

export function ResultsView() {
  const raw = useSyncExternalStore(subscribeToNothing, readStoredAttempt, () => null);
  const attempt = useMemo(() => parseAttempt(raw) ?? DEMO_ATTEMPT, [raw]);
  const graded = useMemo(() => gradeAttempt(attempt), [attempt]);
  const previous = previousAttemptFor(attempt.title);

  const [tab, setTab] = useState<Tab>("topics");
  const [jump, setJump] = useState<{ id: string | null; key: number }>({ id: null, key: 0 });

  const totalCorrect = SECTION_IDS.reduce((sum, id) => sum + graded.sections[id].correct, 0);
  const totalQuestions = SECTION_IDS.reduce((sum, id) => sum + graded.sections[id].total, 0);
  const meta = `${DATE_FORMAT.format(new Date(attempt.finishedAt))} · ${formatDuration(attempt.durationSec)} · ${
    attempt.source === "demo" ? "демо-попытка" : "твоя попытка"
  }`;

  function jumpTo(questionId: string) {
    setTab("questions");
    setJump((current) => ({ id: questionId, key: current.key + 1 }));
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-8 sm:px-8 lg:py-10">
      <nav aria-label="Хлебные крошки" className="text-meta text-ink-3">
        <Link href="/dashboard" className="transition-colors hover:text-ink">
          Главная
        </Link>
        <span aria-hidden className="mx-1.5">
          /
        </span>
        <Link href="/mocks" className="transition-colors hover:text-ink">
          Пробные экзамены
        </Link>
      </nav>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-h1 text-ink">
            <MonoDigits text={attempt.title} />
          </h1>
          <p className="mt-1 text-meta text-ink-2">
            <MonoDigits text={meta} />
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/exam" className={buttonClasses()}>
            <RotateCcw />
            Новый пробный
          </Link>
          <Link href="/dashboard" className={buttonClasses({ variant: "primary" })}>
            <Target />
            Тренировать слабые темы
          </Link>
        </div>
      </header>

      <div className="mt-8">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="flex items-baseline gap-2 text-meta text-ink-2">
            Итого
            <span className="font-mono text-h2 tabular-nums text-ink">
              {totalCorrect}/{totalQuestions}
            </span>
            <span aria-hidden className="text-ink-3">
              ·
            </span>
            <span className="font-mono text-h2 tabular-nums text-ink">{percent(totalCorrect, totalQuestions)}%</span>
            верных
          </p>
          <StatusLegend />
        </div>
        <ScoreSummary graded={graded} previous={previous} onJump={jumpTo} />
        <p className="mt-3 flex items-start gap-1.5 text-caption text-ink-3">
          <Info aria-hidden className="mt-px size-3.5 shrink-0" />
          Это доля верных ответов, а не официальный балл NUET: официальная шкала стандартизирована.
        </p>
      </div>

      <ResultTabs value={tab} onChange={setTab} />

      {TABS.map((item) =>
        item.id === tab ? (
          <div
            key={`${item.id}-active`}
            role="tabpanel"
            id={`panel-${item.id}`}
            aria-labelledby={`tab-${item.id}`}
            tabIndex={0}
            className="ui-enter pt-6 focus-visible:outline-offset-4"
          >
            {tab === "topics" && <TopicTable topics={graded.topics} />}
            {tab === "questions" && <QuestionReview key={jump.key} results={graded.results} initialOpenId={jump.id} />}
            {tab === "time" && <TimeChart results={graded.results} />}
          </div>
        ) : (
          <div key={item.id} role="tabpanel" id={`panel-${item.id}`} aria-labelledby={`tab-${item.id}`} hidden />
        ),
      )}
    </div>
  );
}

const NEXT_KEY_STEP: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };

function ResultTabs({ value, onChange }: { value: Tab; onChange: (tab: Tab) => void }) {
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});

  function select(index: number) {
    const next = TABS[(index + TABS.length) % TABS.length].id;
    onChange(next);
    tabRefs.current[next]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = TABS.findIndex((item) => item.id === value);
    if (event.key in NEXT_KEY_STEP) select(current + NEXT_KEY_STEP[event.key]);
    else if (event.key === "Home") select(0);
    else if (event.key === "End") select(TABS.length - 1);
    else return;
    event.preventDefault();
  }

  return (
    <div
      role="tablist"
      aria-label="Разделы аналитики"
      onKeyDown={handleKeyDown}
      className="mt-8 flex gap-6 border-b border-line"
    >
      {TABS.map((item) => {
        const isActive = item.id === value;
        return (
          <button
            key={item.id}
            ref={(node) => {
              tabRefs.current[item.id] = node;
            }}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${item.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              "-mb-px shrink-0 border-b-2 pb-3 pt-1 text-body font-medium whitespace-nowrap transition-colors focus-visible:outline-offset-0",
              isActive ? "border-accent text-ink" : "border-transparent text-ink-2 hover:text-ink",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
