import { Check, Info } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { LandingSection, SectionHeading } from "./landing-primitives";

type Plan = {
  name: string;
  /** Price in tenge per month, pre-formatted with a no-break space. */
  price: string;
  summary: string;
  features: readonly string[];
  isAvailable: boolean;
  isRecommended?: boolean;
};

// Prices are hypotheses from PLAN.md; nothing is charged during the beta.
const PLANS: readonly Plan[] = [
  {
    name: "Free",
    price: "0",
    summary: "Чтобы понять уровень и попробовать формат.",
    features: ["Диагностика по двум разделам", "3 полных пробных с разбором", "Практика по темам с дневным лимитом"],
    isAvailable: true,
  },
  {
    name: "Plus",
    price: "9 990",
    summary: "Для регулярной подготовки к экзамену.",
    features: ["Всё из Free", "Больше пробных и наборов практики", "Полная аналитика по темам и времени"],
    isAvailable: false,
    isRecommended: true,
  },
  {
    name: "Pro",
    price: "14 990",
    summary: "Когда до экзамена мало времени.",
    features: ["Всё из Plus", "Пробные и практика без лимитов", "Адаптивный план подготовки", "Новые пробные — в первую очередь"],
    isAvailable: false,
  },
];

export function Pricing() {
  return (
    <LandingSection id="pricing" labelledBy="pricing-title">
      <SectionHeading
        id="pricing-title"
        eyebrow="Тарифы"
        title="Начни бесплатно, плати за объём"
        lead="Диагностики и трёх пробных хватит, чтобы понять, подходит ли тебе Nuetly."
      />

      <p className="mt-8 flex items-start gap-2.5 rounded-lg border border-line bg-subtle px-4 py-3 text-meta text-ink-2">
        <Info aria-hidden className="mt-px size-4 shrink-0 text-ink-3" strokeWidth={1.75} />
        <span>
          <span className="font-medium text-ink">Сейчас идёт бесплатная бета — оплата пока не подключена.</span> Цены
          Plus и Pro предварительные и могут измениться до запуска.
        </span>
      </p>

      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <li key={plan.name}>
            <PlanCard plan={plan} />
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const headingId = `plan-${plan.name.toLowerCase()}`;
  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "flex h-full flex-col rounded-xl border bg-surface p-6 shadow-card",
        plan.isRecommended ? "border-accent ring-1 ring-accent" : "border-line",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id={headingId} className="text-h2 text-ink">
          {plan.name}
        </h3>
        {plan.isRecommended && (
          <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-caption text-accent-text">Рекомендуем</span>
        )}
      </div>

      <p className="mt-5 flex items-baseline gap-1.5">
        <span className="font-mono text-stat tabular-nums text-ink">{plan.price}</span>
        <span className="text-meta text-ink-3">₸/мес</span>
      </p>
      <p className="mt-2 text-meta text-ink-2">{plan.summary}</p>

      <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-body text-ink-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2.5">
            <Check
              aria-hidden
              className={cn("mt-0.5 size-4 shrink-0", plan.isRecommended ? "text-accent-text" : "text-ink-3")}
              strokeWidth={2}
            />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Link
          href="/register"
          aria-label={plan.isAvailable ? undefined : `${plan.name}: скоро. Пока открыть бесплатную бету`}
          className={buttonClasses({
            variant: plan.isAvailable ? "primary" : "secondary",
            size: "md",
            className: "w-full",
          })}
        >
          {plan.isAvailable ? "Начать бесплатно" : "Скоро"}
        </Link>
      </div>
    </article>
  );
}
