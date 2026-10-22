import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { ContinueCard } from "@/components/learn/continue-card";
import { ProgressMeter } from "@/components/learn/progress-meter";
import { TopicCard } from "@/components/learn/topic-card";
import { CURRENT_LESSON, SYLLABUS_PROGRESS, sectionProgress, syllabusForSection } from "@/lib/demo/syllabus";
import { SECTION_IDS, SECTIONS, type SectionId } from "@/lib/demo/topics";

export const metadata: Metadata = { title: "Программа" };

/** First-paint reveal order for the top-level blocks (keep ≤ 5). */
function stagger(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}

export default function LearnPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-8 lg:py-10">
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="text-meta text-ink-3">Программа</p>
            <h1 className="mt-1 text-h1 text-ink">Программа подготовки к NUET</h1>
          </div>
          <ProgressMeter
            progress={SYLLABUS_PROGRESS}
            label="Пройдено уроков во всей программе"
            className="w-full sm:w-80"
          />
        </header>

        {CURRENT_LESSON && <ContinueCard lesson={CURRENT_LESSON} className="ui-stagger mt-8" style={stagger(0)} />}

        <div className="mt-8 space-y-12">
          {SECTION_IDS.map((sectionId, index) => (
            <SectionGroup key={sectionId} sectionId={sectionId} revealIndex={index + 1} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

type SectionGroupProps = { sectionId: SectionId; revealIndex: number };

function SectionGroup({ sectionId, revealIndex }: SectionGroupProps) {
  const titleId = `section-${sectionId}-title`;
  const section = SECTIONS[sectionId];
  return (
    <section aria-labelledby={titleId} className="ui-stagger" style={stagger(revealIndex)}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-3">
        <h2 id={titleId} className="text-h2 text-ink">
          {section.title}
        </h2>
        <ProgressMeter
          progress={sectionProgress(sectionId)}
          label={`Пройдено уроков в разделе ${section.title}`}
          className="w-full sm:w-64"
        />
      </div>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] items-start gap-4 xl:grid-cols-2">
        {syllabusForSection(sectionId).map((entry) => (
          <TopicCard key={entry.topic.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
