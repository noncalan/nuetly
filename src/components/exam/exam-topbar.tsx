import { Check, Clock, LoaderCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatClock } from "@/lib/format";

export type SaveState = "saving" | "saved";

export const LOW_TIME_SECONDS = 5 * 60;

/** Spoken once each as the timer crosses them (ordered from the latest threshold). */
const TIME_WARNINGS: readonly { seconds: number; text: string }[] = [
  { seconds: 60, text: "Осталась 1 минута" },
  { seconds: 5 * 60, text: "Осталось 5 минут" },
  { seconds: 10 * 60, text: "Осталось 10 минут" },
];

function timeWarning(remainingSec: number): string {
  return TIME_WARNINGS.find((warning) => remainingSec <= warning.seconds)?.text ?? "";
}

type Props = {
  title: string;
  sectionTitle: string;
  sectionNumber: number;
  sectionCount: number;
  remainingSec: number;
  totalSec: number;
  saveState: SaveState;
  onRequestFinish: () => void;
};

export function ExamTopbar({
  title,
  sectionTitle,
  sectionNumber,
  sectionCount,
  remainingSec,
  totalSec,
  saveState,
  onRequestFinish,
}: Props) {
  const isLow = remainingSec <= LOW_TIME_SECONDS;
  const elapsedShare = Math.min(1, Math.max(0, 1 - remainingSec / totalSec));
  const isSaving = saveState === "saving";

  return (
    <header className="relative flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-4 sm:px-6">
      <Logo markOnly />
      <span aria-hidden className="h-5 w-px bg-line" />
      <div className="flex min-w-0 items-center gap-2.5">
        <p className="hidden truncate text-body font-medium text-ink sm:block">{title}</p>
        <span className="truncate rounded-md border border-line px-1.5 py-0.5 text-caption text-ink-2">
          <span className="font-mono tabular-nums">
            {sectionNumber}/{sectionCount}
          </span>{" "}
          · {sectionTitle}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <span role="status" className="sr-only md:not-sr-only">
          <span className="flex w-[136px] items-center gap-1.5 text-caption text-ink-3">
            {isSaving ? (
              <LoaderCircle aria-hidden className="size-3.5 shrink-0 animate-spin" />
            ) : (
              <Check aria-hidden className="size-3.5 shrink-0" />
            )}
            {isSaving ? "Сохраняем…" : "Ответы сохранены"}
          </span>
        </span>

        <div
          role="timer"
          aria-label={`Осталось ${formatClock(remainingSec)}`}
          className={cn(
            "flex h-10 items-center gap-2 rounded-lg px-3 font-mono text-timer tabular-nums",
            isLow ? "bg-danger-soft text-danger" : "bg-muted text-ink",
          )}
        >
          <Clock aria-hidden className="size-4 opacity-60" strokeWidth={2} />
          {formatClock(remainingSec)}
        </div>
        <p aria-live="polite" className="sr-only">
          {timeWarning(remainingSec)}
        </p>

        <ThemeToggle />
        <div className="hidden sm:block">
          <Button size="sm" onClick={onRequestFinish}>
            Завершить раздел
          </Button>
        </div>
      </div>

      <div aria-hidden className="absolute inset-x-0 -bottom-px h-[3px] overflow-hidden">
        <div
          className={cn("h-full origin-left transition-transform duration-1000 ease-linear", isLow ? "bg-danger" : "bg-accent")}
          style={{ transform: `scaleX(${elapsedShare})` }}
        />
      </div>
    </header>
  );
}
