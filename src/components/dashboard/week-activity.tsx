import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { WEEK_ACTIVITY, WEEKLY_GOAL_MINUTES } from "@/lib/demo/student";
import { formatDuration } from "@/lib/format";
import { MonoDigits } from "./mono-digits";

const SECONDS_PER_MINUTE = 60;
/** Minutes that fill a bar to the top; longer days are clipped. */
const BAR_SCALE_MINUTES = 90;
/** Smallest visible bar for a day with any activity, in % of the track. */
const MIN_BAR_SHARE = 8;
const FULL_SHARE = 100;

function barShare(minutes: number): number {
  return Math.min(FULL_SHARE, Math.max(MIN_BAR_SHARE, (minutes / BAR_SCALE_MINUTES) * FULL_SHARE));
}

export function WeekActivity() {
  const doneMinutes = WEEK_ACTIVITY.reduce((sum, day) => sum + (day.minutes ?? 0), 0);
  const goalShare = Math.min(1, doneMinutes / WEEKLY_GOAL_MINUTES);
  const doneLabel = formatDuration(doneMinutes * SECONDS_PER_MINUTE);
  const goalLabel = formatDuration(WEEKLY_GOAL_MINUTES * SECONDS_PER_MINUTE);

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-meta font-medium text-ink">Эта неделя</h3>
        <p className="whitespace-nowrap text-meta text-ink-2">
          <MonoDigits text={doneLabel} className="font-medium text-ink" />
          <span className="text-ink-3"> из </span>
          <MonoDigits text={goalLabel} />
        </p>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className="ui-progress rounded-full bg-accent" style={{ "--progress": goalShare } as CSSProperties} />
      </div>

      <ol className="mt-4 grid grid-cols-7 gap-1.5" aria-label="Занятия по дням">
        {WEEK_ACTIVITY.map((day) => (
          <li key={day.label} className="flex flex-col items-center gap-1.5">
            <div className="flex h-16 w-full items-end overflow-hidden rounded-md bg-muted" aria-hidden>
              {day.minutes !== null && (
                <div
                  className={cn("w-full rounded-md", day.isToday ? "bg-accent" : "bg-accent/35")}
                  style={{ height: `${barShare(day.minutes)}%` }}
                />
              )}
            </div>
            <span className={cn("text-caption", day.isToday ? "font-semibold text-ink" : "font-normal text-ink-3")}>
              {day.label}
            </span>
            <span className="sr-only">
              {day.minutes === null ? "ещё впереди" : `${day.minutes} мин`}
              {day.isToday && ", сегодня"}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
