import { Check, Lightbulb, X } from "lucide-react";
import { MathText } from "@/components/math-text";
import type { LessonBlock, LessonContent, Mistake } from "@/lib/demo/lessons/types";
import { LessonQuiz } from "./lesson-quiz";

const SECTION_SPACING = "scroll-mt-20 lg:scroll-mt-10";

type Props = { content: LessonContent };

export function LessonBody({ content }: Props) {
  return (
    <div className="space-y-12">
      {content.sections.map((section) => {
        const titleId = `${section.id}-title`;
        return (
          <section key={section.id} id={section.id} aria-labelledby={titleId} className={SECTION_SPACING}>
            <h2 id={titleId} className="text-h2 text-ink">
              {section.title}
            </h2>
            <div className="mt-3 space-y-4">
              {section.blocks.map((block, index) => (
                <Block key={index} block={block} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

type BlockProps = { block: LessonBlock };

function Block({ block }: BlockProps) {
  switch (block.kind) {
    case "text":
      return (
        <p className="text-option text-ink">
          <MathText text={block.text} />
        </p>
      );
    case "formulas":
      return <Formulas items={block.items} note={block.note} />;
    case "problem":
      return (
        <div className="rounded-xl border border-line bg-surface p-5 shadow-card">
          <p className="text-caption text-ink-3">Условие</p>
          <p lang="en" className="mt-2 text-reading text-ink">
            <MathText text={block.text} />
          </p>
        </div>
      );
    case "steps":
      return <Steps items={block.items} />;
    case "answer":
      return (
        <p className="text-option text-ink">
          <span className="font-semibold">Ответ:</span> <MathText text={block.text} />
        </p>
      );
    case "insight":
      return (
        <aside className="flex gap-3 rounded-xl border border-line bg-subtle px-4 py-3.5">
          <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-3" strokeWidth={1.75} />
          <div className="min-w-0">
            <p className="text-body font-semibold text-ink">{block.title}</p>
            <p className="mt-1 text-body text-ink-2">
              <MathText text={block.text} />
            </p>
          </div>
        </aside>
      );
    case "mistakes":
      return <Mistakes items={block.items} />;
    case "quiz":
      return <LessonQuiz questions={block.questions} />;
  }
}

type FormulasProps = { items: readonly { label: string; formula: string }[]; note?: string };

function Formulas({ items, note }: FormulasProps) {
  return (
    <div className="rounded-xl border border-line bg-subtle p-5">
      <dl className="divide-y divide-line">
        {items.map((item) => (
          <div key={item.formula} className="grid gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center">
            <dt className="text-meta text-ink-2">
              <MathText text={item.label} />
            </dt>
            <dd className="overflow-x-auto text-reading text-ink">
              <MathText text={item.formula} />
            </dd>
          </div>
        ))}
      </dl>
      {note && (
        <p className="mt-4 border-t border-line pt-4 text-body text-ink-2">
          <MathText text={note} />
        </p>
      )}
    </div>
  );
}

type StepsProps = { items: readonly string[] };

function Steps({ items }: StepsProps) {
  return (
    <div>
      <h3 className="text-caption text-ink-3">Решение</h3>
      <ol className="mt-3 space-y-3">
        {items.map((step, index) => (
          <li key={index} className="flex gap-3 text-option text-ink">
            <span
              aria-hidden
              className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-line bg-surface font-mono text-[11px] tabular-nums text-ink-2"
            >
              {index + 1}
            </span>
            <span className="min-w-0">
              <MathText text={step} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

type MistakesProps = { items: readonly Mistake[] };

function Mistakes({ items }: MistakesProps) {
  return (
    <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      {items.map((item) => (
        <li key={item.title} className="px-4 py-4 sm:px-5">
          <h3 className="text-body font-semibold text-ink">{item.title}</h3>
          <p className="mt-2 flex gap-2.5 text-body text-ink-2">
            <X aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" strokeWidth={2.5} />
            <span className="min-w-0">
              <span className="sr-only">Неверно: </span>
              <MathText text={item.wrong} />
            </span>
          </p>
          <p className="mt-1.5 flex gap-2.5 text-body text-ink">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2.5} />
            <span className="min-w-0">
              <span className="sr-only">Верно: </span>
              <MathText text={item.right} />
            </span>
          </p>
        </li>
      ))}
    </ol>
  );
}
