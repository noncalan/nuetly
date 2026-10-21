"use client";

import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { EMPTY_ANSWER, type AnswerRecord } from "@/lib/demo/attempt";
import type { Question } from "@/lib/demo/questions";
import { SECTIONS, type SectionId } from "@/lib/demo/topics";
import { OPTION_LETTERS } from "@/lib/format";
import { ExamTopbar, type SaveState } from "./exam-topbar";
import { FinishSectionDialog } from "./finish-section-dialog";
import { NavigatorSheet } from "./navigator-sheet";
import { DIALOG_EXIT_MS, SHEET_EXIT_MS, usePresence } from "./overlay";
import { QuestionNavigator } from "./question-navigator";
import { QuestionPanel } from "./question-panel";
import { useCountdown } from "./use-countdown";

const SECONDS_PER_MINUTE = 60;
/** Matches Tailwind's `lg` breakpoint, where the navigator moves from the sheet to the sidebar. */
const DESKTOP_QUERY = "(min-width: 64rem)";
const TYPING_TARGET = "input, textarea, select, [contenteditable]:not([contenteditable='false'])";

type Props = {
  title: string;
  section: SectionId;
  sectionOrder: readonly SectionId[];
  questions: Question[];
  answers: Record<string, AnswerRecord>;
  startedAt: number;
  deadline: number;
  saveState: SaveState;
  onChoose: (questionId: string, choice: number) => void;
  onToggleFlag: (questionId: string) => void;
  onSpendTime: (questionId: string, seconds: number) => void;
  onFinish: () => void;
};

function isTypingTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(TYPING_TARGET) !== null;
}

