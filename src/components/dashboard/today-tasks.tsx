import { ArrowRight, BookOpen, RotateCcw, Target, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { TODAY_TASKS, type TaskKind, type TodayTask } from "@/lib/demo/student";
import { MonoDigits } from "./mono-digits";

const KIND: Record<TaskKind, { icon: LucideIcon; label: string }> = {
  practice: { icon: Target, label: "Практика" },
  review: { icon: RotateCcw, label: "Разбор" },
  lesson: { icon: BookOpen, label: "Урок" },
};

const ROW = "flex items-center gap-4 px-5 py-3.5";

type Props = { className?: string; style?: CSSProperties };

export function TodayTasks({ className, style }: Props) {
  const totalMinutes = TODAY_TASKS.reduce((sum, task) => sum + task.minutes, 0);
  // The highlighted task is the first one the student can actually open today.
  const nextId = TODAY_TASKS.find((task) => task.href)?.id;

  return (
    <section aria-labelledby="today-title" className={className} style={style}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="today-title" className="text-h2 text-ink">
          План на сегодня
        </h2>
        <MonoDigits text={`≈ ${totalMinutes} мин`} className="text-meta text-ink-3" />
      </div>
      <ol className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-card">
        {TODAY_TASKS.map((task) => (
          <li key={task.id}>
            {task.href ? <LinkedTask task={task} href={task.href} isNext={task.id === nextId} /> : <UpcomingTask task={task} />}
          </li>
        ))}
      </ol>
    </section>
  );
}

function TaskIcon({ kind, isNext }: { kind: TaskKind; isNext: boolean }) {
  const Icon = KIND[kind].icon;
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-lg border",
        isNext ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface text-ink-2",
      )}
      aria-hidden
    >
      <Icon className="size-4" strokeWidth={1.75} />
    </span>
  );
}

function TaskText({ task }: { task: TodayTask }) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block truncate text-body font-medium text-ink">{task.title}</span>
      <span className="mt-0.5 block truncate text-meta text-ink-2">
        {KIND[task.kind].label} · {task.detail}
      </span>
    </span>
  );
}

function TaskMinutes({ minutes }: { minutes: number }) {
  return <MonoDigits text={`${minutes} мин`} className="hidden shrink-0 text-meta text-ink-3 sm:block" />;
}

function LinkedTask({ task, href, isNext }: { task: TodayTask; href: string; isNext: boolean }) {
  return (
    <Link href={href} className={cn(ROW, "group transition-colors hover:bg-subtle active:bg-muted")}>
      <TaskIcon kind={task.kind} isNext={isNext} />
      <TaskText task={task} />
      <TaskMinutes minutes={task.minutes} />
      {isNext ? (
        <span className={buttonClasses({ variant: "primary", size: "sm" })}>
          Начать
          <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </span>
      ) : (
        <ArrowRight
          className="size-4 shrink-0 text-ink-3 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-ink"
          aria-hidden
        />
      )}
    </Link>
  );
}

function UpcomingTask({ task }: { task: TodayTask }) {
  return (
    <div className={ROW}>
      <div className="flex min-w-0 flex-1 items-center gap-4 opacity-60">
        <TaskIcon kind={task.kind} isNext={false} />
        <TaskText task={task} />
        <TaskMinutes minutes={task.minutes} />
      </div>
      <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-caption text-ink-2">скоро</span>
    </div>
  );
}
