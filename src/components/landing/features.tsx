import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ExamVisual } from "./exam-visual";
import { LandingSection, PointList, SectionHeading } from "./landing-primitives";
import { ProgressVisual } from "./progress-visual";
import { ReviewVisual } from "./review-visual";

type RowProps = {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  points: readonly string[];
  visual: ReactNode;
  isReversed?: boolean;
};

function FeatureRow({ id, eyebrow, title, lead, points, visual, isReversed = false }: RowProps) {
  const headingId = `${id}-title`;
  return (
    <LandingSection id={id} labelledBy={headingId}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className={cn(isReversed && "lg:order-2")}>
          <SectionHeading id={headingId} eyebrow={eyebrow} title={title} lead={lead} />
          <PointList points={points} className="mt-8 max-w-[480px]" />
        </div>
        <div className={cn("min-w-0", isReversed && "lg:order-1")}>{visual}</div>
      </div>
    </LandingSection>
  );
}

export function Features() {
  return (
    <>
      <FeatureRow
        id="exam"
        eyebrow="Экзамен"
        title="Пробник, который ведёт себя как настоящий экзамен"
        lead="Тот же темп и те же правила: решаешь в формате NUET, а не листаешь задачи по одной."
        points={[
          "Таймер считает на сервере: обновление страницы не добавит минут.",
          "Ответ сохраняется сразу после выбора — случайно закрыл вкладку, прогресс на месте.",
          "Флажки и навигатор: вернись к сомнительным вопросам в конце раздела.",
          "Клавиши A–E, стрелки и F — весь раздел можно пройти без мыши.",
        ]}
        visual={<ExamVisual />}
      />
      <FeatureRow
        id="review"
        eyebrow="Разбор"
        title="Разбор, который объясняет, а не просто ставит крестик"
        lead="Сначала два главных числа, затем — где именно теряются баллы."
        points={[
          "Результат по каждой теме и среднее время на вопрос.",
          "Темы ниже 50 % отмечены красным и сразу попадают в план.",
          "Пошаговое решение к каждой задаче, даже если ответ верный.",
        ]}
        visual={<ReviewVisual />}
        isReversed
      />
      <FeatureRow
        id="progress"
        eyebrow="Прогресс"
        title="Прогресс в цифрах, без гадания"
        lead="Видно, сколько осталось и растёт ли результат от попытки к попытке."
        points={[
          "Обратный отсчёт до даты экзамена, которую ты указал в профиле.",
          "Доля верных по каждому разделу во всех попытках.",
          "Задачи на сегодня собираются из твоих слабых тем.",
        ]}
        visual={<ProgressVisual />}
      />
    </>
  );
}
