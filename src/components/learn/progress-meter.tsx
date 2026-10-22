import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { Progress } from "@/lib/demo/syllabus";
import { pluralRu } from "@/lib/format";

const LESSON_FORMS = ["урока", "уроков", "уроков"] as const;

type Props = { progress: Progress; label: string; className?: string; barClassName?: string };

/** "8 из 46 уроков" with a violet progress track. */
export function ProgressMeter({ progress, label, className, barClassName }: Props) {
  const { done, total } = progress;
  const ratio = total === 0 ? 0 : done / total;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <p className="shrink-0 text-meta text-ink-2">
        <span className="font-mono font-medium tabular-nums text-ink">{done}</span> из{" "}
        <span className="font-mono tabular-nums">{total}</span> {pluralRu(total, LESSON_FORMS)}
      </p>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-valuetext={`${done} из ${total}`}
        className={cn("h-1.5 w-full min-w-16 overflow-hidden rounded-full bg-muted", barClassName)}
      >
        <div className="ui-progress rounded-full bg-accent" style={{ "--progress": ratio } as CSSProperties} />
      </div>
    </div>
  );
}
