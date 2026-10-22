import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Shared page frame: ~1120px of content plus a 16px (phone) / 24px gutter. */
export const CONTAINER = "mx-auto w-full max-w-[1120px] px-4 sm:px-6";

/** Delay slot for the one-off `ui-stagger` reveal (keep n ≤ 5). */
export function stagger(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}

type SectionProps = {
  id?: string;
  labelledBy: string;
  className?: string;
  children: ReactNode;
};

/** One rhythm for every landing section: hairline on top, 64 / 96px of vertical air. */
export function LandingSection({ id, labelledBy, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("scroll-mt-14 border-t border-line py-16 sm:py-24", className)}
    >
      <div className={CONTAINER}>{children}</div>
    </section>
  );
}

type HeadingProps = {
  id: string;
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, lead, className }: HeadingProps) {
  return (
    <div className={cn("max-w-[560px]", className)}>
      <p className="text-meta text-ink-3">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-h1 text-balance text-ink">
        {title}
      </h2>
      {lead && <p className="mt-3 text-option text-pretty text-ink-2">{lead}</p>}
    </div>
  );
}

type PointListProps = { points: readonly string[]; className?: string };

/** Plain list with a short hairline marker: no icon-in-a-circle bullets. */
export function PointList({ points, className }: PointListProps) {
  return (
    <ul className={cn("space-y-3 text-body text-ink-2", className)}>
      {points.map((point) => (
        <li key={point} className="flex gap-3">
          <span aria-hidden className="mt-[9px] h-px w-3 shrink-0 bg-ink-3" />
          <span className="text-pretty">{point}</span>
        </li>
      ))}
    </ul>
  );
}

type IllustrationProps = { label: string; className?: string; children: ReactNode };

/** Product mock-ups built from real markup: announced once by their label, contents stay silent. */
export function Illustration({ label, className, children }: IllustrationProps) {
  return (
    <div role="img" aria-label={label} className={cn("relative", className)}>
      {children}
    </div>
  );
}
