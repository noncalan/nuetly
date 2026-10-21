import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { SECTIONS, type SectionId } from "@/lib/demo/topics";

const DIGIT_RUN = /(\d+(?:[.,:]\d+)*)/;

/** Sets digit runs in Geist Mono (tabular) and leaves words in the sans face. */
export function MonoDigits({ text, className }: { text: string; className?: string }) {
  const parts = text.split(DIGIT_RUN);
  return (
    <span className={className}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="font-mono tabular-nums">
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </span>
  );
}

type QuestionTagProps = {
  section: SectionId;
  number: number;
  className?: string;
};

/** "Math·12": section tag in sans, question number in mono. */
export function QuestionTag({ section, number, className }: QuestionTagProps) {
  return (
    <span className={cn("whitespace-nowrap", className)}>
      {SECTIONS[section].short}
      <span aria-hidden>·</span>
      <span className="sr-only"> </span>
      <span className="font-mono tabular-nums">{number}</span>
    </span>
  );
}
