import { MonoDigits } from "@/components/dashboard/mono-digits";
import { cn } from "@/lib/cn";
import { LandingSection, SectionHeading } from "./landing-primitives";

type Step = { title: string; text: string; detail: string };

const STEPS: readonly Step[] = [
  {
    title: "Диагностика",
    text: "15 задач по математике и 15 по Critical Thinking. Сразу видно, с чего начинать.",
    detail: "30 вопросов · 60 мин",
  },
  {
    title: "План",
    text: "Слабые темы и дата экзамена превращаются в короткий список дел на каждый день.",
    detail: "по слабым темам",
  },
  {
    title: "Пробные и практика",
    text: "Полные пробники в формате экзамена и наборы по 10 задач на одну тему.",
    detail: "60 вопросов · 120 мин",
  },
  {
    title: "Разбор ошибок",
    text: "Баллы по разделам, темы ниже 50 % и пошаговое решение к каждой задаче.",
    detail: "после каждой попытки",
  },
];

export function HowItWorks() {
  return (
    <LandingSection id="how" labelledBy="how-title">
      <SectionHeading
        id="how-title"
        eyebrow="Как это работает"
        title="Один цикл, который повторяется до экзамена"
        lead="Каждая попытка показывает, что тренировать дальше. Ничего не нужно планировать вручную."
      />

      <ol className="mt-12 grid lg:grid-cols-4">
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;
          return (
            <li key={step.title} className={cn("relative pl-12 lg:pl-0 lg:pr-8", !isLast && "pb-10 lg:pb-0")}>
              <span
                aria-hidden
                className="absolute left-0 top-0 z-10 grid size-8 place-items-center rounded-md border border-line-strong bg-canvas font-mono text-meta font-medium tabular-nums text-ink lg:static"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {!isLast && <Connector />}

              <h3 className="text-h2 text-ink lg:mt-5">
                <span className="sr-only">Шаг {index + 1}. </span>
                {step.title}
              </h3>
              <p className="mt-2 max-w-[300px] text-body text-pretty text-ink-2">{step.text}</p>
              <MonoDigits text={step.detail} className="mt-3 block text-caption text-ink-3" />
            </li>
          );
        })}
      </ol>
    </LandingSection>
  );
}

/** Thin line to the next step: vertical on phones, horizontal from `lg`. */
function Connector() {
  return (
    <>
      <span aria-hidden className="absolute bottom-0 left-4 top-8 w-px bg-line lg:hidden" />
      <span aria-hidden className="absolute left-11 right-3 top-4 hidden h-px bg-line lg:block" />
    </>
  );
}
