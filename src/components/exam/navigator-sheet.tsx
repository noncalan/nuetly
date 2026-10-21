"use client";

import { X } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { closingAttr, trapTab, useFocusReturn } from "./overlay";

type Props = {
  isClosing: boolean;
  onClose: () => void;
  onRequestFinish: () => void;
  children: ReactNode;
};

/** Mobile bottom sheet with the question navigator. Escape is handled by the section screen. */
export function NavigatorSheet({ isClosing, onClose, onRequestFinish, children }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useFocusReturn(sheetRef, closeRef);

  return (
    <div data-closing={closingAttr(isClosing)} className="fixed inset-0 z-40 data-closing:pointer-events-none lg:hidden">
      <div
        aria-hidden
        data-closing={closingAttr(isClosing)}
        className="ui-backdrop absolute inset-0 bg-black/40"
        onMouseDown={(event) => {
          event.preventDefault();
          onClose();
        }}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Навигатор вопросов"
        tabIndex={-1}
        onKeyDown={trapTab}
        className="ui-sheet absolute outline-none! inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl border-t border-line bg-subtle shadow-popover"
      >
        <div className="relative flex shrink-0 justify-end px-3 pt-3">
          <span aria-hidden className="absolute left-1/2 top-2 h-1 w-9 -translate-x-1/2 rounded-full bg-line-strong" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="grid size-9 place-items-center rounded-lg text-ink-2 transition-transform duration-150 ease-out hover:bg-muted hover:text-ink active:scale-[0.95] pointer-coarse:size-11"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        <div className="shrink-0 border-t border-line px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button className="w-full" onClick={onRequestFinish}>
            Завершить раздел
          </Button>
        </div>
      </div>
    </div>
  );
}
