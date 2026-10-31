"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuizStore } from "@/lib/quizStore";
import { MOCK_QUESTIONS, getQuestionsByChapterAndDifficulty } from "@/data/mockQuestions";
import { SYLLABUS } from "@/data/syllabus";
import QuizCard from "@/components/QuizCard";
import Timer from "@/components/Timer";
import { motion } from "framer-motion";
import { X, Bookmark, BookmarkCheck } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function QuizPage() {
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