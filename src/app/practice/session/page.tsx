import type { Metadata } from "next";
import { Suspense } from "react";
import { PracticeSession } from "@/components/practice/practice-session";
import { buildPracticeSet, parsePracticeParams, practiceHref } from "@/lib/demo/practice";

export const metadata: Metadata = { title: "Тренировка" };

type SearchParams = Record<string, string | string[] | undefined>;

type Props = { searchParams: Promise<SearchParams> };

export default function PracticeSessionPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<SessionFallback />}>
      <SessionFromParams searchParams={searchParams} />
    </Suspense>
  );
}

/** Reads the URL state (runtime data, so it lives under Suspense) and builds a deterministic set. */
async function SessionFromParams({ searchParams }: Props) {
  const config = parsePracticeParams(await searchParams);
  const { questions, exactCount } = buildPracticeSet(config);
  // The key resets the client state when "Ещё набор" changes the URL.
  return <PracticeSession key={practiceHref(config)} config={config} questions={questions} exactCount={exactCount} />;
}

function SessionFallback() {
  return (
    <div className="flex h-dvh flex-col bg-canvas" aria-busy="true">
      <div className="h-14 shrink-0 border-b border-line bg-surface" />
      <div className="mx-auto w-full max-w-[720px] px-4 py-8 sm:px-8 sm:py-12">
        <p className="text-meta text-ink-3">Собираем набор…</p>
      </div>
    </div>
  );
}
