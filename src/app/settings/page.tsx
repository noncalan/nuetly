import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { ThemePicker } from "@/components/settings/theme-picker";
import { STUDENT } from "@/lib/demo/student";

export const metadata: Metadata = { title: "Настройки" };

const stagger = (index: number) => ({ "--i": index }) as CSSProperties;

const PROFILE_FIELDS = [
  { label: "Имя", value: STUDENT.name },
  { label: "Класс", value: STUDENT.grade },
  { label: "Дата экзамена", value: STUDENT.examDateLabel },
  { label: "Часов в неделю", value: "6" },
];

const LANGUAGES = [
  { code: "RU", label: "Русский", isActive: true },
  { code: "KZ", label: "Қазақша", isActive: false },
  { code: "EN", label: "English", isActive: false },
];

type SectionProps = { id: string; title: string; hint: string; index: number; children: ReactNode };

function SettingsSection({ id, title, hint, index, children }: SectionProps) {
  return (
    <section
      aria-labelledby={id}
      style={stagger(index)}
      className="ui-stagger grid gap-4 border-t border-line pt-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-10"
    >
      <div>
        <h2 id={id} className="text-h2 text-ink">
          {title}
        </h2>
        <p className="mt-1.5 text-meta text-ink-3">{hint}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[920px] px-4 py-8 sm:px-8 lg:py-10">
        <header className="ui-stagger" style={stagger(0)}>
          <p className="text-meta text-ink-3">Настройки</p>
          <h1 className="mt-1 text-h1 text-ink">Профиль и интерфейс</h1>
        </header>

        <div className="mt-8 space-y-8">
          <SettingsSection
            id="profile-title"
            title="Профиль"
            hint="Эти данные помогают строить план. В демо их нельзя изменить."
            index={1}
          >
            <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-card">
              {PROFILE_FIELDS.map((field) => (
                <div key={field.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <dt className="text-body text-ink-2">{field.label}</dt>
                  <dd className="text-body font-medium text-ink">{field.value}</dd>
                </div>
              ))}
            </dl>
          </SettingsSection>

          <SettingsSection id="theme-title" title="Оформление" hint="Тема сохраняется в этом браузере." index={2}>
            <ThemePicker />
          </SettingsSection>

          <SettingsSection
            id="language-title"
            title="Язык интерфейса"
            hint="Задачи всегда на английском, как на экзамене."
            index={3}
          >
            <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-card">
              {LANGUAGES.map((language) => (
                <li key={language.code} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="grid h-6 min-w-8 place-items-center rounded-md bg-muted px-1.5 text-caption text-ink-2">
                    {language.code}
                  </span>
                  <span className={language.isActive ? "text-body font-medium text-ink" : "text-body text-ink-3"}>
                    {language.label}
                  </span>
                  <span
                    className={
                      language.isActive
                        ? "ml-auto rounded-md bg-accent-soft px-1.5 py-0.5 text-caption text-accent-text"
                        : "ml-auto rounded-md bg-muted px-1.5 py-0.5 text-caption text-ink-3"
                    }
                  >
                    {language.isActive ? "включён" : "скоро"}
                  </span>
                </li>
              ))}
            </ul>
          </SettingsSection>

          <SettingsSection id="account-title" title="Аккаунт" hint="Подписка и вход появятся после бета-теста." index={4}>
            <div className="rounded-xl border border-line bg-surface p-5 shadow-card">
              <p className="text-body font-medium text-ink">Бесплатная бета</p>
              <p className="mt-1 text-meta text-ink-2">
                Все функции открыты. Оплата не подключена — платные тарифы появятся позже, история попыток сохранится.
              </p>
            </div>
          </SettingsSection>
        </div>
      </div>
    </AppShell>
  );
}
