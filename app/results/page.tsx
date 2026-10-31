"use client";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/lib/quizStore";
import ResultCard from "@/components/ResultCard";
import Link from "next/link";

export default function ResultsPage() {
  const router = useRouter();
  const {
    questions, answers, settings, getScore,
    resetQuiz, setQuestions, startQuiz,
    selectedSubject, selectedChapters,
  } = useQuizStore();

  const { correct, incorrect, skipped, marks } = getScore();

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No quiz data found</h2>
        <p className="text-slate-500 mb-6">Start a quiz to see your results here.</p>
        <Link href="/" className="btn-primary">Go to Home</Link>
      </div>
    );
  }

  const handleRetryAll = () => {
    const prevQuestions = [...questions];
    resetQuiz();
    setQuestions(prevQuestions.sort(() => Math.random() - 0.5));
    startQuiz(selectedSubject, selectedChapters);
    router.push("/quiz");
  };

  const handleRetryWrong = () => {
    const wrongQs = questions.filter((q) => {
      const ans = answers[q.id];
      return ans?.selected && ans.selected !== q.correctOption;
    });
    if (wrongQs.length === 0) return;
    resetQuiz();
    setQuestions(wrongQs);
    startQuiz(selectedSubject, selectedChapters);
    router.push("/quiz");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">
        📊 Your Results
      </h1>
      <ResultCard
        questions={questions}
        answers={answers}
        marks={marks}
        correct={correct}
        incorrect={incorrect}
        skipped={skipped}
        negativeMarking={settings.negativeMarking}
        onRetryAll={handleRetryAll}
        onRetryWrong={handleRetryWrong}
      />
    </div>
  );
}
