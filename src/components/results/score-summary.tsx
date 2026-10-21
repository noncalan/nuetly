import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { GradedAttempt, QuestionResult, QuestionStatus, SectionScore } from "@/lib/demo/grading";
import type { HistoryEntry } from "@/lib/demo/student";
import { SECTION_IDS, SECTIONS, type SectionId } from "@/lib/demo/topics";
import { formatSigned, percent } from "@/lib/format";
import { MonoDigits } from "./numerals";

/** One encoding for every status mark on the page: answer strip, legend and time chart. */
export const STATUS_LABEL: Record<QuestionStatus, string> = {
  correct: "верно",
  wrong: "ошибка",
  skipped: "без ответа",
};

export const STATUS_GLYPH: Record<QuestionStatus, string> = {
  correct: "✓",
  wrong: "✕",
  skipped: "–",
};

export const STATUS_CELL: Record<QuestionStatus, string> = {
  correct: "bg-success/70 text-white/80",
  wrong: "bg-danger text-white/85",
  skipped: "border border-control-border bg-muted text-ink-3",
};

const STATUS_ORDER: readonly QuestionStatus[] = ["correct", "wrong", "skipped"];

type Props = {
  graded: GradedAttempt;
  previous?: HistoryEntry;
  onJump: (questionId: string) => void;
};

export function ScoreSummary({ graded, previous, onJump }: Props) {
  return (
    <section aria-label="Итог по разделам" className="grid gap-4 xl:grid-cols-2">
      {SECTION_IDS.map((id, index) => (
        <SectionScoreCard
          key={id}
          index={index}
          sectionId={id}
          score={graded.sections[id]}
          results={graded.results.filter((result) => result.question.section === id)}
          previous={previous}
          onJump={onJump}
        />
      ))}
    </section>
  );
}

type CardProps = {
  index: number;
  sectionId: SectionId;
  score: SectionScore;
  results: QuestionResult[];
  previous?: HistoryEntry;
  onJump: (questionId: string) => void;
};

function SectionScoreCard({ index, sectionId, score, results, previous, onJump }: CardProps) {
  const share = percent(score.correct, score.total);
  const previousScore = previous?.[sectionId];
  const delta = previousScore ? share - percent(previousScore.correct, previousScore.total) : null;
  const previousLabel = previous?.kind === "mock" ? previous.title.replace("Пробный NUET", "пробному") : "диагностике";
  const headingId = `score-${sectionId}`;

  return (
    <article
      aria-labelledby={headingId}
      className="ui-stagger rounded-xl border border-line bg-surface p-6 shadow-card"
      style={{ "--i": index } as CSSProperties}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={headingId} className="text-h2">
          {SECTIONS[sectionId].title}
        </h2>
        <p className="text-meta text-ink-3">
          <span className="font-mono tabular-nums">
            {score.answered}/{score.total}
          </span>{" "}
          отвечено
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="font-mono tabular-nums">
          <span className="text-score text-ink">{score.correct}</span>
          <span className="text-stat text-ink-3">/{score.total}</span>
        </p>
        <div className="pb-1 text-right">
          <p className="font-mono text-stat tabular-nums text-ink">{share}%</p>
          {delta !== null && <Delta delta={delta} previousLabel={previousLabel} />}
        </div>
      </div>

      <AnswerStrip title={SECTIONS[sectionId].title} results={results} onJump={onJump} />
    </article>
  );
}

function Delta({ delta, previousLabel }: { delta: number; previousLabel: string }) {
  const tone = delta > 0 ? "text-success-ink" : delta < 0 ? "text-danger" : "text-ink-2";
  return (
    <p className="mt-2 text-meta">
      <span className={cn("font-medium", tone)}>
        <span className="font-mono tabular-nums">{formatSigned(delta)}</span> п.п.
      </span>{" "}
      <MonoDigits text={`к ${previousLabel}`} className="text-ink-3" />
    </p>
  );
}

type StripProps = {
  title: string;
  results: QuestionResult[];
  onJump: (questionId: string) => void;
};

/**
 * 10 columns on phones (keeps cells ≥ 24px wide), two rows of 15 from `sm` up.
 * The wipe's clip-path ends at inset(0), so a 4px padded wrapper keeps hover lift and focus rings unclipped.
 */
function AnswerStrip({ title, results, onJump }: StripProps) {
  return (
    <div
      role="group"
      aria-label={`Ответы, ${title}`}
      className="ui-wipe -mx-1 -mb-1 mt-5 grid grid-cols-10 gap-1 p-1 sm:grid-cols-15"
    >
      {results.map((result) => (
        <button
          key={result.question.id}
          type="button"
          onClick={() => onJump(result.question.id)}
          title={`№${result.question.number} · ${STATUS_LABEL[result.status]}`}
          aria-label={`Вопрос ${result.question.number}: ${STATUS_LABEL[result.status]}. Открыть разбор`}
          className={cn(
            "grid h-7 min-w-0 place-items-center rounded-[3px] transition-transform duration-150 ease-out",
            "hover:-translate-y-0.5 active:scale-[0.95]",
            STATUS_CELL[result.status],
          )}
        >
          <span aria-hidden className="text-[10px] leading-none font-semibold">
            {STATUS_GLYPH[result.status]}
          </span>
        </button>
      ))}
    </div>
  );
}

export function StatusLegend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-1 text-caption text-ink-2", className)}>
      {STATUS_ORDER.map((status) => (
        <li key={status} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className={cn("grid size-3.5 place-items-center rounded-[3px] text-[8px] leading-none font-semibold", STATUS_CELL[status])}
          >
            {STATUS_GLYPH[status]}
          </span>
          {STATUS_LABEL[status]}
        </li>
      ))}
    </ul>
  );
}
