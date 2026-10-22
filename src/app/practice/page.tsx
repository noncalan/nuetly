import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { PracticeBuilder } from "@/components/practice/practice-builder";
import { RecommendedTopics } from "@/components/practice/recommended-topics";

export const metadata: Metadata = { title: "Практика" };

/** First-paint reveal order for the top-level blocks (keep ≤ 5). */
function stagger(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}

export default function PracticePage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[800px] px-4 py-8 sm:px-8 lg:py-10">
        <header>
          <p className="text-meta text-ink-3">Практика</p>
          <h1 className="mt-1 text-h1 text-ink">Тренировка по темам</h1>
          <p className="mt-2 text-body text-ink-2">Без таймера. Объяснения — после набора.</p>
        </header>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8">
          <RecommendedTopics className="ui-stagger" style={stagger(0)} />
          <div className="ui-stagger" style={stagger(1)}>
            <PracticeBuilder />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
