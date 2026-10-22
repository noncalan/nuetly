"use client";

import { ArrowRight, Info, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type Mode = "login" | "register";

type Copy = {
  title: string;
  subtitle: string;
  submit: string;
  next: string;
  switchText: string;
  switchLink: string;
  switchHref: string;
};

const COPY: Record<Mode, Copy> = {
  login: {
    title: "Вход в Nuetly",
    subtitle: "Продолжи подготовку с того места, где остановился.",
    submit: "Войти",
    next: "/dashboard",
    switchText: "Ещё нет аккаунта?",
    switchLink: "Зарегистрироваться",
    switchHref: "/register",
  },
  register: {
    title: "Создать аккаунт",
    subtitle: "Бесплатная бета: диагностика, пробные экзамены и разбор каждой задачи.",
    submit: "Создать аккаунт",
    next: "/onboarding",
    switchText: "Уже есть аккаунт?",
    switchLink: "Войти",
    switchHref: "/login",
  },
};

const FIELD_CLASS =
  "mt-1.5 h-10 w-full rounded-lg border border-control-border bg-surface px-3 text-body text-ink placeholder:text-ink-3 transition-[border-color,box-shadow] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 pointer-coarse:h-11";

function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4">
      <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8Z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9l3.7-2.8Z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4Z" />
    </svg>
  );
}

type Props = { mode: Mode };

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const ids = useId();
  const copy = COPY[mode];

  // Prototype: nothing is stored or sent — the form only moves the user into the demo.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(copy.next);
  }

  return (
    <div>
      <h1 className="text-h1 text-ink">{copy.title}</h1>
      <p className="mt-2 text-body text-ink-2">{copy.subtitle}</p>

      <p className="mt-6 flex gap-2 rounded-lg bg-accent-soft px-3 py-2.5 text-meta text-ink-2">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
        Демо-версия: вход не настоящий, введённые данные никуда не отправляются.
      </p>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Button className="w-full" onClick={() => router.push(copy.next)}>
          <GoogleMark />
          Google
        </Button>
        <Button className="w-full" onClick={() => router.push(copy.next)}>
          <Send aria-hidden />
          Telegram
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3 text-caption text-ink-3">
        <span aria-hidden className="h-px flex-1 bg-line" />
        или по почте
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {mode === "register" && (
          <div>
            <label htmlFor={`${ids}-name`} className="text-meta font-medium text-ink">
              Имя
            </label>
            <input
              id={`${ids}-name`}
              name="name"
              autoComplete="given-name"
              className={FIELD_CLASS}
              placeholder="Как к тебе обращаться"
            />
          </div>
        )}
        <div>
          <label htmlFor={`${ids}-email`} className="text-meta font-medium text-ink">
            Почта
          </label>
          <input
            id={`${ids}-email`}
            name="email"
            type="email"
            autoComplete="email"
            className={FIELD_CLASS}
            placeholder="name@example.com"
          />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor={`${ids}-password`} className="text-meta font-medium text-ink">
              Пароль
            </label>
            {mode === "login" && <span className="text-caption text-ink-3">Восстановление — скоро</span>}
          </div>
          <input
            id={`${ids}-password`}
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className={FIELD_CLASS}
          />
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full">
          {copy.submit}
          <ArrowRight />
        </Button>
      </form>

      <p className="mt-6 text-center text-meta text-ink-2">
        {copy.switchText}{" "}
        <Link href={copy.switchHref} className="font-medium text-accent-text hover:underline">
          {copy.switchLink}
        </Link>
      </p>
    </div>
  );
}
