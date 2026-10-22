"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { MonoDigits } from "@/components/dashboard/mono-digits";
import { cn } from "@/lib/cn";
import type { TopicCell } from "@/lib/demo/analytics";
import { SECTION_IDS, SECTIONS } from "@/lib/demo/topics";
import { ChartCard } from "./chart-card";
import { SrTable } from "./sr-table";

type Order = "weak" | "syllabus";

const ORDER_OPTIONS: readonly { id: Order; label: string }[] = [
  { id: "weak", label: "Слабые сначала" },
  { id: "syllabus", label: "По программе" },
];

/**
 * Intensity bins, strongest first. Violet steps for ≥ 50 %, red steps below.
 * Text colour is chosen per fill so every bin clears AA in both themes.
 */
const BINS = [
  { min: 80, label: "80–100", cell: "bg-accent text-accent-ink", sub: "text-accent-ink" },
  { min: 65, label: "65–79", cell: "bg-accent/45 text-ink dark:bg-accent/55", sub: "text-ink" },
  { min: 50, label: "50–64", cell: "bg-accent-soft text-ink", sub: "text-ink-2" },
  { min: 35, label: "35–49", cell: "bg-danger-soft text-ink", sub: "text-ink-2" },
  { min: 0, label: "0–34", cell: "bg-danger text-white dark:text-canvas", sub: "text-white dark:text-canvas" },
] as const;

function binOf(share: number) {
  return BINS.find((bin) => share >= bin.min) ?? BINS[BINS.length - 1];
}

function sortCells(cells: readonly TopicCell[], order: Order): TopicCell[] {
  return [...cells].sort((a, b) =>
    order === "syllabus" ? a.syllabusIndex - b.syllabusIndex : a.share - b.share || b.total - a.total,
  );
}

type Props = {
  cells: TopicCell[];
  weakThreshold: number;
  sourceTitle: string;
  className?: string;
  style?: CSSProperties;
};

export function TopicMap({ cells, weakThreshold, sourceTitle, className, style }: Props) {
  const [order, setOrder] = useState<Order>("weak");

  return (
    <ChartCard
      id="topic-map"
      title="Карта тем"
      subtitle={
        <MonoDigits
          text={`${sourceTitle} · доля верных и число вопросов · слабые темы (< ${weakThreshold} %) ведут в практику`}
        />
      }
      action={<OrderToggle value={order} onChange={setOrder} />}
      className={className}
      style={style}
    >
      <div key={order} className="ui-enter grid gap-6 md:grid-cols-2">
        {SECTION_IDS.map((section) => (
          <div key={section} className="min-w-0">
            <h3 className="text-meta font-medium text-ink-2">{SECTIONS[section].title}</h3>
            <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {sortCells(
                cells.filter((cell) => cell.section === section),
                order,
              ).map((cell) => (
                <li key={cell.id} className="min-w-0">
                  <Cell cell={cell} isWeak={cell.share < weakThreshold} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ScaleLegend />

      <SrTable
        caption={`Доля верных ответов по темам, ${sourceTitle}`}
        headers={["Тема", "Раздел", "Доля верных", "Верно из", "Оценка"]}
        rows={sortCells(cells, order).map((cell) => [
          cell.name,
          SECTIONS[cell.section].short,
          `${cell.share}%`,
          `${cell.correct} из ${cell.total}`,
          cell.share < weakThreshold ? "слабая тема" : "в норме",
        ])}
      />
    </ChartCard>
  );
}

function Cell({ cell, isWeak }: { cell: TopicCell; isWeak: boolean }) {
  const bin = binOf(cell.share);
  const body = (
    <>
      <span className="line-clamp-2 min-h-8 text-caption">{cell.name}</span>
      <span className="mt-auto flex items-end justify-between gap-2 pt-2">
        <span className="font-mono text-timer tabular-nums">{cell.share}%</span>
        <span className={cn("font-mono text-caption tabular-nums", bin.sub)}>
          {cell.correct}/{cell.total}
        </span>
      </span>
    </>
  );
  const base = cn("flex h-full min-h-[92px] flex-col rounded-md p-3", bin.cell);

  if (!isWeak) return <div className={base}>{body}</div>;

  return (
    <Link
      href="/practice"
      aria-label={`${cell.name}: ${cell.share}%, верно ${cell.correct} из ${cell.total}. Слабая тема — открыть практику`}
      className={cn(
        base,
        "group relative transition-transform duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97]",
      )}
    >
      <ArrowUpRight
        aria-hidden
        className="absolute right-2 top-2 size-3.5 transition-transform duration-150 ease-out group-hover:-translate-y-px group-hover:translate-x-px"
        strokeWidth={2}
      />
      <span className="flex h-full flex-col pr-4">{body}</span>
    </Link>
  );
}

function OrderToggle({ value, onChange }: { value: Order; onChange: (order: Order) => void }) {
  return (
    <div role="group" aria-label="Порядок тем" className="inline-flex rounded-lg bg-muted p-0.5">
      {ORDER_OPTIONS.map((option) => {
        const isSelected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.id)}
            className={cn(
              "min-h-7 rounded-md px-2.5 text-caption transition-[color,background-color,transform] duration-150 active:scale-[0.97] pointer-coarse:min-h-11",
              isSelected ? "bg-surface text-ink shadow-card" : "text-ink-2 hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Sequential key for the cell fills, weakest on the left. */
function ScaleLegend() {
  const ascending = [...BINS].reverse();
  return (
    <div aria-hidden className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-caption text-ink-3">
      <span>Доля верных, %</span>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {ascending.map((bin) => (
          <li key={bin.label} className="flex items-center gap-1.5">
            <span className={cn("size-3 rounded-[3px]", bin.cell)} />
            <span className="font-mono tabular-nums text-ink-2">{bin.label}</span>
          </li>
        ))}
      </ul>
      <span className="flex items-center gap-1">
        <ArrowUpRight className="size-3.5" strokeWidth={2} />
        практика
      </span>
    </div>
  );
}
