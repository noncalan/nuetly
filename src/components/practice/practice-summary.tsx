"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { DEMO_ATTEMPT } from "@/lib/demo/attempt";
import type { QuestionStatus } from "@/lib/demo/grading";
import { TOPIC_ACCURACY, levelInfo, nextSetHref, practiceTitle, type PracticeConfig } from "@/lib/demo/practice";
import { SECTIONS } from "@/lib/demo/topics";
import { percent } from "@/lib/format";
import { PracticeReview, STATUS_LABEL, type PracticeResult } from "./practice-review";

const STATUS_ORDER: readonly QuestionStatus[] = ["correct", "wrong", "skipped"];

const STATUS_GLYPH: Record<QuestionStatus, string> = { correct: "✓", wrong: "✕", skipped: "–" };

const STATUS_CELL: Record<QuestionStatus, string> = {
  correct: "bg-success/70 text-white/80",
  wrong: "bg-danger text-white/85",
  skipped: "border border-control-border bg-muted text-ink-3",
};

type Props = {
  config: PracticeConfig;
  results: readonly PracticeResult[];
  exactCount: number;
};

export function PracticeSummary({ config, results, exactCount }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const total = results.length;
  const correct = results.filter((result) => result.status === "correct").length;
  const share = percent(correct, total);
  const baseline = config.topicId ? TOPIC_ACCURACY[config.topicId] : undefined;
  const level = levelInfo(config.level);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="mx-auto w-full max-w-[800px] px-4 py-8 sm:px-8 sm:py-12">
      <header>
        <p className="text-meta text-ink-3">
          Набор завершён · {SECTIONS[config.section].title} · {level.label}
        </p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-1 text-h1 text-ink outline-none!">
          {practiceTitle(config)}
        </h1>
      </header>

      <section aria-label="Итог набора" className="ui-enter mt-8 rounded-xl border border-line bg-surface p-6 shadow-card">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="font-mono tabular-nums">
            <span className="text-score text-ink">{correct}</span>
            <span className="text-stat text-ink-3">/{total}</span>
            <span className="sr-only"> верно</span>
          </p>
          <p className="pb-1 text-right">
            <span className="block font-mono text-stat tabular-nums text-ink">{share}%</span>
            <span className="mt-1 block text-meta text-ink-3">верных ответов</span>
          </p>
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-meta text-ink-2">
          {STATUS_ORDER.map((status) => (
            <li key={status} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className={cn("grid size-4 place-items-center rounded-[3px] text-[9px] leading-none font-semibold", STATUS_CELL[status])}
              >
                {STATUS_GLYPH[status]}
              </span>
              {STATUS_LABEL[status]}
              <span className="font-mono tabular-nums text-ink">
                {results.filter((result) => result.status === status).length}
              </span>
            </li>
          ))}
        </ul>

        {(baseline || exactCount < total) && (
          <div className="mt-5 space-y-1 border-t border-line pt-4 text-meta text-ink-3">
            {baseline && (
              <p>
                В «{DEMO_ATTEMPT.title}» по этой теме —{" "}
                <span className="font-mono tabular-nums text-ink-2">{baseline.share}%</span>
              </p>
            )}
            {exactCount < total && (
              <p>
                Точно под фильтр подошло <span className="font-mono tabular-nums">{exactCount}</span> из{" "}
                <span className="font-mono tabular-nums">{total}</span>, остальные — из близкой темы и сложности
              </p>
            )}
          </div>
        )}
      </section>

      <section aria-labelledby="practice-review-title" className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="practice-review-title" className="text-h2 text-ink">
            Разбор задач
          </h2>
          <p className="text-meta text-ink-3">Открой задачу, чтобы увидеть решение по шагам</p>
        </div>
        <div className="mt-3">
          <PracticeReview results={results} />
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Link href={nextSetHref(config)} className={buttonClasses({ variant: "primary", size: "lg" })}>
          <RotateCcw aria-hidden />
          {config.topicId ? "Ещё набор по этой теме" : "Ещё набор по разделу"}
        </Link>
        <Link href="/practice" className={buttonClasses({ size: "lg" })}>
          К практике
          <ArrowRight aria-hidden />
        </Link>
      </div>
    </div>
  );
}
