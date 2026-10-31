"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore, Difficulty } from "@/lib/quizStore";
import { Shuffle } from "lucide-react";
import clsx from "clsx";

const LEVELS: { label: Difficulty; emoji: string; desc: string; color: string; bg: string; border: string }[] = [
  {
    label: "Easy",
    emoji: "🟢",
    desc: "Concept recall, direct questions",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/30",
    border: "border-green-400",
  },
  {
    label: "Medium",
    emoji: "🟡",
    desc: "Application-based, moderate",
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-900/30",
    border: "border-yellow-400",
  },
  {
    label: "Hard",
    emoji: "🔴",
    desc: "NEET PYQ-style, tricky",
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-900/30",
    border: "border-red-400",
  },
  {
    label: "Mixed",
    emoji: "🎲",
    desc: "Random difficulty per question",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/30",
    border: "border-purple-400",
  },
];

export default function DifficultySlider() {
  const { settings, updateSettings } = useQuizStore();

  return (
    <div className="card p-6">
      <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        🎯 Difficulty Level
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {LEVELS.map((level) => {
          const isSelected = settings.difficulty === level.label;
          return (
            <motion.button
              key={level.label}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSettings({ difficulty: level.label })}
              className={clsx(
                "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
                isSelected
                  ? `${level.bg} ${level.border} shadow-md`
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="difficulty-indicator"
                  className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${
                    level.label === "Easy"
                      ? "bg-green-500"
                      : level.label === "Medium"
                      ? "bg-yellow-500"
                      : level.label === "Hard"
                      ? "bg-red-500"
                      : "bg-purple-500"
                  }`}
                />
              )}
              <div className="text-2xl mb-1">{level.emoji}</div>
              <div
                className={clsx(
                  "font-bold text-sm",
                  isSelected ? level.color : "text-slate-700 dark:text-slate-300"
                )}
              >
                {level.label}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                {level.desc}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Difficulty indicator bar */}
      <div className="mt-5 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          animate={{
            width:
              settings.difficulty === "Easy"
                ? "25%"
                : settings.difficulty === "Medium"
                ? "50%"
                : settings.difficulty === "Hard"
                ? "85%"
                : "100%",
            backgroundColor:
              settings.difficulty === "Easy"
                ? "#22c55e"
                : settings.difficulty === "Medium"
                ? "#eab308"
                : settings.difficulty === "Hard"
                ? "#ef4444"
                : "#a855f7",
          }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full"
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>Beginner</span>
        <span>NEET Level</span>
      </div>
    </div>
  );
}