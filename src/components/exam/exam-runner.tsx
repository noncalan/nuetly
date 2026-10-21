"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EMPTY_ANSWER, saveAttempt, type AnswerRecord } from "@/lib/demo/attempt";
import { QUESTIONS_BY_SECTION } from "@/lib/demo/questions";
import { SECTIONS, type SectionId } from "@/lib/demo/topics";
import type { SaveState } from "./exam-topbar";
import { ExamIntro } from "./exam-intro";
import { SectionBreak } from "./section-break";
import { SectionScreen } from "./section-screen";

const SECTION_ORDER: readonly SectionId[] = ["math", "ct"];
const SAVE_FEEDBACK_MS = 450;

type Phase =
  | { kind: "intro" }
  | { kind: "section"; position: number; startedAt: number; deadline: number }
  | { kind: "break"; completed: number; usedSeconds: number };

type Answers = Record<string, AnswerRecord>;

export function ExamRunner({ title }: { title: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [answers, setAnswers] = useState<Answers>({});
  const [saveState, setSaveState] = useState<SaveState>("saved");
  // Mirrors `answers` synchronously so finishing reads the very last change.
  const answersRef = useRef<Answers>({});
  const examStartedAt = useRef(0);
  const saveTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(saveTimer.current), []);

  function update(questionId: string, change: (record: AnswerRecord) => AnswerRecord) {
    const next = { ...answersRef.current, [questionId]: change(answersRef.current[questionId] ?? EMPTY_ANSWER) };
    answersRef.current = next;
    setAnswers(next);
  }

  function showSaving() {
    setSaveState("saving");
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => setSaveState("saved"), SAVE_FEEDBACK_MS);
  }

  function startSection(position: number) {
    const startedAt = Date.now();
    if (position === 0) examStartedAt.current = startedAt;
    const minutes = SECTIONS[SECTION_ORDER[position]].minutes;
    setPhase({ kind: "section", position, startedAt, deadline: startedAt + minutes * 60_000 });
  }

  function finishSection(position: number, startedAt: number) {
    const now = Date.now();
    if (position < SECTION_ORDER.length - 1) {
      setPhase({ kind: "break", completed: position, usedSeconds: (now - startedAt) / 1000 });
      return;
    }
    saveAttempt({
      title,
      finishedAt: new Date(now).toISOString(),
      durationSec: Math.round((now - examStartedAt.current) / 1000),
      answers: answersRef.current,
      source: "live",
    });
    router.push("/results");
  }

  if (phase.kind === "intro") {
    return <ExamIntro title={title} sectionOrder={SECTION_ORDER} onStart={() => startSection(0)} />;
  }

  if (phase.kind === "break") {
    const completed = SECTION_ORDER[phase.completed];
    const answeredCount = QUESTIONS_BY_SECTION[completed].filter(
      (question) => (answers[question.id] ?? EMPTY_ANSWER).choice !== null,
    ).length;
    return (
      <SectionBreak
        completed={completed}
        next={SECTION_ORDER[phase.completed + 1]}
        nextNumber={phase.completed + 2}
        answeredCount={answeredCount}
        usedSeconds={phase.usedSeconds}
        onStartNext={() => startSection(phase.completed + 1)}
      />
    );
  }

  const section = SECTION_ORDER[phase.position];
  return (
    <SectionScreen
      key={section}
      title={title}
      section={section}
      sectionOrder={SECTION_ORDER}
      questions={QUESTIONS_BY_SECTION[section]}
      answers={answers}
      startedAt={phase.startedAt}
      deadline={phase.deadline}
      saveState={saveState}
      onChoose={(questionId, choice) => {
        update(questionId, (record) => ({ ...record, choice }));
        showSaving();
      }}
      onToggleFlag={(questionId) => update(questionId, (record) => ({ ...record, flagged: !record.flagged }))}
      onSpendTime={(questionId, seconds) =>
        update(questionId, (record) => ({ ...record, seconds: record.seconds + seconds }))
      }
      onFinish={() => finishSection(phase.position, phase.startedAt)}
    />
  );
}
