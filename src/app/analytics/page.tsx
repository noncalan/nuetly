import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ChartCard } from "@/components/analytics/chart-card";
import { DifficultyBars } from "@/components/analytics/difficulty-bars";
import { KpiRow } from "@/components/analytics/kpi-row";
import { TimeInsight } from "@/components/analytics/time-insight";
import { TopicMap } from "@/components/analytics/topic-map";
import { TrendChart } from "@/components/analytics/trend-chart";
import { AppShell } from "@/components/app-shell/app-shell";
import { MonoDigits } from "@/components/dashboard/mono-digits";
import {
  ATTEMPT_SIZES,
  AVG_SECONDS_PER_QUESTION,
  DIAGNOSTICS_TAKEN,
  DIFFICULTY_ACCURACY,
  FAST_MISTAKE_SECONDS,
  FAST_MISTAKES_TOTAL,
  MOCKS_TAKEN,
  ONE_QUESTION_SWING,
  PREVIOUS_SHORT_LABEL,
  SECTION_KPIS,
  SECTION_TIMES,
  SMALLEST_TOPIC_TOTAL,
  SOURCE_ATTEMPT,
  TOPIC_CELLS,
  TREND,
  WEAK_THRESHOLD,
  timeTakeaway,
} from "@/lib/demo/analytics";

export const metadata: Metadata = { title: "Аналитика" };

/** First-paint reveal order for the top-level blocks (keep ≤ 5). */
function stagger(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}

const SOURCE_SHORT = `пробный ${SOURCE_ATTEMPT.shortLabel}`;
const BUDGET_SECONDS = SECTION_TIMES[0]?.budgetSeconds ?? 0;

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-8 lg:py-10">
        <header>
          <p className="text-meta text-ink-3">Аналитика</p>
          <h1 className="mt-1 text-h1 text-ink">Твой прогресс</h1>
          <p className="mt-2 max-w-[60ch] text-body text-ink-2">
            Все цифры — доля верных ответов в твоих попытках, а не официальный балл NUET.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8">
          <KpiRow
            className="ui-stagger"
            style={stagger(0)}
            sections={SECTION_KPIS}
            previousLabel={PREVIOUS_SHORT_LABEL}
            mocksTaken={MOCKS_TAKEN}
            diagnosticsTaken={DIAGNOSTICS_TAKEN}
            avgSeconds={AVG_SECONDS_PER_QUESTION}
            budgetSeconds={BUDGET_SECONDS}
            sourceLabel={SOURCE_SHORT}
          />

          <ChartCard
            id="trend"
            title="Динамика по попыткам"
            subtitle="Доля верных ответов в диагностике и пробных, %. Наведи или перейди клавишей Tab к попытке."
            className="ui-stagger"
            style={stagger(1)}
          >
            <TrendChart points={TREND} />
          </ChartCard>

          <TopicMap
            className="ui-stagger"
            style={stagger(2)}
            cells={TOPIC_CELLS}
            weakThreshold={WEAK_THRESHOLD}
            sourceTitle={SOURCE_ATTEMPT.title}
          />

          <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-2">
            <DifficultyBars
              className="ui-stagger"
              style={stagger(3)}
              bands={DIFFICULTY_ACCURACY}
              weakThreshold={WEAK_THRESHOLD}
              sourceTitle={SOURCE_ATTEMPT.title}
            />
            <TimeInsight
              className="ui-stagger"
              style={stagger(4)}
              times={SECTION_TIMES}
              fastMistakes={FAST_MISTAKES_TOTAL}
              fastThresholdSeconds={FAST_MISTAKE_SECONDS}
              takeaway={timeTakeaway(SECTION_TIMES, FAST_MISTAKES_TOTAL)}
              sourceTitle={SOURCE_ATTEMPT.title}
            />
          </div>

          <Methodology />
        </div>
      </div>
    </AppShell>
  );
}

function Methodology() {
  return (
    <footer className="ui-stagger max-w-[72ch] space-y-1.5 border-t border-line pt-4 text-caption text-ink-3" style={stagger(5)}>
      <h2 className="text-caption font-semibold text-ink-2">Как считаем</h2>
      <p>
        <MonoDigits text="Доля верных = верные ответы / все вопросы раздела; пропуски считаются неверными. Это не шкала NUET и не прогноз балла." />
      </p>
      <p>
        <MonoDigits
          text={`Динамика — по диагностике (${ATTEMPT_SIZES.diagnostic} вопросов) и пробным (${ATTEMPT_SIZES.mock}). Карта тем, сложность и время — только по попытке «${SOURCE_ATTEMPT.title}».`}
        />
      </p>
      <p>
        <MonoDigits
          text={`В темах с ${SMALLEST_TOPIC_TOTAL} вопросами одна задача меняет долю на ${ONE_QUESTION_SWING} п. п., поэтому смотри и на число вопросов. Слабая тема — меньше ${WEAK_THRESHOLD} % верных.`}
        />
      </p>
    </footer>
  );
}
