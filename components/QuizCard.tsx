"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/data/mockQuestions";
import { Bookmark, BookmarkCheck, ChevronRight, Info } from "lucide-react";
import clsx from "clsx";

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  total: number;
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  isBookmarked: boolean;
  isRevealed: boolean;
  onAnswer: (option: "A" | "B" | "C" | "D") => void;
  onBookmark: () => void;
  onNext: () => void;
  onSkip: () => void;
}

const OPTIONS: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

const optionColor = (
  option: "A" | "B" | "C" | "D",
  selected: "A" | "B" | "C" | "D" | null,
  correct: "A" | "B" | "C" | "D",
  revealed: boolean
) => {
  if (!revealed) {
    if (selected === option)
      return "border-brand bg-brand/10 dark:bg-blue-900/40 text-brand dark:text-blue-300 font-semibold";
    return "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800";
  }
  if (option === correct)
    return "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold";
  if (option === selected && selected !== correct)
    return "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold";
  return "border-slate-200 dark:border-slate-700 opacity-60";
};

export default function QuizCard({
  question,
  questionNumber,
  total,
  selectedAnswer,
  isBookmarked,
  isRevealed,
  onAnswer,
  onBookmark,
  onNext,
  onSkip,
}: QuizCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const difficultyStyle =
    question.difficulty === "Easy"
      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
      : question.difficulty === "Medium"
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";

  const optionLabels: Record<"A" | "B" | "C" | "D", string> = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      className="card p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Q{questionNumber} of {total}
          </span>
          <span className={`chip ${difficultyStyle}`}>{question.difficulty}</span>
          <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {question.chapter}
          </span>
          {question.type === "assertion-reason" && (
            <span className="chip bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">
              Assertion-Reason
            </span>
          )}
        </div>
        <button
          onClick={onBookmark}
          aria-label="Bookmark question"
          className="text-slate-400 hover:text-yellow-500 transition-colors"
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-6 h-6 text-yellow-500" />
          ) : (
            <Bookmark className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Question */}
      <div className="mb-7">
        <p className="text-lg font-semibold text-slate-800 dark:text-white leading-relaxed whitespace-pre-line">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-7">
        {OPTIONS.map((opt) => (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.98 }}
            onClick={() => !isRevealed && onAnswer(opt)}
            disabled={isRevealed}
            aria-label={`Option ${opt}`}
            className={clsx(
              "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200",
              optionColor(opt, selectedAnswer, question.correctOption, isRevealed)
            )}
          >
            <div
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0",
                isRevealed && opt === question.correctOption
                  ? "bg-green-500 text-white"
                  : isRevealed && opt === selectedAnswer && selectedAnswer !== question.correctOption
                  ? "bg-red-400 text-white"
                  : selectedAnswer === opt && !isRevealed
                  ? "bg-brand text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              )}
            >
              {opt}
            </div>
            <span className="text-sm leading-relaxed">{optionLabels[opt]}</span>
          </motion.button>
        ))}
      </div>

      {/* Explanation (after reveal) */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-2 text-sm font-semibold text-brand dark:text-blue-400 hover:underline"
            >
              <Info className="w-4 h-4" />
              {showExplanation ? "Hide" : "Show"} Explanation
            </button>
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    💡 <strong>Explanation:</strong> {question.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-between">
        <button
          onClick={onSkip}
          disabled={isRevealed}
          className="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-40"
        >
          Skip →
        </button>
        <button
          onClick={onNext}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          {questionNumber === total ? "Finish Quiz" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}