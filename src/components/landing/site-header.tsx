import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { CONTAINER } from "./landing-primitives";

export const PAGE_NAV: readonly { href: string; label: string }[] = [
  { href: "#how", label: "Как это работает" },
  { href: "#exam", label: "Экзамен" },
  { href: "#review", label: "Разбор" },
  { href: "#pricing", label: "Тарифы" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <a
        href="#main"
        className="sr-only rounded-lg bg-surface px-3 py-2 text-meta font-medium text-ink shadow-popover focus:not-sr-only focus:absolute focus:left-4 focus:top-2.5 focus:z-50"
      >
        Перейти к содержанию
      </a>
      <div className={cn(CONTAINER, "flex h-14 items-center gap-2")}>
        <Link href="/" className="mr-3 rounded-md lg:mr-6">
          <Logo />
        </Link>

        <nav aria-label="Разделы страницы" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {PAGE_NAV.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-md px-2.5 py-1.5 text-meta text-ink-2 transition-colors hover:bg-muted hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Link href="/login" className={buttonClasses({ variant: "secondary", size: "sm" })}>
            Войти
          </Link>
          <Link href="/dashboard" className={buttonClasses({ variant: "primary", size: "sm" })}>
            Открыть демо
          </Link>
        </div>
      </div>
    </header>
  );
}
