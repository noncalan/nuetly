import { ArrowLeft, ArrowRight, CloudCheck, FileCheck2, Lock, Monitor, Timer, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SECTIONS, type SectionId } from "@/lib/demo/topics";
import { pluralRu } from "@/lib/format";

const MINUTES_PER_HOUR = 60;

const RULES: { icon: LucideIcon; text: string }[] = [
  { icon: Timer, text: "Таймер идёт без пауз. Когда время выйдет, раздел завершится сам." },
  { icon: CloudCheck, text: "Каждый ответ сохраняется сразу, даже если пропадёт интернет." },
  { icon: Lock, text: "К завершённому разделу вернуться нельзя." },
  { icon: FileCheck2, text: "Правильные ответы и решения появятся после экзамена." },
];

/** 120 → "2:00:00" */
function formatHours(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  return `${hours}:${String(minutes).padStart(2, "0")}:00`;
}

type Props = {
  title: string;
  sectionOrder: readonly SectionId[];
  onStart: () => void;
};

export function ExamIntro({ title, sectionOrder, onStart }: Props) {
  const totalMinutes = sectionOrder.reduce((sum, id) => sum + SECTIONS[id].minutes, 0);
  const totalQuestions = sectionOrder.reduce((sum, id) => sum + SECTIONS[id].questionCount, 0);
  const sectionCount = sectionOrder.length;

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1040px] flex-col px-4 py-5 sm:px-8 sm:py-8">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md text-body text-ink-2 hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            На главную
          </Link>
          <ThemeToggle />
        </div>

        <main className="my-auto grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <p className="text-caption text-ink-3">Пробный экзамен</p>
            <h1 className="mt-2 text-h1 text-ink">{title}</h1>
            <p className="mt-2 text-body text-ink-2">Формат настоящего NUET: два раздела подряд, у каждого свой таймер.</p>

            <div className="mt-8 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
              <table className="w-full text-left">
                <thead className="border-b border-line bg-subtle text-caption text-ink-3">
                  <tr>
                    <th scope="col" className="px-4 py-2 font-medium">
                      Раздел
                    </th>
                    <th scope="col" className="px-4 py-2 text-right font-medium">
                      Вопросов
                    </th>
                    <th scope="col" className="px-4 py-2 text-right font-medium">
                      Время
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {sectionOrder.map((id, position) => {
                    const section = SECTIONS[id];
                    return (
                      <tr key={id}>
                        <th scope="row" className="px-4 py-3 font-normal">
                          <span className="flex items-center gap-3">
                            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-muted font-mono text-caption tabular-nums text-ink-2">
                              {position + 1}
                            </span>
                            <span className="text-body font-medium text-ink">{section.title}</span>
                          </span>
                        </th>
                        <td className="px-4 py-3 text-right font-mono text-body tabular-nums text-ink-2">
                          {section.questionCount}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-body tabular-nums text-ink">
                          {section.minutes}:00
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <h2 className="mt-8 text-h2 text-ink">Правила</h2>
            <ul className="mt-3 space-y-3">
              {RULES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3 text-body text-ink-2">
                  <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-3" strokeWidth={1.75} />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <section
            aria-label="Начало экзамена"
            className="rounded-xl border border-line bg-surface p-6 shadow-card lg:sticky lg:top-8"
          >
            <p className="text-caption text-ink-3">Общее время</p>
            <p className="mt-3 font-mono text-score tabular-nums text-ink">{formatHours(totalMinutes)}</p>
            <p className="mt-3 text-meta text-ink-2">
              <span className="font-mono tabular-nums">{totalQuestions}</span>{" "}
              {pluralRu(totalQuestions, ["вопрос", "вопроса", "вопросов"])} ·{" "}
              <span className="font-mono tabular-nums">{sectionCount}</span>{" "}
              {pluralRu(sectionCount, ["раздел", "раздела", "разделов"])}
            </p>

            <div className="mt-6 border-t border-line pt-6">
              <Button variant="primary" size="lg" className="w-full" onClick={onStart}>
                Начать раздел 1
                <ArrowRight />
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-meta text-ink-3">
                <Monitor aria-hidden className="size-3.5" strokeWidth={1.75} />
                Лучше проходить с компьютера
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
