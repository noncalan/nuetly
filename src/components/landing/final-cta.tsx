import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { LandingSection } from "./landing-primitives";

export function FinalCta() {
  return (
    <LandingSection labelledBy="cta-title">
      <div className="grid gap-8 rounded-xl border border-line bg-surface p-6 shadow-card sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12 lg:p-12">
        <div className="max-w-[560px]">
          <h2 id="cta-title" className="text-h1 text-balance text-ink">
            Начни с диагностики — это 60 минут
          </h2>
          <p className="mt-3 text-option text-pretty text-ink-2">
            30 задач покажут, какие темы тянут результат вниз. План на каждый день соберётся из них.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/register" className={buttonClasses({ variant: "primary", size: "lg" })}>
            Начать бесплатно
            <ArrowRight aria-hidden />
          </Link>
          <Link href="/exam" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            Пробный экзамен
          </Link>
        </div>
      </div>
    </LandingSection>
  );
}
