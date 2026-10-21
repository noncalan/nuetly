import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-hover shadow-[inset_0_1px_0_rgb(255_255_255/0.16)]",
  secondary: "border border-line bg-canvas text-ink hover:border-line-strong hover:bg-subtle",
  ghost: "text-ink-2 hover:bg-muted hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3 text-[13px] [&_svg]:size-3.5",
  md: "h-9 gap-2 px-3.5 text-sm [&_svg]:size-4",
  lg: "h-11 gap-2 px-5 text-[15px] [&_svg]:size-4",
};

type ButtonStyle = { variant?: Variant; size?: Size; className?: string };

export function buttonClasses({ variant = "secondary", size = "md", className }: ButtonStyle = {}): string {
  return cn(
    "inline-flex shrink-0 select-none items-center justify-center rounded-lg font-medium whitespace-nowrap",
    "transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.97]",
    "pointer-coarse:min-h-11",
    "disabled:pointer-events-none disabled:opacity-40",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyle;

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button type="button" className={buttonClasses({ variant, size, className })} {...props} />;
}
