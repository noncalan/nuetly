import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  title: string;
  subtitle?: ReactNode;
  /** Controls that scope only this card (e.g. a sort toggle), aligned with the title. */
  action?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * e1 card shell for every analytics block. `relative` keeps the sr-only data tables
 * (absolutely positioned) anchored inside the card so they never widen the page.
 */
export function ChartCard({ id, title, subtitle, action, className, style, children }: Props) {
  const titleId = `${id}-title`;
  return (
    <section
      aria-labelledby={titleId}
      style={style}
      className={cn("relative min-w-0 rounded-xl border border-line bg-surface p-5 shadow-card sm:p-6", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h2 id={titleId} className="text-h2 text-ink">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-caption text-ink-3">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
