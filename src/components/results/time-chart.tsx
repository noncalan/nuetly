"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { QuestionResult, QuestionStatus } from "@/lib/demo/grading";
import { SECTION_IDS, SECTIONS, topicById } from "@/lib/demo/topics";
import { formatClock } from "@/lib/format";
import { MonoDigits, QuestionTag } from "./numerals";
import { STATUS_LABEL, StatusLegend } from "./score-summary";

const BAR_WIDTH = 9;
const BAR_GAP = 3;
const GROUP_GAP = 22;
const CHART_HEIGHT = 150;
const MIN_BAR_HEIGHT = 2;
const MIN_SCALE_SECONDS = 120;
const FAST_SECONDS = 30;

/** Same encoding as the answer strip, so one legend serves both. */
const BAR_FILL: Record<QuestionStatus, string> = {
  correct: "fill-success",
  wrong: "fill-danger",
  skipped: "fill-control-border",
};
const CORRECT_REST_OPACITY = "opacity-45";

type Bar = { result: QuestionResult; x: number };

function layoutBars(results: QuestionResult[]): { bars: Bar[]; groupStarts: number[]; width: number } {
  const bars: Bar[] = [];
  const groupStarts: number[] = [];
  let x = 0;
  SECTION_IDS.forEach((sectionId, groupIndex) => {
    if (groupIndex > 0) x += GROUP_GAP - BAR_GAP;
    groupStarts.push(x);
    results
      .filter((result) => result.question.section === sectionId)
      .forEach((result) => {
        bars.push({ result, x });
        x += BAR_WIDTH + BAR_GAP;
      });
  });
  return { bars, groupStarts, width: x - BAR_GAP };
}

function summarize(results: QuestionResult[]) {
  const answered = results.filter((result) => result.status !== "skipped");
  const average = answered.reduce((sum, result) => sum + result.record.seconds, 0) / Math.max(1, answered.length);
  const slowest = answered.reduce<QuestionResult | null>(
    (best, result) => (!best || result.record.seconds > best.record.seconds ? result : best),
    null,
  );
  const fastMistakes = results.filter((result) => result.status === "wrong" && result.record.seconds < FAST_SECONDS);
  const scaleMax = Math.max(MIN_SCALE_SECONDS, ...results.map((result) => result.record.seconds));
  return { average, slowest, fastMistakes: fastMistakes.length, scaleMax };
}

export function TimeChart({ results }: { results: QuestionResult[] }) {
  const { bars, groupStarts, width } = layoutBars(results);
  const { average, slowest, fastMistakes, scaleMax } = summarize(results);
  const toHeight = (seconds: number) => (seconds / scaleMax) * CHART_HEIGHT;
  const averageY = CHART_HEIGHT - toHeight(average);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const focus = results.find((result) => result.question.id === hoveredId) ?? slowest;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div className="min-w-0 rounded-xl border border-line bg-surface p-6 shadow-card">
        <p className="h-5 truncate text-meta text-ink-2">
          {focus && (
            <>
              <QuestionTag section={focus.question.section} number={focus.question.number} className="text-ink" /> ·{" "}
              {topicById(focus.question.topicId).name} ·{" "}
              <span className="font-mono tabular-nums text-ink">{formatClock(focus.record.seconds)}</span> ·{" "}
              {STATUS_LABEL[focus.status]}
            </>
          )}
        </p>
        <svg
          viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
          className="mt-4 h-auto w-full overflow-visible"
          role="img"
          aria-label={`Время на каждый вопрос, ${results.length} столбцов. Среднее ${formatClock(average)}, самый долгий ${
            slowest ? formatClock(slowest.record.seconds) : "—"
          }. Подробности в таблице ниже.`}
          onMouseLeave={() => setHoveredId(null)}
        >
          {bars.map(({ result, x }) => {
            const height = Math.max(MIN_BAR_HEIGHT, toHeight(result.record.seconds));
            const isActive = result.question.id === focus?.question.id;
            return (
              <g key={result.question.id} onMouseEnter={() => setHoveredId(result.question.id)}>
                <rect
                  x={x - BAR_GAP / 2}
                  y={0}
                  width={BAR_WIDTH + BAR_GAP}
                  height={CHART_HEIGHT}
                  rx={2}
                  className={cn("transition-[fill]", isActive ? "fill-muted duration-0" : "fill-transparent duration-150")}
                />
                <rect
                  x={x}
                  y={CHART_HEIGHT - height}
                  width={BAR_WIDTH}
                  height={height}
                  rx={2}
                  className={cn(
                    BAR_FILL[result.status],
                    "transition-opacity",
                    isActive ? "duration-0" : "duration-150",
                    result.status === "correct" && !isActive && CORRECT_REST_OPACITY,
                  )}
                />
              </g>
            );
          })}
          <line
            x1={0}
            x2={width}
            y1={averageY}
            y2={averageY}
            className="pointer-events-none stroke-ink-3"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
        </svg>
        <div aria-hidden className="relative mt-2 h-4 text-caption text-ink-3">
          {SECTION_IDS.map((sectionId, index) => (
            <span key={sectionId} className="absolute" style={{ left: `${(groupStarts[index] / width) * 100}%` }}>
              {SECTIONS[sectionId].title}
            </span>
          ))}
        </div>
        <div aria-hidden className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <StatusLegend />
          <span className="flex items-center gap-1.5 text-caption text-ink-2">
            <span className="w-4 border-t border-dashed border-ink-3" />
            среднее
          </span>
        </div>
        <TimeTable results={results} />
      </div>

      <dl className="grid content-start divide-y divide-line self-start rounded-xl border border-line bg-surface shadow-card sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
        <Stat label="Среднее на вопрос" value={formatClock(average)} />
        <Stat
          label="Самый долгий"
          value={slowest ? formatClock(slowest.record.seconds) : "—"}
          hint={slowest ? <QuestionTag section={slowest.question.section} number={slowest.question.number} /> : undefined}
        />
        <Stat
          label={<MonoDigits text={`Ошибки быстрее ${FAST_SECONDS} с`} />}
          value={String(fastMistakes)}
          hint={fastMistakes > 0 ? "читай условие до конца" : undefined}
          isAlert={fastMistakes > 0}
        />
      </dl>
    </div>
  );
}

// sr-only sits on a wrapper: a <table> ignores width:1px and would widen the page on mobile.
function TimeTable({ results }: { results: QuestionResult[] }) {
  return (
    <div className="sr-only">
      <table>
        <caption>Время на каждый вопрос</caption>
        <thead>
          <tr>
            <th scope="col">Номер</th>
            <th scope="col">Тема</th>
            <th scope="col">Время</th>
            <th scope="col">Статус</th>
          </tr>
        </thead>
        <tbody>
          {results.map(({ question, record, status }) => (
            <tr key={question.id}>
              <th scope="row">{`${SECTIONS[question.section].short} ${question.number}`}</th>
              <td>{topicById(question.topicId).name}</td>
              <td>{formatClock(record.seconds)}</td>
              <td>{STATUS_LABEL[status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type StatProps = {
  label: ReactNode;
  value: string;
  hint?: ReactNode;
  isAlert?: boolean;
};

function Stat({ label, value, hint, isAlert = false }: StatProps) {
  return (
    <div className="p-5">
      <dt className="text-meta text-ink-2">{label}</dt>
      <dd className="mt-2 flex items-baseline gap-2">
        <span className={cn("font-mono text-stat tabular-nums", isAlert ? "text-danger" : "text-ink")}>{value}</span>
        {hint && <span className="text-caption text-ink-3">{hint}</span>}
      </dd>
    </div>
  );
}
