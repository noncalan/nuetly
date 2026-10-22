import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = { title: "Настройка плана" };

export default function OnboardingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="rounded-md">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>
      <main className="mx-auto flex w-full max-w-[520px] flex-1 flex-col justify-center px-4 pb-16 sm:px-8">
        <OnboardingFlow />
      </main>
    </div>
  );
}
