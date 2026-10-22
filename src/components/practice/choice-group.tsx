import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ChoiceOption<T extends string> = { id: T; label: ReactNode; hint?: ReactNode };

type Props<T extends string> = {
  name: string;
  legend: string;
  options: readonly ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/**
 * Segmented control built on native radios: arrow keys, Tab stop and the
 * radiogroup semantics come from the browser.
 */
export function ChoiceGroup<T extends string>({ name, legend, options, value, onChange, className }: Props<T>) {
  return (
    <fieldset className={className}>
      <legend className="text-meta font-medium text-ink-2">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-0.5 rounded-lg bg-muted p-0.5 sm:inline-flex">
        {options.map((option) => {
          const isActive = option.id === value;
          return (
            <label
              key={option.id}
              className={cn(
                "flex h-8 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 text-meta font-medium whitespace-nowrap select-none sm:flex-none",
                "transition-transform duration-150 ease-out active:scale-[0.97] pointer-coarse:min-h-11",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-accent",
                isActive ? "bg-surface text-ink shadow-card ring-1 ring-line" : "text-ink-2 hover:text-ink",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={isActive}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              {option.label}
              {option.hint !== undefined && (
                <span className={cn("font-mono text-caption tabular-nums", isActive ? "text-ink-2" : "text-ink-3")}>
                  {option.hint}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
