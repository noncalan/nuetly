import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { MockTable } from "@/components/mocks/mock-table";
import { NextMockCard } from "@/components/mocks/next-mock-card";
import { COMPLETED_MOCKS, MOCKS, NEXT_MOCK } from "@/lib/demo/mocks";
import { percent } from "@/lib/format";

export const metadata: Metadata = { title: "Пробные экзамены" };

const stagger = (index: number) => ({ "--i": index }) as CSSProperties;

function bestShare(section: "math" | "ct"): number {
  const shares = COMPLETED_MOCKS.flatMap((mock) =>
    mock.result ? [percent(mock.result[section].correct, mock.result[section].total)] : [],
  );
  return shares.length === 0 ? 0 : Math.max(...shares);
}

const STATS = [
  { label: "Пройдено пробных", value: String(COMPLETED_MOCKS.length) },
  { label: "Лучший Math", value: `${bestShare("math")}%` },
  { label: "Лучший CT", value: `${bestShare("ct")}%` },
];

export default function MocksPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-8 lg:py-10">
        <header className="ui-stagger" style={stagger(0)}>
          <p className="text-meta text-ink-3">Пробные экзамены</p>
          <h1 className="mt-1 text-h1 text-ink">Пробные NUET</h1>
          <p className="mt-2 max-w-[640px] text-body text-ink-2">
            Полный формат: Mathematics и Critical Thinking, по 30 вопросов и 60 минут на раздел. Новые пробные выходят
            после ручной проверки каждой задачи.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
          {NEXT_MOCK && <NextMockCard mock={NEXT_MOCK} className="ui-stagger" style={stagger(1)} />}

          <dl
            className="ui-stagger grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-surface shadow-card xl:grid-cols-1 xl:divide-x-0 xl:divide-y"
            style={stagger(2)}
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="p-5">
                <dt className="text-caption text-ink-3">{stat.label}</dt>
                <dd className="mt-2 font-mono text-stat tabular-nums text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <MockTable mocks={MOCKS} className="ui-stagger xl:col-span-2" style={stagger(3)} />
        </div>
      </div>
    </AppShell>
  );
}
