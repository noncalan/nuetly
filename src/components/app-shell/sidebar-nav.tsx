"use client";

import { BookOpen, ChartColumn, LayoutGrid, Target, Timer, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  matches?: string[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Главная", icon: LayoutGrid, href: "/dashboard" },
  { label: "Пробные экзамены", icon: Timer, href: "/mocks", matches: ["/mocks", "/exam", "/results"] },
  { label: "Практика", icon: Target, href: "/practice" },
  { label: "Программа", icon: BookOpen, href: "/learn" },
  { label: "Аналитика", icon: ChartColumn, href: "/analytics" },
];

export function SidebarNav({ layout = "vertical" }: { layout?: "vertical" | "horizontal" }) {
  const pathname = usePathname();
  const isHorizontal = layout === "horizontal";
  const items = isHorizontal ? NAV_ITEMS.filter((item) => item.href) : NAV_ITEMS;

  return (
    <nav aria-label="Основная навигация">
      <ul className={cn(isHorizontal ? "flex gap-1" : "space-y-0.5")}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = (item.matches ?? [item.href]).some((path) => path && pathname.startsWith(path));
          const content = (
            <>
              <Icon className="size-4 shrink-0" strokeWidth={1.75} />
              <span className="truncate">{item.label}</span>
            </>
          );
          const base = "flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium";

          return (
            <li key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    base,
                    "transition-colors pointer-coarse:h-11",
                    isActive
                      ? "bg-surface text-ink shadow-[0_0_0_1px_var(--line),var(--shadow-card)] [&_svg]:text-accent-text"
                      : "text-ink-2 hover:bg-muted hover:text-ink active:bg-muted",
                  )}
                >
                  {content}
                </Link>
              ) : (
                <span className={cn(base, "cursor-default text-ink-3")}>
                  {content}
                  <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium leading-none">скоро</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