export function SectionScreen(props: Props) {
  const { title, section, sectionOrder, questions, answers, startedAt, deadline, saveState } = props;
  const { onChoose, onToggleFlag, onSpendTime, onFinish } = props;

  const [index, setIndex] = useState(0);
  const [hasNavigated, setHasNavigated] = useState(false);
  const confirm = usePresence(DIALOG_EXIT_MS);
  const sheet = usePresence(SHEET_EXIT_MS);
  const enteredAt = useRef(startedAt);
  // Guards against a double click on "Завершить раздел" or a click racing the timer expiry.
  const isFinished = useRef(false);

  const question = questions[index];
  const sectionInfo = SECTIONS[section];
  const position = sectionOrder.indexOf(section);
  const isLastQuestion = index === questions.length - 1;
  const answeredCount = questions.filter((q) => (answers[q.id] ?? EMPTY_ANSWER).choice !== null).length;

  function commitTime() {
    const now = Date.now();
    onSpendTime(question.id, (now - enteredAt.current) / 1000);
    enteredAt.current = now;
  }

  function goTo(next: number) {
    if (sheet.isOpen) sheet.close();
    if (confirm.isMounted) confirm.closeNow();
    if (next < 0 || next >= questions.length || next === index) return;
    commitTime();
    setIndex(next);
    setHasNavigated(true);
  }

  function finish() {
    if (isFinished.current) return;
    isFinished.current = true;
    commitTime();
    onFinish();
  }

  const remainingSec = useCountdown(startedAt, deadline, finish);

  function handleKey(event: KeyboardEvent) {
    if (event.key === "Escape") {
      if (confirm.isOpen) confirm.closeNow();
      else if (sheet.isOpen) sheet.closeNow();
      return;
    }
    if (confirm.isMounted || sheet.isMounted) return;
    if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;

    const key = event.key.toLowerCase();
    // F always flags, even if a question ever has a sixth option labelled F.
    if (key === "f") {
      onToggleFlag(question.id);
      return;
    }
    const choice = OPTION_LETTERS.findIndex((letter) => letter.toLowerCase() === key);
    if (choice >= 0 && choice < question.options.length) {
      onChoose(question.id, choice);
    } else if (key === "arrowright") {
      goTo(index + 1);
    } else if (key === "arrowleft") {
      goTo(index - 1);
    }
  }

  const keyHandlerRef = useRef(handleKey);
  useEffect(() => {
    keyHandlerRef.current = handleKey;
  });
  useEffect(() => {
    const listener = (event: KeyboardEvent) => keyHandlerRef.current(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  // The sheet is mobile-only; if the viewport grows past `lg` it must not keep shortcuts disabled.
  const closeSheetNow = sheet.closeNow;
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const handleChange = () => {
      if (query.matches) closeSheetNow();
    };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, [closeSheetNow]);

  const navigator = (
    <QuestionNavigator
      questions={questions}
      answers={answers}
      currentIndex={index}
      sectionOrder={sectionOrder}
      currentSection={section}
      onSelect={goTo}
    />
  );

  // Everything behind an open overlay is inert, so focus and keys can't change answers there.
  const isOverlayOpen = confirm.isMounted || sheet.isMounted;

  return (
    <div className="flex h-dvh flex-col bg-canvas">
      <ExamTopbar
        title={title}
        sectionTitle={sectionInfo.title}
        sectionNumber={position + 1}
        sectionCount={sectionOrder.length}
        remainingSec={remainingSec}
        totalSec={sectionInfo.minutes * SECONDS_PER_MINUTE}
        saveState={saveState}
        onRequestFinish={confirm.open}
      />

      <div className="flex min-h-0 flex-1">
        <main inert={isOverlayOpen} className="min-w-0 flex-1 overflow-y-auto">
          <QuestionPanel
            key={question.id}
            question={question}
            total={questions.length}
            record={answers[question.id] ?? EMPTY_ANSWER}
            shouldFocusHeading={hasNavigated}
            onChoose={(choice) => onChoose(question.id, choice)}
            onToggleFlag={() => onToggleFlag(question.id)}
          />
        </main>
        <aside
          inert={isOverlayOpen}
          aria-label="Навигатор вопросов"
          className="hidden w-[288px] shrink-0 overflow-y-auto border-l border-line bg-subtle lg:block"
        >
          {navigator}
        </aside>
      </div>

      <footer inert={isOverlayOpen} className="flex h-16 shrink-0 items-center justify-between gap-3 border-t border-line bg-surface px-4 sm:px-6">
        <Button onClick={() => goTo(index - 1)} disabled={index === 0}>
          <ArrowLeft aria-hidden />
          <span className="sr-only sm:not-sr-only">Назад</span>
        </Button>

        <button
          type="button"
          onClick={sheet.open}
          aria-haspopup="dialog"
          aria-expanded={sheet.isOpen}
          aria-label={`Навигатор вопросов, отвечено ${answeredCount} из ${questions.length}`}
          className="flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-body text-ink transition-transform duration-150 ease-out hover:border-control-border active:scale-[0.97] pointer-coarse:min-h-11 lg:hidden"
        >
          <LayoutGrid aria-hidden className="size-4 text-ink-2" strokeWidth={1.75} />
          <span className="font-mono tabular-nums">
            {answeredCount}/{questions.length}
          </span>
        </button>

        {isLastQuestion ? (
          <Button variant="primary" onClick={confirm.open}>
            Завершить раздел
          </Button>
        ) : (
          <Button onClick={() => goTo(index + 1)}>
            Далее
            <ArrowRight aria-hidden />
          </Button>
        )}
      </footer>

      {sheet.isMounted && (
        <NavigatorSheet
          isClosing={sheet.isClosing}
          onClose={sheet.close}
          onRequestFinish={() => {
            sheet.closeNow();
            confirm.open();
          }}
        >
          {navigator}
        </NavigatorSheet>
      )}

      {confirm.isMounted && (
        <FinishSectionDialog
          sectionTitle={sectionInfo.title}
          isLastSection={position === sectionOrder.length - 1}
          questions={questions}
          answers={answers}
          remainingSec={remainingSec}
          isClosing={confirm.isClosing}
          onJump={goTo}
          onCancel={confirm.close}
          onConfirm={finish}
        />
      )}
    </div>
  );
}
