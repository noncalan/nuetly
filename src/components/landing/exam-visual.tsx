import { Check, Clock, Flag } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Illustration } from "./landing-primitives";

const QUESTION_COUNT = 30;
const ANSWERED = new Set([0, 1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13, 15, 16, 18, 20]);
const FLAGGED = new Set([5, 11]);
const CURRENT = 21;

const ANSWERED_COUNT = ANSWERED.size;
const UNANSWERED_COUNT = QUESTION_COUNT - ANSWERED_COUNT;
const PROGRESS_STYLE = { "--progress": ANSWERED_COUNT / QUESTION_COUNT } as CSSProperties;

const CELLS = Array.from({ length: QUESTION_COUNT }, (_, index) => ({
  number: index + 1,
  isAnswered: ANSWERED.has(index),
  isFlagged: FLAGGED.has(index),
  isCurrent: index === CURRENT,
}));

/** The exam navigator, frozen mid-section: answered cells in violet, two gold flags, the current question ringed. */
export function ExamVisual() {
  return (
    <Illustration
      label={`Навигатор по вопросам: ${ANSWERED_COUNT} из ${QUESTION_COUNT} отвечено, 2 отмечены флажком, таймер 23:40`}
      className="pb-4"
    >
      <div className="rounded-xl border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-h2 text-ink">Mathematics</p>
            <p className="mt-0.5 text-caption text-ink-3">
              раздел <span className="font-mono tabular-nums">1</span> из <span className="font-mono tabular-nums">2</span>
            </p>
          </div>
          <span className="flex h-9 items-center gap-1.5 rounded-lg bg-muted px-2.5 font-mono text-timer tabular-nums text-ink">
            <Clock className="size-4 opacity-60" strokeWidth={2} />
            23:40
          </span>
        </div>

        <div className="mt-5 flex items-baseline justify-between text-meta">
          <span className="text-ink">Вопросы</span>
          <span className="text-ink-2">
            <span className="font-mono tabular-nums">
              {ANSWERED_COUNT}/{QUESTION_COUNT}
            </span>{" "}
            отвечено
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
          <div className="ui-progress rounded-full bg-accent" style={PROGRESS_STYLE} />
        </div>

        <ol className="mt-5 grid grid-cols-10 gap-1 sm:gap-1.5">
          {CELLS.map((cell) => (
            <li
              key={cell.number}
              className={cn(
                "relative grid h-8 place-items-center rounded-md font-mono text-[12px] tabular-nums sm:h-9",
                cell.isAnswered ? "bg-accent font-medium text-accent-ink" : "border border-line bg-surface text-ink-2",
                cell.isCurrent && "font-semibold text-ink ring-2 ring-accent ring-offset-2 ring-offset-surface",
              )}
            >
              {cell.number}
              {cell.isFlagged && <FlagNotch className="absolute -right-1 -top-1" />}
            </li>
          ))}
        </ol>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-caption text-ink-2">
          <Legend label="Отвечено" count={ANSWERED_COUNT}>
            <span className="size-3 rounded-[3px] bg-accent" />
          </Legend>
          <Legend label="Без ответа" count={UNANSWERED_COUNT}>
            <span className="size-3 rounded-[3px] border border-control-border bg-surface" />
          </Legend>
          <Legend label="Отмечено" count={FLAGGED.size}>
            <FlagNotch />
          </Legend>
        </div>
      </div>

      <span className="absolute bottom-0 right-5 flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-caption text-ink-2 shadow-popover">
        <Check className="size-3.5 text-ink-3" strokeWidth={2} />
        Ответ сохранён
      </span>
    </Illustration>
  );
}

function Legend({ label, count, children }: { label: string; count: number; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid w-4 place-items-center">{children}</span>
      {label}
      <span className="font-mono tabular-nums text-ink">{count}</span>
    </span>
  );
}

/** Same chip as the real navigator: gold flag on a surface disc, so it reads on violet cells too. */
function FlagNotch({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-4 place-items-center rounded-full bg-surface shadow-[0_0_0_1px_var(--line)]", className)}>
      <Flag className="size-2.5 text-gold" fill="currentColor" strokeWidth={0} />
    </span>
  );
}
