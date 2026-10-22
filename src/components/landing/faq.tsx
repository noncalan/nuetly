import { Plus } from "lucide-react";
import { LandingSection, SectionHeading } from "./landing-primitives";

type Question = { question: string; answer: string };

const QUESTIONS: readonly Question[] = [
  {
    question: "Что такое NUET и какой у него формат?",
    answer:
      "NUET — вступительный тест Nazarbayev University. В нём два раздела: Mathematics и Critical Thinking, в каждом 30 вопросов с выбором ответа и 60 минут. Актуальные даты и правила регистрации смотри на официальном сайте NU.",
  },
  {
    question: "Это официальный сайт Nazarbayev University?",
    answer:
      "Нет. Nuetly — независимая платформа подготовки. Мы не связаны с Nazarbayev University и не имеем доступа к настоящим заданиям экзамена.",
  },
  {
    question: "Откуда берутся задачи?",
    answer:
      "Мы пишем их сами по открытому описанию формата и вручную проверяем условие, ответ и решение. Никаких «сливов» и заданий с прошлых экзаменов.",
  },
  {
    question: "Вы показываете официальный балл NUET?",
    answer:
      "Нет. Мы показываем долю верных ответов по каждому разделу и теме. Официальный балл NUET считается по стандартизированной шкале, и честно пересчитать его мы не можем.",
  },
  {
    question: "На каком языке задачи и интерфейс?",
    answer:
      "Интерфейс — на русском. Задачи — на английском, как на самом экзамене. Казахский и английский интерфейс добавим позже.",
  },
  {
    question: "Можно заниматься с телефона?",
    answer:
      "Да: практика, разбор и план работают на телефоне. Полные пробные лучше проходить за компьютером — два раздела по часу удобнее решать на большом экране.",
  },
  {
    question: "Сколько это стоит?",
    answer:
      "Пока идёт бета — бесплатно, карта не нужна. Тарифы Plus и Pro появятся позже, цены на этой странице предварительные.",
  },
];

export function Faq() {
  return (
    <LandingSection id="faq" labelledBy="faq-title">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-16">
        <SectionHeading
          id="faq-title"
          eyebrow="FAQ"
          title="Частые вопросы"
          lead="Коротко о формате, задачах и о том, чем мы не являемся."
        />

        <div className="border-t border-line">
          {QUESTIONS.map((item) => (
            <details key={item.question} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md py-4 text-option font-medium text-ink transition-colors hover:text-accent-text [&::-webkit-details-marker]:hidden">
                {item.question}
                <Plus
                  aria-hidden
                  className="size-4 shrink-0 text-ink-3 transition-transform duration-150 ease-out group-open:rotate-45"
                  strokeWidth={1.75}
                />
              </summary>
              <p className="max-w-[640px] pb-5 pr-8 text-body text-pretty text-ink-2">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}
