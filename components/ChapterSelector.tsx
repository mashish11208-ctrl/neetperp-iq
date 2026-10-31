"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/lib/quizStore";
import { SYLLABUS, Chapter, Subject } from "@/data/syllabus";
import { Check, ChevronDown, ChevronUp, Search } from "lucide-react";
import clsx from "clsx";

interface ChapterSelectorProps {
  subject: Subject;
  onProceed: () => void;
}

export default function ChapterSelector({ subject, onProceed }: ChapterSelectorProps) {
  const { selectedChapters, setSelectedChapters } = useQuizStore();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(true);

  const filtered = subject.chapters.filter((ch) =>
    ch.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleChapter = (chId: string) => {
    if (selectedChapters.includes(chId)) {
      setSelectedChapters(selectedChapters.filter((c) => c !== chId));
    } else {
      setSelectedChapters([...selectedChapters, chId]);
    }
  };

  const selectAll = () => setSelectedChapters(subject.chapters.map((c) => c.id));
  const clearAll = () => setSelectedChapters([]);

  return (
    <div className="card">
      {/* Header */}
      <div
        className="p-5 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-lg">
            {subject.emoji} {subject.name} Chapters
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedChapters.length} of {subject.chapters.length} selected
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-300"
              style={{ width: `${(selectedChapters.length / subject.chapters.length) * 100}%` }}
            />
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-2 border-t border-slate-100 dark:border-slate-800">
              {/* Search & Bulk Actions */}
              <div className="flex gap-3 mt-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search chapters..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand dark:text-white"
                  />
                </div>
                <button
                  onClick={selectAll}
                  className="text-xs font-semibold text-brand dark:text-blue-400 hover:underline whitespace-nowrap px-2"
                >
                  All
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs font-semibold text-slate-500 hover:underline whitespace-nowrap px-2"
                >
                  Clear
                </button>
              </div>

              {/* Chapter List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                {filtered.map((chapter) => {
                  const isSelected = selectedChapters.includes(chapter.id);
                  return (
                    <motion.button
                      key={chapter.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleChapter(chapter.id)}
                      className={clsx(
                        "flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all",
                        isSelected
                          ? "border-brand bg-brand/5 dark:bg-blue-900/20"
                          : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                      )}
                    >
                      <div
                        className={clsx(
                          "w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border-2 transition-all",
                          isSelected
                            ? "bg-brand border-brand"
                            : "border-slate-300 dark:border-slate-600"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                          {chapter.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          ~{chapter.totalQuestions} questions
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Proceed CTA */}
              <div className="mt-5 pb-5">
                <button
                  onClick={onProceed}
                  disabled={selectedChapters.length === 0}
                  className={clsx(
                    "w-full py-3 rounded-xl font-bold text-white transition-all",
                    selectedChapters.length > 0
                      ? "bg-brand hover:bg-brand-light shadow-lg shadow-brand/20"
                      : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                  )}
                >
                  {selectedChapters.length === 0
                    ? "Select at least 1 chapter"
                    : `Start Quiz with ${selectedChapters.length} Chapter${selectedChapters.length > 1 ? "s" : ""} →`}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}