"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuizStore } from "@/lib/quizStore";
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

  const subject   = searchParams.get("subject")    || "physics";
  const chapter   = searchParams.get("chapter")    || "";
  const difficulty= searchParams.get("difficulty") || "Mixed";
  const countParam= parseInt(searchParams.get("count") || "10");

  const { setQuestions, setConfig } = useQuizStore();

  const [questions,   setLocalQuestions] = useState<Question[]>([]);
  const [current,     setCurrent]        = useState(0);
  const [selected,    setSelected]       = useState<string | null>(null);
  const [answered,    setAnswered]       = useState<Record<number, string>>({});
  const [bookmarked,  setBookmarked]     = useState<Set<number>>(new Set());
  const [loading,     setLoading]        = useState(true);
  const [error,       setError]          = useState<string | null>(null);
  const [timeLeft,    setTimeLeft]       = useState(countParam * 60); // 1 min per question

  // ── Fetch questions from Groq API ──────────────────────────
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          chapter: chapter || SYLLABUS[subject as keyof typeof SYLLABUS]?.[0] || chapter,
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

  // ── Timer countdown ────────────────────────────────────────
  useEffect(() => {
    if (loading || questions.length === 0) return;
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [loading, timeLeft, questions.length]);

  // ── Handlers ───────────────────────────────────────────────
  const handleSelect = (option: string) => {
    if (answered[current]) return; // already answered
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
      next.has(current) ? next.delete(current) : next.add(current);
      return next;
    });
  };

  const handleFinish = () => {
    // Calculate score
    let score = 0;
    questions.forEach((q, i) => {
      const ans = answered[i];
      if (!ans || ans === "SKIP") return;
      if (ans === q.correctOption) score += 4;
      else score -= 1;
    });

    // Save to store and navigate
    useQuizStore.getState().setResults({
      questions,
      answers: answered,
      score,
      total: questions.length,
    });

    router.push("/results");
  };

  // ── Loading State ──────────────────────────────────────────
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

  // ── Error State ────────────────────────────────────────────
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
  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const isAnswered = !!answered[current];
  const isBookmarked = bookmarked.has(current);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">

      {/* ── Header Bar ── */}
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Q {current + 1} / {questions.length}
        </div>
        <Timer seconds={timeLeft} />
        <button
          onClick={toggleBookmark}
          className={`text-xl transition ${isBookmarked ? "text-yellow-400" : "text-slate-400 hover:text-yellow-400"}`}
          title="Bookmark"
        >
          {isBookmarked ? "★" : "☆"}
        </button>
      </div>

      {/* ── Progress Bar ── */}
      <div className="max-w-3xl mx-auto mb-6 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Question Card ── */}
      <QuizCard
        question={q}
        selected={selected}
        answered={answered[current]}
        onSelect={handleSelect}
      />

      {/* ── Action Buttons ── */}
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
import { SYLLABUS } from "@/data/syllabus";
import QuizCard from "@/components/QuizCard";
import Timer from "@/components/Timer";
import { motion } from "framer-motion";
import { X, Bookmark, BookmarkCheck } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export function QuizLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Loading questions...</p>
      </div>
    </div>
  );
}

export default function QuizSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isQuick = searchParams.get("quick") === "true";
  const subjectParam = searchParams.get("subject") ?? "biology";

  const {
    questions, setQuestions, currentIndex, setCurrentIndex,
    answers, answerQuestion, toggleBookmark, skipQuestion,
    settings, selectedSubject, selectedChapters, endQuiz,
  } = useQuizStore();

  const [isRevealed, setIsRevealed] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [sessionReady, setSessionReady] = useState(false);

  // Load questions
  useEffect(() => {
    if (questions.length === 0 || isQuick) {
      const subject = isQuick ? subjectParam : selectedSubject;
      const q = getQuestionsByChapterAndDifficulty(
        "all",
        subject || "biology",
        settings.difficulty,
        settings.questionCount
      );
      setQuestions(q.length > 0 ? q : MOCK_QUESTIONS.slice(0, settings.questionCount));
    }
    setSessionReady(true);
  }, []);

  const currentQ = questions[currentIndex];
  const currentAnswer = currentQ ? answers[currentQ.id] : undefined;
  const totalBookmarks = Object.values(answers).filter((a) => a.bookmarked).length;

  const handleAnswer = (option: "A" | "B" | "C" | "D") => {
    if (isRevealed || !currentQ) return;
    answerQuestion(currentQ.id, option);
    setIsRevealed(true);
  };

  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      endQuiz();
      router.push("/results");
      return;
    }
    setCurrentIndex(currentIndex + 1);
    setIsRevealed(false);
    setTimerKey((k) => k + 1);
  }, [currentIndex, questions.length]);

  const handleSkip = () => {
    if (!currentQ) return;
    skipQuestion(currentQ.id);
    handleNext();
  };

  const handleTimeUp = useCallback(() => {
    if (currentQ) skipQuestion(currentQ.id);
    handleNext();
  }, [currentQ, handleNext]);

  if (!sessionReady || !currentQ) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Progress Info */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => endQuiz()}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Exit quiz"
          >
            <X className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Question {currentIndex + 1} / {questions.length}
            </div>
            <div className="text-xs text-slate-500">
              {currentQ.subject.charAt(0).toUpperCase() + currentQ.subject.slice(1)}
            </div>
          </div>
        </div>

        {/* Timer + Bookmarks */}
        <div className="flex items-center gap-4">
          {totalBookmarks > 0 && (
            <div className="flex items-center gap-1 text-yellow-500">
              <BookmarkCheck className="w-4 h-4" />
              <span className="text-sm font-bold">{totalBookmarks}</span>
            </div>
          )}
          <Timer
            duration={settings.timer}
            onTimeUp={handleTimeUp}
            resetKey={timerKey}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          className={clsx(
            "h-full rounded-full",
            settings.difficulty === "Easy"
              ? "bg-green-500"
              : settings.difficulty === "Hard"
              ? "bg-red-500"
              : "bg-brand"
          )}
        />
      </div>

      {/* Question Navigation Dots */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {questions.map((q, i) => {
          const ans = answers[q.id];
          const status = !ans
            ? "unanswered"
            : ans.selected === null
            ? "skipped"
            : ans.selected === q.correctOption
            ? "correct"
            : "incorrect";
          return (
            <button
              key={q.id}
              onClick={() => {
                setCurrentIndex(i);
                setIsRevealed(!!answers[q.id]?.selected);
              }}
              className={clsx(
                "w-7 h-7 rounded-full text-xs font-bold transition-all",
                i === currentIndex ? "ring-2 ring-offset-2 ring-brand scale-110" : "",
                status === "correct"
                  ? "bg-green-500 text-white"
                  : status === "incorrect"
                  ? "bg-red-400 text-white"
                  : status === "skipped"
                  ? "bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Quiz Card */}
      <QuizCard
        question={currentQ}
        questionNumber={currentIndex + 1}
        total={questions.length}
        selectedAnswer={currentAnswer?.selected ?? null}
        isBookmarked={currentAnswer?.bookmarked ?? false}
        isRevealed={isRevealed}
        onAnswer={handleAnswer}
        onBookmark={() => toggleBookmark(currentQ.id)}
        onNext={handleNext}
        onSkip={handleSkip}
      />

      {/* Marking Scheme Info */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
        <span className="text-green-500 font-semibold">✓ Correct: +4</span>
        {settings.negativeMarking && <span className="text-red-400 font-semibold">✗ Wrong: -1</span>}
        <span>○ Skip: 0</span>
      </div>
    </div>
  );
}
