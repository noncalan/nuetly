"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import {
  DEFAULT_PRACTICE,
  PRACTICE_COUNTS,
  PRACTICE_LEVELS,
  countExactMatches,
  practiceHref,
  type PracticeConfig,
  type PracticeCount,
  type PracticeLevel,
} from "@/lib/demo/practice";
import { SECTION_IDS, SECTIONS, type SectionId } from "@/lib/demo/topics";
import { pluralRu } from "@/lib/format";
import { ChoiceGroup } from "./choice-group";
import { ALL_TOPICS, TopicPicker } from "./topic-picker";

const SECTION_OPTIONS = SECTION_IDS.map((id) => ({ id, label: SECTIONS[id].title }));

const LEVEL_OPTIONS = PRACTICE_LEVELS.map((level) => ({
  id: level.id,
  label: level.label,
  hint: level.id === "any" ? undefined : `${level.min}–${level.max}`,
}));

const COUNT_OPTIONS = PRACTICE_COUNTS.map((count) => ({ id: String(count), label: <span className="font-mono tabular-nums">{count}</span> }));

const TASK_FORMS = ["задача", "задачи", "задач"] as const;

export function PracticeBuilder() {
  const [config, setConfig] = useState<PracticeConfig>(DEFAULT_PRACTICE);
  const exact = countExactMatches(config);

  function update(change: Partial<PracticeConfig>) {
    setConfig((current) => ({ ...current, ...change }));
  }

  return (
    <section aria-labelledby="builder-title">
      <h2 id="builder-title" className="text-h2 text-ink">
        Собрать набор
      </h2>
      <div className="mt-3 space-y-6 rounded-xl border border-line bg-surface p-4 shadow-card sm:p-6">
        <ChoiceGroup<SectionId>
          name="practice-section"
          legend="Раздел"
          options={SECTION_OPTIONS}
          value={config.section}
          onChange={(section) => update({ section, topicId: null })}
        />

        <TopicPicker
          section={config.section}
          value={config.topicId ?? ALL_TOPICS}
          onChange={(topicId) => update({ topicId: topicId === ALL_TOPICS ? null : topicId })}
        />

        <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-x-8">
          <ChoiceGroup<PracticeLevel>
            name="practice-level"
            legend="Сложность"
            options={LEVEL_OPTIONS}
            value={config.level}
            onChange={(level) => update({ level })}
          />
          <ChoiceGroup<string>
            name="practice-count"
            legend="Задач в наборе"
            options={COUNT_OPTIONS}
            value={String(config.count)}
            onChange={(count) => update({ count: Number(count) as PracticeCount })}
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-meta text-ink-3">
            <AvailabilityNote exact={exact} count={config.count} />
          </p>
          <Link href={practiceHref(config)} className={buttonClasses({ variant: "primary", size: "lg" })}>
            Начать тренировку
            <ArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

function AvailabilityNote({ exact, count }: { exact: number; count: number }) {
  if (exact >= count) {
    return (
      <>
        Под фильтр подходит <span className="font-mono tabular-nums">{exact}</span> {pluralRu(exact, TASK_FORMS)}
      </>
    );
  }
  return (
    <>
      Точно под фильтр — <span className="font-mono tabular-nums">{exact}</span> {pluralRu(exact, TASK_FORMS)}, остальные
      добавим из близкой темы и сложности
    </>
  );
}
