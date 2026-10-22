import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { DAYS_UNTIL_EXAM } from "@/lib/demo/student";
import { pluralRu } from "@/lib/format";

const FORMAT_FACTS = [
  { value: "2", label: "раздела" },
  { value: "60", label: "вопросов" },
  { value: "120", label: "минут" },
];

type Props = { children: ReactNode };

/** Split auth screen: form on the left, a quiet product panel on the right (desktop only). */
export function AuthLayout({ children }: Props) {
  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
      <div className="flex flex-col px-4 py-5 sm:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="rounded-md">
            <Logo />
          </Link>
          <ThemeToggle />
        </header>
        <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">{children}</main>
        <p className="text-center text-caption text-ink-3">
          Nuetly — независимая платформа подготовки и не связана с Nazarbayev University.
        </p>
      </div>

      <aside
        aria-label="О формате NUET"
        className="hidden flex-col justify-between border-l border-line bg-subtle p-10 lg:flex"
      >
        <p className="text-caption text-ink-3">Формат как на настоящем NUET</p>
        <div>
          <p className="font-mono text-display tabular-nums text-accent-text">{DAYS_UNTIL_EXAM}</p>
          <p className="mt-3 text-h2 text-ink">
            {pluralRu(DAYS_UNTIL_EXAM, ["день", "дня", "дней"])} до экзамена в демо-профиле
          </p>
          <p className="mt-2 max-w-[360px] text-body text-ink-2">
            Диагностика покажет текущий уровень, план разложит подготовку по неделям, а разбор каждой задачи —
            где именно теряются баллы.
          </p>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-surface shadow-card">
          {FORMAT_FACTS.map((fact) => (
            // dt must precede dd in the DOM; flex-col-reverse puts the number on top visually.
            <div key={fact.label} className="flex flex-col-reverse p-4">
              <dt className="mt-1 text-meta text-ink-3">{fact.label}</dt>
              <dd className="font-mono text-stat tabular-nums text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
