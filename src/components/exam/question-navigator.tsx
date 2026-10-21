import { Flag } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EMPTY_ANSWER, type AnswerRecord } from "@/lib/demo/attempt";
import type { Question } from "@/lib/demo/questions";
import { SECTIONS, type SectionId } from "@/lib/demo/topics";

type Props = {
  questions: Question[];
  answers: Record<string, AnswerRecord>;
  currentIndex: number;
  sectionOrder: readonly SectionId[];
  currentSection: SectionId;
  onSelect: (index: number) => void;
};

export function QuestionNavigator({ questions, answers, currentIndex, sectionOrder, currentSection, onSelect }: Props) {
  const answeredCount = questions.filter((q) => (answers[q.id] ?? EMPTY_ANSWER).choice !== null).length;
  const flaggedCount = questions.filter((q) => answers[q.id]?.flagged).length;
  const unansweredCount = questions.length - answeredCount;
  const currentPosition = sectionOrder.indexOf(currentSection);
  const progressStyle = { "--progress": answeredCount / questions.length } as CSSProperties;

  return (
    <div className="p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-h2 text-ink">Вопросы</h2>
        <span className="text-meta text-ink-2">
          <span className="font-mono tabular-nums">
            {answeredCount}/{questions.length}
          </span>{" "}
          отвечено
        </span>
      </div>
      <div aria-hidden className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
        <div className="ui-progress rounded-full bg-accent" style={progressStyle} />
      </div>

      <ol className="mt-5 grid grid-cols-5 gap-1.5">
        {questions.map((question, index) => {
          const record = answers[question.id] ?? EMPTY_ANSWER;
          return (
            <li key={question.id}>
              <NavigatorCell
                number={question.number}
                isAnswered={record.choice !== null}
                isFlagged={record.flagged}
                isCurrent={index === currentIndex}
                onSelect={() => onSelect(index)}
              />
            </li>
          );
        })}
      </ol>

      <dl className="mt-5 space-y-2 text-meta text-ink-2">
        <LegendRow label="Отвечено" count={answeredCount}>
          <span className="size-3 rounded-[3px] bg-accent" />
        </LegendRow>
        <LegendRow label="Без ответа" count={unansweredCount}>
          <span className="size-3 rounded-[3px] border border-control-border bg-surface" />
        </LegendRow>
        <LegendRow label="Отмечено" count={flaggedCount}>
          <FlagNotch />
        </LegendRow>
      </dl>

      <ol aria-label="Разделы" className="mt-6 space-y-1 border-t border-line pt-5">
        {sectionOrder.map((sectionId, position) => {
          const section = SECTIONS[sectionId];
          const isCurrent = position === currentPosition;
          const state = position < currentPosition ? "Завершён" : isCurrent ? "Сейчас" : "Далее";
          return (
            <li
              key={sectionId}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-meta",
                isCurrent ? "border border-line bg-surface text-ink" : "border border-transparent text-ink-3",
              )}
            >
              <span className="font-mono tabular-nums">{position + 1}</span>
              <span className="min-w-0 flex-1 truncate">{section.title}</span>
              <span className={cn("text-caption", isCurrent ? "text-accent-text" : "text-ink-3")}>{state}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

type NavigatorCellProps = {
  number: number;
  isAnswered: boolean;
  isFlagged: boolean;
  isCurrent: boolean;
  onSelect: () => void;
};

function NavigatorCell({ number, isAnswered, isFlagged, isCurrent, onSelect }: NavigatorCellProps) {
  const status = [isAnswered ? "отвечен" : "без ответа", isFlagged && "отмечен"].filter(Boolean).join(", ");
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isCurrent ? "step" : undefined}
      aria-label={`Вопрос ${number}: ${status}`}
      className={cn(
        "relative grid h-10 w-full place-items-center rounded-md font-mono text-[13px] tabular-nums",
        "transition-transform duration-150 ease-out active:scale-[0.95]",
        isAnswered
          ? "bg-accent font-medium text-accent-ink hover:bg-accent-hover"
          : "border border-line bg-surface text-ink-2 hover:border-control-border hover:text-ink",
        isCurrent && "font-semibold ring-2 ring-accent ring-offset-2 ring-offset-subtle",
        isCurrent && !isAnswered && "text-ink",
      )}
    >
      {number}
      {isFlagged && <FlagNotch className="absolute -right-1 -top-1" />}
    </button>
  );
}

/** Gold flag on a surface chip, so it keeps its contrast on violet (answered) cells. */
function FlagNotch({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-4 place-items-center rounded-full bg-surface shadow-[0_0_0_1px_var(--line)]",
        className,
      )}
    >
      <Flag className="size-2.5 text-gold" fill="currentColor" strokeWidth={0} />
    </span>
  );
}

type LegendRowProps = {
  label: string;
  count: number;
  children: ReactNode;
};

function LegendRow({ label, count, children }: LegendRowProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden className="grid w-4 place-items-center">
        {children}
      </span>
      <dt>{label}</dt>
      <dd className="ml-auto font-mono tabular-nums text-ink">{count}</dd>
    </div>
  );
}
