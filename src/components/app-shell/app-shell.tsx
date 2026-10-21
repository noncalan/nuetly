import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { STUDENT } from "@/lib/demo/student";
import { SidebarNav } from "./sidebar-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-canvas">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        К содержанию
      </a>

      <aside className="sticky top-0 hidden h-dvh w-[236px] shrink-0 flex-col border-r border-line bg-subtle px-3 py-4 lg:flex">
        <Link href="/dashboard" className="mb-6 px-2.5">
          <Logo />
        </Link>
        <SidebarNav />
        <div className="mt-auto space-y-3">
          <p className="px-2.5 text-caption text-ink-3">Прототип: все данные демонстрационные</p>
          <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface p-2 shadow-card">
            <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-[13px] font-semibold text-accent-text">
              {STUDENT.initials}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-meta font-medium">{STUDENT.name}</p>
              <p className="truncate text-[11px] text-ink-3">{STUDENT.grade} · Beta</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-canvas/90 px-4 backdrop-blur lg:hidden">
          <Link href="/dashboard">
            <Logo markOnly />
          </Link>
          <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
            <SidebarNav layout="horizontal" />
          </div>
          <ThemeToggle />
        </header>
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
