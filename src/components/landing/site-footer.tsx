import Link from "next/link";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/cn";
import { CONTAINER } from "./landing-primitives";

const FOOTER_NAV: readonly { href: string; label: string }[] = [
  { href: "#how", label: "Как это работает" },
  { href: "#pricing", label: "Тарифы" },
  { href: "#faq", label: "FAQ" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className={cn(CONTAINER, "grid gap-8 py-10 sm:py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-start")}>
        <div className="max-w-[440px]">
          <Logo />
          <p className="mt-3 text-meta text-ink-3">
            Nuetly — независимая платформа подготовки и не связана с Nazarbayev University.
          </p>
        </div>

        <nav aria-label="Навигация в подвале">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-meta text-ink-2">
            {FOOTER_NAV.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="rounded-md transition-colors hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/dashboard" className="rounded-md transition-colors hover:text-ink">
                Открыть демо
              </Link>
            </li>
          </ul>
        </nav>

        <p className="text-caption font-normal text-ink-3 md:col-span-2">
          © <span className="font-mono tabular-nums">2026</span> Nuetly
        </p>
      </div>
    </footer>
  );
}
