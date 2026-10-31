"use client";
import { useEffect, useState, useCallback } from "react";
import { Clock } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

interface TimerProps {
  duration: number; // in seconds; 0 = no limit
  onTimeUp: () => void;
  resetKey: number; // increment to reset timer
}

export default function Timer({ duration, onTimeUp, resetKey }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [resetKey, duration]);

  useEffect(() => {
    if (duration === 0) return;
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, duration, onTimeUp]);

  if (duration === 0) return null;

  const percent = (timeLeft / duration) * 100;
  const isDanger = timeLeft <= 10;
  const isWarning = timeLeft <= 20;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
          <circle
            cx="18" cy="18" r="15.9155"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-slate-200 dark:text-slate-700"
          />
          <motion.circle
            cx="18" cy="18" r="15.9155"
            fill="none"
            strokeWidth="3"
            strokeDasharray="100"
            strokeLinecap="round"
            animate={{ strokeDashoffset: 100 - percent }}
            transition={{ duration: 0.5 }}
            stroke={isDanger ? "#ef4444" : isWarning ? "#eab308" : "#1A237E"}
          />
        </svg>
        <Clock
          className={clsx(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4",
            isDanger ? "text-red-500" : "text-brand dark:text-blue-400"
          )}
        />
      </div>
      <span
        className={clsx(
          "font-mono font-bold text-lg",
          isDanger && "timer-danger",
          isWarning && !isDanger && "text-yellow-500",
          !isWarning && "text-slate-700 dark:text-slate-200"
        )}
      >
        {mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${secs}s`}
      </span>
    </div>
  );
}