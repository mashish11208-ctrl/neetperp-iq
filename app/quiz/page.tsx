import { Suspense } from "react";
import QuizSession, { QuizLoading } from "@/components/QuizSession";

export default function QuizPage() {
  return (
    <Suspense fallback={<QuizLoading />}>
      <QuizSession />
    </Suspense>
  );
}
