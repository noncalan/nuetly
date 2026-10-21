import { cn } from "@/lib/cn";
import { formatSigned } from "@/lib/format";

const DIGIT_RUN = /(\d+)/;

type MonoDigitsProps = { text: string; className?: string };

/** Renders "2 ч 40 мин" with the digits in tabular mono and the words left in sans. */
export function MonoDigits({ text, className }: MonoDigitsProps) {
  const parts = text.split(DIGIT_RUN);
  return (
    <span className={className}>
      {parts.map((part, index) =>
        // split() with a capture group puts the digit runs at odd indexes.
        index % 2 === 1 ? (
          <span key={index} className="font-mono tabular-nums">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
}

type DeltaProps = { value: number; className?: string };

/** Signed percentage-point change; the sign carries the meaning, colour only reinforces it. */
export function Delta({ value, className }: DeltaProps) {
  return (
    <span
      className={cn(
        "font-mono font-medium tabular-nums",
        value > 0 && "text-success-ink",
        value < 0 && "text-danger",
        value === 0 && "text-ink-3",
        className,
      )}
    >
      {formatSigned(value)}
      <span className="sr-only"> п. п. к прошлой попытке</span>
    </span>
  );
}
