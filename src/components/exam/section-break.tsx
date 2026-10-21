import { ArrowRight, Check } from "lucide-react";
import type { CSSProperties } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SECTIONS, type SectionId } from "@/lib/demo/topics";
import { formatClock, pluralRu } from "@/lib/format";

const SECONDS_PER_MINUTE = 60;

function stagger(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}

type Props = {
  completed: SectionId;
  next: SectionId;
  nextNumber: number;
  answeredCount: number;
  usedSeconds: number;
  onStartNext: () => void;
};

export function SectionBreak({ completed, next, nextNumber, answeredCount, usedSeconds, onStartNext }: Props) {
  const done = SECTIONS[completed];
  const upcoming = SECTIONS[next];
  const upcomingClock = formatClock(upcoming.minutes * SECONDS_PER_MINUTE);

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-4 py-5 sm:px-6 sm:py-8">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <main className="my-auto py-10">
          <ol aria-label="Ход экзамена" className="ui-stagger flex items-center gap-3" style={stagger(0)}>
            <li className="flex min-w-0 items-center gap-2">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
                <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
              </span>
              <span className="truncate text-meta text-ink-2">{done.title}</span>
              <span className="sr-only">— завершён</span>
            </li>
            <li aria-hidden className="h-px min-w-4 max-w-16 flex-1 bg-accent" />
            <li aria-current="step" className="flex min-w-0 items-center gap-2">
              <span className="grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] border-accent bg-surface font-mono text-caption tabular-nums text-accent-text">
                {nextNumber}
              </span>
              <span className="truncate text-meta font-medium text-ink">{upcoming.title}</span>
              <span className="sr-only">— следующий</span>
            </li>
          </ol>

          <div className="ui-stagger mt-8" style={stagger(1)}>
            <h1 className="text-h1 text-ink">Раздел {done.title} завершён</h1>
            <p className="mt-2 text-body text-ink-2">
              Сделай паузу. Таймер раздела {nextNumber} запустится, когда ты нажмёшь кнопку.
            </p>
          </div>

          <dl
            className="ui-stagger mt-6 grid grid-cols-2 divide-x divide-line rounded-xl border border-line bg-surface shadow-card"
            style={stagger(2)}
          >
            <div className="p-5">
              <dt className="text-caption text-ink-3">Отвечено</dt>
              <dd className="mt-2 font-mono text-stat tabular-nums text-ink">{answeredCount}</dd>
              <dd className="mt-1.5 text-meta text-ink-3">
                из <span className="font-mono tabular-nums">{done.questionCount}</span>
              </dd>
            </div>
            <div className="p-5">
              <dt className="text-caption text-ink-3">Время</dt>
              <dd className="mt-2 font-mono text-stat tabular-nums text-ink">{formatClock(usedSeconds)}</dd>
              <dd className="mt-1.5 text-meta text-ink-3">
                из <span className="font-mono tabular-nums">{done.minutes}:00</span>
              </dd>
            </div>
          </dl>

          <div className="ui-stagger mt-8 flex flex-wrap items-center gap-x-5 gap-y-3" style={stagger(3)}>
            <Button variant="primary" size="lg" onClick={onStartNext}>
              Начать раздел {nextNumber}
              <ArrowRight />
            </Button>
            <p className="flex items-baseline gap-2">
              <span className="font-mono text-timer tabular-nums text-ink">{upcomingClock}</span>
              <span className="text-meta text-ink-3">
                · <span className="font-mono tabular-nums">{upcoming.questionCount}</span>{" "}
                {pluralRu(upcoming.questionCount, ["вопрос", "вопроса", "вопросов"])}
              </span>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
