"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useId, useState, type CSSProperties } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Step = {
  key: "grade" | "timing" | "hours";
  title: string;
  hint: string;
  options: { value: string; label: string; note?: string }[];
};

// No official NUET dates here: students pick a rough window, the plan adapts to it.
const STEPS: Step[] = [
  {
    key: "grade",
    title: "В каком ты классе?",
    hint: "От этого зависит, сколько времени на подготовку и какие темы повторить.",
    options: [
      { value: "10", label: "10 класс" },
      { value: "11", label: "11 класс" },
      { value: "12", label: "12 класс" },
      { value: "graduate", label: "Уже окончил(а) школу" },
    ],
  },
  {
    key: "timing",
    title: "Когда планируешь сдавать NUET?",
    hint: "Точную дату можно поменять позже в профиле.",
    options: [
      { value: "soon", label: "В ближайшие 3 месяца", note: "интенсивный план" },
      { value: "mid", label: "Через 3–6 месяцев", note: "сбалансированный план" },
      { value: "later", label: "Через полгода и позже", note: "спокойный темп" },
      { value: "unknown", label: "Пока не знаю", note: "начнём с диагностики" },
    ],
  },
  {
    key: "hours",
    title: "Сколько часов в неделю готов уделять?",
    hint: "Лучше честно и стабильно, чем много и нерегулярно.",
    options: [
      { value: "2", label: "2–3 часа" },
      { value: "5", label: "4–6 часов" },
      { value: "8", label: "7–10 часов" },
      { value: "12", label: "Больше 10 часов" },
    ],
  },
];

type Answers = Partial<Record<Step["key"], string>>;

export function OnboardingFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const groupId = useId();
  const isDone = stepIndex >= STEPS.length;

  if (isDone) return <OnboardingDone onBack={() => setStepIndex(STEPS.length - 1)} />;

  const step = STEPS[stepIndex];
  const selected = answers[step.key];
  const progress = { "--progress": (stepIndex + 1) / STEPS.length } as CSSProperties;

  return (
    <div key={step.key} className="ui-enter">
      <p className="text-meta text-ink-3">
        Шаг <span className="font-mono tabular-nums">{stepIndex + 1}</span> из{" "}
        <span className="font-mono tabular-nums">{STEPS.length}</span>
      </p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
        <div className="ui-progress rounded-full bg-accent" style={progress} />
      </div>

      <fieldset className="mt-8">
        <legend className="text-h1 text-ink">{step.title}</legend>
        <p className="mt-2 text-body text-ink-2">{step.hint}</p>
        <div className="mt-6 space-y-2">
          {step.options.map((option) => {
            const isChecked = selected === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-option text-ink transition-transform duration-150 ease-out active:scale-[0.99]",
                  isChecked
                    ? "border-accent bg-accent-soft ring-1 ring-accent"
                    : "border-line bg-surface hover:border-control-border hover:bg-subtle",
                  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                )}
              >
                <input
                  type="radio"
                  name={`${groupId}-${step.key}`}
                  value={option.value}
                  checked={isChecked}
                  onChange={() => setAnswers((current) => ({ ...current, [step.key]: option.value }))}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full border",
                    isChecked ? "border-accent bg-accent text-accent-ink" : "border-control-border bg-surface",
                  )}
                >
                  {isChecked && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span className="flex-1">{option.label}</span>
                {option.note && <span className="text-meta text-ink-3">{option.note}</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => setStepIndex((index) => index - 1)} disabled={stepIndex === 0}>
          <ArrowLeft />
          Назад
        </Button>
        <Button variant="primary" onClick={() => setStepIndex((index) => index + 1)} disabled={!selected}>
          {stepIndex === STEPS.length - 1 ? "Готово" : "Дальше"}
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

function OnboardingDone({ onBack }: { onBack: () => void }) {
  return (
    <div className="ui-enter">
      <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-ink">
        <Check aria-hidden className="size-5" strokeWidth={2.5} />
      </span>
      <h1 className="mt-6 text-h1 text-ink">План почти готов</h1>
      <p className="mt-2 text-body text-ink-2">
        Осталось пройти диагностику: 15 задач по Mathematics и 15 по Critical Thinking, по{" "}
        <span className="font-mono tabular-nums">30</span> минут на раздел. По её итогам план разложит темы по неделям.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/dashboard" className={buttonClasses({ variant: "primary", size: "lg" })}>
          Открыть дашборд
          <ArrowRight />
        </Link>
        <Button size="lg" variant="ghost" onClick={onBack}>
          Изменить ответы
        </Button>
      </div>
      <p className="mt-4 text-caption text-ink-3">В демо диагностика не запускается — на дашборде уже есть пример плана.</p>
    </div>
  );
}
