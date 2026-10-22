import { ArrowLeft, LayoutGrid } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = { title: "Страница не найдена" };

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="mx-auto flex w-full max-w-[1120px] items-center px-4 py-5 sm:px-8">
        <Link href="/" className="rounded-md">
          <Logo />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-4 pb-24 sm:px-8">
        <p className="font-mono text-display tabular-nums text-accent-text">404</p>
        <h1 className="mt-6 text-h1 text-ink">Такой страницы нет</h1>
        <p className="mt-2 text-body text-ink-2">
          Возможно, ссылка устарела или в адресе опечатка. Вернись на главную или открой свой дашборд.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/dashboard" className={buttonClasses({ variant: "primary" })}>
            <LayoutGrid />
            Открыть дашборд
          </Link>
          <Link href="/" className={buttonClasses()}>
            <ArrowLeft />
            На главную
          </Link>
        </div>
      </main>
    </div>
  );
}
