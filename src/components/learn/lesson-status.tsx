import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { LessonStatus } from "@/lib/demo/syllabus";

export const STATUS_LABEL: Record<LessonStatus, string> = {
  done: "пройден",
  "in-progress": "в процессе",
  "not-started": "не начат",
  soon: "скоро",
};

const CHIP_BASE = "inline-flex h-5 shrink-0 items-center gap-1 rounded-md px-1.5 text-caption whitespace-nowrap";

type Props = { status: LessonStatus; className?: string };

/**
 * Status chip for a lesson. "Not started" is the neutral default and renders no chip,
 * only a screen-reader label, so the eye lands on what is done, current or not yet published.
 */
export function LessonStatusChip({ status, className }: Props) {
  if (status === "not-started") return <span className="sr-only">{STATUS_LABEL[status]}</span>;

  return (
    <span
      className={cn(
        CHIP_BASE,
        status === "done" && "bg-success-soft text-success-ink",
        status === "in-progress" && "bg-accent-soft text-accent-text",
        status === "soon" && "bg-muted text-ink-3",
        className,
      )}
    >
      {status === "done" && <Check aria-hidden className="size-3" strokeWidth={2.75} />}
      {status === "in-progress" && <span aria-hidden className="size-1.5 rounded-full bg-accent" />}
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Thin bar with one segment per lesson: teal when done, violet for the current one. */
type SegmentsProps = { statuses: readonly LessonStatus[]; className?: string };

export function LessonSegments({ statuses, className }: SegmentsProps) {
  return (
    <div aria-hidden className={cn("flex gap-1", className)}>
      {statuses.map((status, index) => (
        <span
          key={index}
          className={cn(
            "h-1 flex-1 rounded-full",
            status === "done" && "bg-success",
            status === "in-progress" && "bg-accent",
            (status === "not-started" || status === "soon") && "bg-muted",
          )}
        />
      ))}
    </div>
  );
}
