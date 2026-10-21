import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell/app-shell";
import { ResultsView } from "@/components/results/results-view";

export const metadata: Metadata = { title: "Результаты" };

export default function ResultsPage() {
  return (
    <AppShell>
      <ResultsView />
    </AppShell>
  );
}
