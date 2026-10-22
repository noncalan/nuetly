import { Check, Clock, Flag } from "lucide-react";
import { Logo } from "@/components/logo";
import { MathText } from "@/components/math-text";
import { cn } from "@/lib/cn";
import { OPTION_LETTERS } from "@/lib/format";
import { Illustration, stagger } from "./landing-primitives";

// Original demo item: f(3) = 18 − 9 + 1 = 10, so B is the selected (and correct) choice.
const PROMPT = "If $f(x) = 2x^2 - 3x + 1$, what is the value of $f(3)$?";
const OPTIONS: readonly string[] = ["$8$", "$10$", "$12$", "$16$", "$28$"];
const SELECTED_OPTION = 1;

const SECTION_SECONDS = 60 * 60;
const REMAINING_SECONDS = 47 * 60 + 12;
const TIMER_LABEL = "47:12";
const ELAPSED_SHARE = 1 - REMAINING_SECONDS / SECTION_SECONDS;

const QUESTION_COUNT = 30;
const WRONG = new Set([2, 7, 12, 16, 22, 27]);
const SKIPPED = new Set([19, 25]);

type Status = "correct" | "wrong" | "skipped";

/** Mirrors the results answer strip: teal ✓, red ✕, outlined dash. */
const STATUS_CELL: Record<Status, string> = {
  correct: "bg-success/70 text-white/80",
  wrong: "bg-danger text-white/85",
  skipped: "border border-control-border bg-muted text-ink-3",
};
const STATUS_GLYPH: Record<Status, string> = { correct: "✓", wrong: "✕", skipped: "–" };

const STRIP: readonly Status[] = Array.from({ length: QUESTION_COUNT }, (_, index) =>
  WRONG.has(index) ? "wrong" : SKIPPED.has(index) ? "skipped" : "correct",
);
const CORRECT_COUNT = STRIP.filter((status) => status === "correct").length;
const ANSWERED_COUNT = QUESTION_COUNT - SKIPPED.size;
const SHARE = Math.round((CORRECT_COUNT / QUESTION_COUNT) * 100);

export function HeroProductShot() {
  return (
    <Illustration
      label="Пример интерфейса: вопрос пробного экзамена с таймером и итог раздела Mathematics"
      className="sm:pb-12"
    >
      <ExamCard />
      <ScoreCard />
    </Illustration>
  );
}

function ExamCard() {
  return (
    <div
      className="ui-stagger overflow-hidden rounded-xl border border-line bg-surface shadow-popover"
      style={stagger(3)}
    >
      <div className="relative flex h-14 items-center gap-2.5 border-b border-line px-4">
        <Logo markOnly />
        <span className="h-5 w-px bg-line" />
        <span className="truncate rounded-md border border-line px-1.5 py-0.5 text-caption text-ink-2">
          <span className="font-mono tabular-nums">1/2</span> · Mathematics
        </span>
        <span className="ml-auto hidden items-center gap-1.5 text-caption text-ink-3 sm:flex">
          <Check className="size-3.5" />
          Ответы сохранены
        </span>
        <span className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-muted px-2.5 font-mono text-timer tabular-nums text-ink sm:ml-1">
          <Clock className="size-4 opacity-60" strokeWidth={2} />
          {TIMER_LABEL}
        </span>
        <span className="absolute inset-x-0 -bottom-px h-[3px] overflow-hidden">
          <span
            className="block h-full origin-left bg-accent"
            style={{ transform: `scaleX(${ELAPSED_SHARE})` }}
          />
        </span>
      </div>

      <div className="px-4 pb-6 pt-5 sm:px-7 sm:pb-8 sm:pt-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-h2 text-ink">
            Вопрос <span className="font-mono tabular-nums">7</span>
            <span className="font-normal text-ink-3">
              {" "}
              / <span className="font-mono tabular-nums">{QUESTION_COUNT}</span>
            </span>
          </p>
          <span className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-line px-2.5 text-caption text-ink-2">
            <Flag className="size-3" strokeWidth={2} />
            Отметить
          </span>
        </div>

        <p className="mt-4 text-option text-ink sm:text-reading">
          <MathText text={PROMPT} />
        </p>

        <ul className="mt-5 space-y-2">
          {OPTIONS.map((option, index) => {
            const isSelected = index === SELECTED_OPTION;
            return (
              <li
                key={option}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-body text-ink sm:text-option",
                  isSelected ? "border-accent bg-accent-soft ring-1 ring-accent" : "border-line bg-surface",
                )}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-md border font-mono text-[12px] font-semibold",
                    isSelected ? "border-accent bg-accent text-accent-ink" : "border-line-strong text-ink-2",
                  )}
                >
                  {OPTION_LETTERS[index]}
                </span>
                <MathText text={option} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function ScoreCard() {
  return (
    <div
      className={cn(
        "ui-stagger relative z-10 -mt-12 ml-auto mr-3 w-[272px] max-w-[calc(100%-12px)] rounded-xl border border-line bg-surface p-4 shadow-popover",
        "sm:absolute sm:bottom-0 sm:-left-4 sm:m-0 lg:-left-10",
      )}
      style={stagger(5)}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-meta font-medium text-ink">Mathematics</p>
        <p className="text-caption text-ink-3">
          <span className="font-mono tabular-nums">
            {ANSWERED_COUNT}/{QUESTION_COUNT}
          </span>{" "}
          отвечено
        </p>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="font-mono tabular-nums">
          <span className="text-score text-ink">{CORRECT_COUNT}</span>
          <span className="text-stat text-ink-3">/{QUESTION_COUNT}</span>
        </p>
        <div className="pb-1 text-right">
          <p className="font-mono text-stat tabular-nums text-ink">{SHARE}%</p>
          <p className="mt-1.5 text-caption text-success-ink">
            <span className="font-mono tabular-nums">+12</span> п.п.
          </p>
        </div>
      </div>

      <div className="ui-wipe mt-4 grid grid-cols-15 gap-[3px]">
        {STRIP.map((status, index) => (
          <span
            key={index}
            className={cn("grid h-4 place-items-center rounded-[3px] text-[8px] font-semibold leading-none", STATUS_CELL[status])}
          >
            {STATUS_GLYPH[status]}
          </span>
        ))}
      </div>
    </div>
  );
}
