import { ArrowRight, RotateCcw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { AttemptHistory } from "@/components/dashboard/attempt-history";
import { ExamCountdown } from "@/components/dashboard/exam-countdown";
import { ReadinessCard } from "@/components/dashboard/readiness-card";
import { TodayTasks } from "@/components/dashboard/today-tasks";
import { WeakTopics } from "@/components/dashboard/weak-topics";
import { buttonClasses } from "@/components/ui/button";
import { NEXT_MOCK_TITLE, STUDENT, TODAY_LABEL } from "@/lib/demo/student";

export const metadata: Metadata = { title: "Главная" };

/** First-paint reveal order for the top-level blocks (keep ≤ 5). */
function stagger(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-8 lg:py-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-meta text-ink-3">{TODAY_LABEL}</p>
            <h1 className="mt-1 text-h1 text-ink">Привет, {STUDENT.name}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/results" className={buttonClasses()}>
              <RotateCcw />
              Последний разбор
            </Link>
            <Link href="/exam" className={buttonClasses({ variant: "primary" })}>
              Начать {NEXT_MOCK_TITLE.replace("Пробный NUET", "пробный")}
              <ArrowRight />
            </Link>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <ExamCountdown className="ui-stagger" style={stagger(0)} />
          <ReadinessCard className="ui-stagger" style={stagger(1)} />
          <TodayTasks className="ui-stagger" style={stagger(2)} />
          <WeakTopics className="ui-stagger" style={stagger(3)} />
          <AttemptHistory className="ui-stagger xl:col-span-2" style={stagger(4)} />
        </div>
      </div>
    </AppShell>
  );
}
