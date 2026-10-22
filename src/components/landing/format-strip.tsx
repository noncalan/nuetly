import { cn } from "@/lib/cn";
import { CONTAINER } from "./landing-primitives";

type Fact = { value: string; label: string };

/** Official NUET format: Mathematics + Critical Thinking, 30 MCQ and 60 minutes each. */
const FACTS: readonly Fact[] = [
  { value: "2", label: "раздела: Mathematics и Critical Thinking" },
  { value: "60", label: "вопросов с выбором ответа, по 30 в разделе" },
  { value: "120", label: "минут: по 60 на каждый раздел" },
  { value: "60/60", label: "задач с пошаговым разбором после попытки" },
];

export function FormatStrip() {
  return (
    <section aria-labelledby="format-title" className="border-t border-line bg-subtle">
      <div className={cn(CONTAINER, "grid gap-8 py-12 sm:py-16 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-end lg:gap-12")}>
        <div>
          <p className="text-meta text-ink-3">Формат</p>
          <h2 id="format-title" className="mt-2 text-h1 text-balance text-ink">
            Как на настоящем NUET
          </h2>
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
          {FACTS.map((fact) => (
            <li key={fact.value} className="border-l border-line-strong pl-4">
              <p className="font-mono text-stat tabular-nums text-ink">{fact.value}</p>
              <p className="mt-2 text-meta text-pretty text-ink-2">{fact.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
