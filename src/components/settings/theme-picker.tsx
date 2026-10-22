"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

type Choice = Theme | "system";

const CHOICES: { value: Choice; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
  { value: "system", label: "Как в системе", icon: Monitor },
];

const DARK_QUERY = "(prefers-color-scheme: dark)";
const CHANGE_EVENT = "nuetly:themechange";

function readChoice(): Choice {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

// The resolved theme can stay the same while the stored choice changes (dark → system on a dark OS),
// so listen for our own event as well as the attribute.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    observer.disconnect();
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function applyChoice(choice: Choice) {
  const resolved: Theme = choice === "system" ? (matchMedia(DARK_QUERY).matches ? "dark" : "light") : choice;
  try {
    if (choice === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Storage blocked: the theme still applies for this page view.
  }
  document.documentElement.dataset.theme = resolved;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function ThemePicker() {
  const choice = useSyncExternalStore(subscribe, readChoice, () => "system" as Choice);

  return (
    <div role="radiogroup" aria-label="Тема оформления" className="grid gap-2 sm:grid-cols-3">
      {CHOICES.map(({ value, label, icon: Icon }) => {
        const isChecked = choice === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isChecked}
            onClick={() => applyChoice(value)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-body font-medium transition-transform duration-150 ease-out active:scale-[0.98]",
              isChecked
                ? "border-accent bg-accent-soft text-ink ring-1 ring-accent"
                : "border-line bg-surface text-ink-2 hover:border-control-border hover:text-ink",
            )}
          >
            <Icon aria-hidden className={cn("size-4", isChecked ? "text-accent-text" : "text-ink-3")} strokeWidth={1.75} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
