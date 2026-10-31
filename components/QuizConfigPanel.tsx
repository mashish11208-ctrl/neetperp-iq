"use client";
import { useQuizStore } from "@/lib/quizStore";
import { TimerDuration } from "@/lib/quizStore";
import { Hash, Clock, AlertTriangle } from "lucide-react";
import clsx from "clsx";

const QUESTION_COUNTS = [5, 10, 20, 30];
const TIMER_OPTIONS: { label: string; value: TimerDuration }[] = [
  { label: "30s", value: 30 },
  { label: "60s", value: 60 },
  { label: "90s", value: 90 },
  { label: "∞", value: 0 },
];

export default function QuizConfigPanel() {
  const { settings, updateSettings } = useQuizStore();

  return (
    <div className="card p-6 space-y-5">
      <h3 className="font-bold text-slate-800 dark:text-white">⚙️ Quiz Settings</h3>

      {/* Question Count */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          <Hash className="w-4 h-4" /> Questions
        </label>
        <div className="grid grid-cols-4 gap-2">
          {QUESTION_COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => updateSettings({ questionCount: n })}
              className={clsx(
                "py-2 rounded-lg text-sm font-bold border-2 transition-all",
                settings.questionCount === n
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand hover:text-brand"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Timer */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          <Clock className="w-4 h-4" /> Timer / Question
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TIMER_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => updateSettings({ timer: t.value })}
              className={clsx(
                "py-2 rounded-lg text-sm font-bold border-2 transition-all",
                settings.timer === t.value
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand hover:text-brand"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Negative Marking */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Negative Marking (-1)
        </label>
        <button
          onClick={() => updateSettings({ negativeMarking: !settings.negativeMarking })}
          className={clsx(
            "w-12 h-6 rounded-full transition-all duration-300 relative",
            settings.negativeMarking ? "bg-red-500" : "bg-slate-300 dark:bg-slate-600"
          )}
          aria-label="Toggle negative marking"
        >
          <div
            className={clsx(
              "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow",
              settings.negativeMarking ? "left-6" : "left-0.5"
            )}
          />
        </button>
      </div>

      {/* PYQ Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          📜 Include PYQs
        </label>
        <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs">
          Coming Soon
        </span>
      </div>
    </div>
  );
}