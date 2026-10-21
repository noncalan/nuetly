import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { HISTORY, NEXT_MOCK_TITLE, sectionDeltaAt, type HistoryEntry, type Score } from "@/lib/demo/student";
import { SECTION_IDS, SECTIONS, type SectionId } from "@/lib/demo/topics";
import { formatDuration } from "@/lib/format";
import { Delta, MonoDigits } from "./mono-digits";

const SECONDS_PER_MINUTE = 60;
/** Attempt, date, two sections, time, open — the "not started" row spans all of them. */
const COLUMN_COUNT = 6;
const MOCK_QUESTIONS = SECTION_IDS.reduce((sum, id) => sum + SECTIONS[id].questionCount, 0);
const MOCK_MINUTES = SECTION_IDS.reduce((sum, id) => sum + SECTIONS[id].minutes, 0);

const CELL = "px-3 py-3 sm:px-4";
const DESKTOP_CELL = "hidden sm:table-cell";

function ScoreCell({ score, delta }: { score: Score; delta: number | null }) {
  return (
    <span className="inline-flex flex-col whitespace-nowrap sm:flex-row sm:items-baseline sm:gap-2">
      <span className="font-mono tabular-nums text-ink">
        {score.correct}
        <span className="text-ink-3">/{score.total}</span>
      </span>
      {delta !== null && <Delta value={delta} className="text-caption" />}
    </span>
  );
}

function SectionHeader({ id }: { id: SectionId }) {
  return (
    <th scope="col" className={cn(CELL, "font-medium")}>
      <span className="sm:hidden">{SECTIONS[id].short}</span>
      <span className="hidden sm:inline">{SECTIONS[id].title}</span>
    </th>
  );
}

function NextMockRow() {
  return (
    <tr>
      <td colSpan={COLUMN_COUNT} className={CELL}>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-ink">{NEXT_MOCK_TITLE}</span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-caption text-ink-2">не начат</span>
            </p>
            <MonoDigits
              text={`${MOCK_QUESTIONS} вопросов · ${formatDuration(MOCK_MINUTES * SECONDS_PER_MINUTE)}`}
              className="mt-0.5 block text-meta text-ink-3"
            />
          </div>
          <Link href="/exam" className={buttonClasses({ variant: "primary", size: "sm" })}>
            Начать
            <ArrowRight />
          </Link>
        </div>
      </td>
    </tr>
  );
}

function AttemptRow({ entry, index }: { entry: HistoryEntry; index: number }) {
  const isLinked = Boolean(entry.href);
  return (
    <tr className={cn(isLinked && "group relative transition-colors hover:bg-subtle active:bg-muted")}>
      <th scope="row" className={cn(CELL, "text-left font-medium text-ink")}>
        {entry.href ? (
          <Link href={entry.href} className="after:absolute after:inset-0">
            {entry.title}
            <span className="sr-only"> — открыть разбор</span>
          </Link>
        ) : (
          entry.title
        )}
        <span className="mt-0.5 block text-caption font-normal text-ink-3 sm:hidden">{entry.dateLabel}</span>
      </th>
      <td className={cn(CELL, DESKTOP_CELL, "whitespace-nowrap text-ink-2")}>{entry.dateLabel}</td>
      {SECTION_IDS.map((sectionId) => (
        <td key={sectionId} className={CELL}>
          <ScoreCell score={entry[sectionId]} delta={sectionDeltaAt(index, sectionId)} />
        </td>
      ))}
      <td className={cn(CELL, DESKTOP_CELL, "whitespace-nowrap text-ink-2")}>
        <MonoDigits text={formatDuration(entry.durationSec)} />
      </td>
      <td className={cn(CELL, "w-10 text-right")}>
        {isLinked && (
          <ChevronRight
            className="ml-auto size-4 text-ink-3 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-ink"
            aria-hidden
          />
        )}
      </td>
    </tr>
  );
}

type Props = { className?: string; style?: CSSProperties };

export function AttemptHistory({ className, style }: Props) {
  // Newest first, keeping each entry's index in HISTORY for its delta.
  const rows = HISTORY.map((entry, index) => ({ entry, index })).reverse();

  return (
    <section aria-labelledby="history-title" className={className} style={style}>
      <h2 id="history-title" className="text-h2 text-ink">
        История попыток
      </h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
        <table className="w-full text-body">
          <thead>
            <tr className="border-b border-line bg-subtle text-left text-caption text-ink-3">
              <th scope="col" className={cn(CELL, "font-medium")}>
                Попытка
              </th>
              <th scope="col" className={cn(CELL, DESKTOP_CELL, "font-medium")}>
                Дата
              </th>
              {SECTION_IDS.map((sectionId) => (
                <SectionHeader key={sectionId} id={sectionId} />
              ))}
              <th scope="col" className={cn(CELL, DESKTOP_CELL, "font-medium")}>
                Время
              </th>
              <th scope="col" className={cn(CELL, "w-10")}>
                <span className="sr-only">Открыть</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            <NextMockRow />
            {rows.map(({ entry, index }) => (
              <AttemptRow key={entry.id} entry={entry} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
