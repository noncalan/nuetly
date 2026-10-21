import type { ReactNode } from "react";

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-line bg-subtle px-1 font-mono text-[11px] font-medium text-ink-2">
      {children}
    </kbd>
  );
}
