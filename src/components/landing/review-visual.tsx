import { MathText } from "@/components/math-text";
import { cn } from "@/lib/cn";
import { Illustration } from "./landing-primitives";

const WEAK_THRESHOLD = 50;
const r = String.raw;

type TopicRow = { name: string; correct: number; total: number; time: string };

const TOPICS: readonly TopicRow[] = [
  { name: "Алгебра", correct: 6, total: 7, time: "1:12" },
  { name: "Числа и проценты", correct: 2, total: 5, time: "2:05" },
  { name: "Функции", correct: 4, total: 6, time: "1:40" },
  { name: "Геометрия", correct: 3, total: 6, time: "1:58" },
];

// Original demo item — the same one the results screen uses for its worked solution.
const PROMPT = r`After a $20\%$ discount, a jacket costs $12\,000$ tenge. What was the original price?`;
const STEPS: readonly string[] = [
  r`After the discount the buyer pays $100\% - 20\% = 80\%$ of the original price $P$.`,
  r`$0.8P = 12\,000$, so $P = 12\,000 / 0.8 = 15\,000$.`,
];

function share(row: TopicRow): number {
  return Math.round((row.correct / row.total) * 100);
}

/** Per-topic table with one weak row in red, overlapped by a worked solution. */
export function ReviewVisual() {
  return (
    <Illustration label="Разбор попытки: таблица результатов по темам и пошаговое решение задачи с верным и неверным ответом">
      <TopicCard />
      <SolutionCard />
    </Illustration>
  );
}

function TopicCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card lg:mr-12">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-line bg-subtle px-4 py-2.5 text-caption text-ink-3 sm:grid-cols-[minmax(0,1fr)_auto_48px]">
        <span>Тема</span>
        <span>Результат</span>
        <span className="hidden text-right sm:block">Время</span>
      </div>
      <ul>
        {TOPICS.map((row) => {
          const value = share(row);
          const isWeak = value < WEAK_THRESHOLD;
          return (
            <li
              key={row.name}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-line px-4 py-3 text-body last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto_48px]"
            >
              <span className="flex min-w-0 items-center gap-2.5 font-medium text-ink">
                <span className={cn("size-1.5 shrink-0 rounded-full", isWeak ? "bg-danger" : "bg-transparent")} />
                <span className="truncate">{row.name}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-muted sm:block">
                  <span
                    className={cn("block h-full rounded-full", isWeak ? "bg-danger" : "bg-ink-3")}
                    style={{ width: `${value}%` }}
                  />
                </span>
                <span className="w-8 font-mono tabular-nums text-ink">
                  {row.correct}/{row.total}
                </span>
                <span className="w-9 text-right font-mono tabular-nums text-ink-3">{value}%</span>
              </span>
              <span className="hidden text-right font-mono tabular-nums text-ink-2 sm:block">{row.time}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SolutionCard() {
  return (
    <div
      className={cn(
        "relative z-10 -mt-6 ml-6 rounded-xl border border-line bg-surface p-5 shadow-popover sm:ml-16",
        "lg:-mt-10 lg:ml-20 lg:mr-0",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-h2 text-ink">
          Вопрос <span className="font-mono tabular-nums">14</span>
        </p>
        <span className="truncate rounded-md border border-line px-1.5 py-0.5 text-caption text-ink-2">
          Числа и проценты
        </span>
      </div>
      <p className="mt-3 text-body text-ink">
        <MathText text={PROMPT} />
      </p>

      <div className="mt-4 space-y-1.5 text-meta">
        <p className="flex items-center gap-2 text-danger">
          <Glyph className="bg-danger">✕</Glyph>
          <span>
            Твой ответ: D · <MathText text={r`$16\,000$`} />
          </span>
        </p>
        <p className="flex items-center gap-2 text-success-ink">
          <Glyph className="bg-success/70">✓</Glyph>
          <span>
            Верный ответ: B · <MathText text={r`$15\,000$`} />
          </span>
        </p>
      </div>

      <div className="mt-4 rounded-lg bg-subtle p-4">
        <p className="text-caption text-ink-3">Решение</p>
        <ol className="mt-2 space-y-2 text-meta text-ink-2">
          {STEPS.map((step, index) => (
            <li key={step} className="flex gap-2.5">
              <span className="font-mono tabular-nums text-ink-3">{index + 1}</span>
              <MathText text={step} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Glyph({ className, children }: { className: string; children: string }) {
  return (
    <span
      className={cn("grid size-4 shrink-0 place-items-center rounded-[3px] text-[9px] font-semibold leading-none text-white/90", className)}
    >
      {children}
    </span>
  );
}
