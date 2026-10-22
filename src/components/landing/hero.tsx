import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { HeroProductShot } from "./hero-product-shot";
import { CONTAINER, stagger } from "./landing-primitives";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="overflow-x-clip">
      <div
        className={cn(
          CONTAINER,
          "grid items-center gap-12 pb-16 pt-12 sm:pb-24 sm:pt-16",
          "lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-16 lg:pt-20",
        )}
      >
        <div>
          <p
            className="ui-stagger inline-flex items-center gap-2 rounded-md border border-line bg-surface px-2 py-1 text-caption text-ink-2"
            style={stagger(0)}
          >
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            Открытая бета · бесплатно
          </p>

          <h1
            id="hero-title"
            className={cn(
              "ui-stagger mt-5 max-w-[620px] text-balance text-[44px] font-semibold leading-[1.05] tracking-[-0.035em] text-ink",
              "sm:text-[56px]",
            )}
            style={stagger(1)}
          >
            Пробный NUET в настоящем формате и разбор каждой ошибки
          </h1>

          <p className="ui-stagger mt-5 max-w-[500px] text-option text-pretty text-ink-2" style={stagger(2)}>
            Два раздела по 60 минут, как на экзамене. После — слабые темы и решение к каждой задаче.
          </p>

          <div className="ui-stagger mt-8 flex flex-wrap items-center gap-3" style={stagger(3)}>
            <Link href="/register" className={buttonClasses({ variant: "primary", size: "lg" })}>
              Начать бесплатно
              <ArrowRight aria-hidden />
            </Link>
            <Link href="/exam" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              Пробный экзамен
            </Link>
          </div>
          <p className="ui-stagger mt-4 text-meta text-ink-3" style={stagger(3)}>
            Карта не нужна. Задачи на английском, как на экзамене.
          </p>
        </div>

        <HeroProductShot />
      </div>
    </section>
  );
}
