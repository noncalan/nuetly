import { cn } from "@/lib/cn";

export function Logo({ className, markOnly = false }: { className?: string; markOnly?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-ink", className)}>
      <span
        aria-hidden
        className="grid size-[22px] place-items-center rounded-[6px] bg-accent font-mono text-[12px] font-bold leading-none text-accent-ink"
      >
        N
      </span>
      {markOnly ? <span className="sr-only">Nuetly</span> : "Nuetly"}
    </span>
  );
}
