"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuizStore } from "@/lib/quizStore";
import { SYLLABUS } from "@/data/syllabus";
import QuizCard from "@/components/QuizCard";
import Timer from "@/components/Timer";

interface Question {
  id: string;
  type: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  chapter: string;
  subject: string;
  difficulty: string;
}

export default function QuizSession() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subject    = searchParams.get("subject")    || "physics";
  const chapter    = searchParams.get("chapter")    || "";
  const difficulty = searchParams.get("difficulty") || "Mixed";
  const countParam = parseInt(searchParams.get("count") || "10");

  const { setQuestions, setConfig } = useQuizStore();

  const [questions,  setLocalQuestions] = useState<Question[]>([]);
  const [current,    setCurrent]        = useState(0);
  const [selected,   setSelected]       = useState<string | null>(null);
  const [answered,   setAnswered]       = useState<Record<number, string>>({});
  const [bookmarked, setBookmarked]     = useState<Set<number>>(new Set());
  const [loading,    setLoading]        = useState(true);
  const [error,      setError]          = useState<string | null>(null);
  const [timeLeft,   setTimeLeft]       = useState(countParam * 60);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          chapter: chapter || SYLLABUS[subject as keyof typeof SYLLABUS]?.[0] || "",
          difficulty,
          count: countParam,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.questions) {
        throw new Error(data.error || "Failed to load questions");
      }

      setLocalQuestions(data.questions);
      setQuestions(data.questions);
      setConfig({ subject, chapter, difficulty, count: countParam });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [subject, chapter, difficulty, countParam, setQuestions, setConfig]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (loading || questions.length === 0) return;
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, timeLeft, questions.length]);

  const handleSelect = (option: string) => {
    if (answered[current]) return;
    setSelected(option);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setAnswered((prev) => ({ ...prev, [current]: selected }));
  };

  const handleNext = () => {
    setSelected(null);
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    setAnswered((prev) => ({ ...prev, [current]: "SKIP" }));
    setSelected(null);
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      handleFinish();
    }
  };

  const toggleBookmark = () => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(current)) {
        next.delete(current);
      } else {
        next.add(current);
      }
      return next;
    });
  };

  const handleFinish = () => {
    let score = 0;
    questions.forEach((q, i) => {
      const ans = answered[i];
      if (!ans || ans === "SKIP") return;
      if (ans === q.correctOption) score += 4;
      else score -= 1;
    });

    useQuizStore.getState().setResults({
      questions,
      answers: answered,
      score,
      total: questions.length,
    });

    router.push("/results");
  };

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">
          Generating questions with AI...
        </p>
        <p className="text-slate-400 text-sm">
          {subject} · {chapter} · {difficulty}
        </p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900 p-6">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-bold text-red-500">Failed to load questions</h2>
        <p className="text-slate-500 text-center max-w-md">{error}</p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={fetchQuestions}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔄 Try Again
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz UI ────────────────────────────────────────────────
  const q          = questions[current];
  const progress   = ((current + 1) / questions.length) * 100;
  const isAnswered = !!answered[current];
  const isBookmarked = bookmarked.has(current);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Q {current + 1} / {questions.length}
        </div>
        <Timer seconds={timeLeft} />
        <button
          onClick={toggleBookmark}
          className={`text-xl transition ${
            isBookmarked ? "text-yellow-400" : "text-slate-400 hover:text-yellow-400"
          }`}
        >
          {isBookmarked ? "★" : "☆"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto mb-6 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <QuizCard
        question={q}
        selected={selected}
        answered={answered[current]}
        onSelect={handleSelect}
      />

      {/* Buttons */}
      <div className="max-w-3xl mx-auto mt-6 flex gap-3 justify-end flex-wrap">
        <button
          onClick={handleSkip}
          disabled={isAnswered}
          className="px-5 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-40 transition"
        >
          Skip →
        </button>

        {!isAnswered ? (
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition"
          >
            Confirm
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            {current < questions.length - 1 ? "Next →" : "Finish Quiz ✓"}
          </button>
        )}
      </div>

    </div>
  );
}