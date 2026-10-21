"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const readTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light");
  const next: Theme = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Theme still switches for this page view; it just won't be remembered.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={next === "dark" ? "Включить тёмную тему" : "Включить светлую тему"}
      className={cn(
        "grid size-8 place-items-center rounded-lg text-ink-2 transition-[background-color,color,transform] ease-out hover:bg-muted hover:text-ink active:scale-[0.94] pointer-coarse:size-11",
        className,
      )}
    >
      {theme === "dark" ? <Sun className="size-4" strokeWidth={1.75} /> : <Moon className="size-4" strokeWidth={1.75} />}
    </button>
  );
}
