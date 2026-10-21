import type { Metadata } from "next";
import { ExamRunner } from "@/components/exam/exam-runner";
import { NEXT_MOCK_TITLE } from "@/lib/demo/student";

export const metadata: Metadata = { title: NEXT_MOCK_TITLE };

export default function ExamPage() {
  return <ExamRunner title={NEXT_MOCK_TITLE} />;
}
