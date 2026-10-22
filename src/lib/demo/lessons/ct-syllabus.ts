import type { LessonSeed } from "./types";

// Demo syllabus for the Critical Thinking section. Keyed by topic id from topics.ts.

export const CT_SYLLABUS: Readonly<Record<string, readonly LessonSeed[]>> = {
  patterns: [
    {
      slug: "number-patterns",
      title: "Числовые закономерности",
      minutes: 10,
      status: "done",
      outline: ["Разности и отношения соседних членов", "Чередующиеся правила", "Проверка гипотезы на всех членах"],
    },
    {
      slug: "letter-patterns",
      title: "Буквенные и символьные ряды",
      minutes: 10,
      status: "done",
      outline: ["Позиция буквы в алфавите", "Сдвиги и пропуски", "Коды и шифры"],
    },
    {
      slug: "visual-patterns",
      title: "Фигуры и матрицы",
      minutes: 12,
      status: "not-started",
      outline: ["Что меняется: форма, число, поворот", "Строки и столбцы матрицы", "Метод исключения вариантов"],
    },
  ],
  logic: [
    {
      slug: "statements",
      title: "Высказывания и отрицание",
      minutes: 12,
      status: "done",
      outline: ["«Все», «некоторые», «ни один»", "Как правильно отрицать утверждение", "Диаграммы Эйлера"],
    },
    {
      slug: "conditionals",
      title: "«Если…, то…»: необходимое и достаточное",
      minutes: 14,
      status: "not-started",
      outline: ["Прямое, обратное и контрапозиция", "Необходимое и достаточное условие", "Типичные логические ловушки"],
    },
    {
      slug: "ordering",
      title: "Задачи на упорядочивание",
      minutes: 12,
      status: "not-started",
      outline: ["Таблица условий", "Кто выше, кто раньше", "Что следует наверняка, а что лишь возможно"],
    },
    {
      slug: "truth-tellers",
      title: "Рыцари и лжецы",
      minutes: 12,
      status: "soon",
      outline: ["Перебор гипотез", "Поиск противоречия", "Высказывания о самом себе"],
    },
  ],
  data: [
    {
      slug: "tables",
      title: "Чтение таблиц",
      minutes: 10,
      status: "not-started",
      outline: ["Где искать нужное значение", "Итоги по строкам и столбцам", "Доли и сравнения"],
    },
    {
      slug: "charts",
      title: "Диаграммы и графики",
      minutes: 12,
      status: "not-started",
      outline: ["Столбчатые и круговые диаграммы", "Тренды на линейном графике", "Оценка без точного счёта"],
    },
    {
      slug: "data-percent",
      title: "Проценты в данных",
      minutes: 12,
      status: "not-started",
      outline: ["Доля от целого", "Изменение за период", "Процентные пункты и проценты"],
    },
    {
      slug: "misleading-data",
      title: "Ловушки в представлении данных",
      minutes: 10,
      status: "soon",
      outline: ["Обрезанная ось", "Абсолютные и относительные числа", "Выводы, которые данные не подтверждают"],
    },
  ],
  spatial: [
    {
      slug: "time-schedules",
      title: "Время, расписания и часовые пояса",
      minutes: 12,
      status: "not-started",
      outline: ["Длительность через полночь", "Часовые пояса", "Пересечение расписаний"],
    },
    {
      slug: "nets-cubes",
      title: "Развёртки и кубы",
      minutes: 14,
      status: "soon",
      outline: ["Противоположные грани на развёртке", "Сборка куба в уме", "Подсчёт кубиков"],
    },
    {
      slug: "rotations",
      title: "Повороты и отражения",
      minutes: 12,
      status: "soon",
      outline: ["Поворот на 90° и 180°", "Зеркальное отражение", "Вид сверху и сбоку"],
    },
  ],
  argument: [
    {
      slug: "premises-conclusion",
      title: "Вывод и посылки",
      minutes: 12,
      status: "not-started",
      outline: ["Где в тексте главный вывод", "Посылки и примеры", "Слова-маркеры"],
    },
    {
      slug: "assumptions",
      title: "Скрытые допущения",
      minutes: 14,
      status: "not-started",
      outline: ["Что автор принимает без доказательства", "Тест отрицания", "Подмена понятий"],
    },
    {
      slug: "strengthen-weaken",
      title: "Усилить или ослабить аргумент",
      minutes: 14,
      status: "soon",
      outline: ["Какой факт бьёт по допущению", "Альтернативные объяснения", "Нерелевантные варианты"],
    },
  ],
  problem: [
    {
      slug: "constraints",
      title: "Задачи с ограничениями",
      minutes: 12,
      status: "not-started",
      outline: ["Выписать все условия", "Перебор с отсечением", "Проверка ответа по каждому условию"],
    },
    {
      slug: "best-option",
      title: "Выбор лучшего варианта",
      minutes: 12,
      status: "not-started",
      outline: ["Тарифы и цены", "Сравнение по нескольким критериям", "Точка, где варианты равны"],
    },
    {
      slug: "work-backwards",
      title: "Решение с конца",
      minutes: 10,
      status: "soon",
      outline: ["Когда известен результат", "Обратные операции", "Таблица шагов"],
    },
  ],
};
