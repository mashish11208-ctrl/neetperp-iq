"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Question } from "@/data/mockQuestions";
import { UserAnswer } from "@/lib/quizStore";
import { CheckCircle2, XCircle, MinusCircle, Trophy, RotateCcw, Download } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import confetti from "canvas-confetti";
import jsPDF from "jspdf";

interface ResultCardProps {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  marks: number;
  correct: number;
  incorrect: number;
  skipped: number;
  negativeMarking: boolean;
  onRetryAll: () => void;
  onRetryWrong: () => void;
}

export default function ResultCard({
  questions,
  answers,
  marks,
  correct,
  incorrect,
  skipped,
  negativeMarking,
  onRetryAll,
  onRetryWrong,
}: ResultCardProps) {
  const total = questions.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const maxMarks = total * 4;
  const percentage = Math.round((marks / maxMarks) * 100);

  const fired = useRef(false);
  useEffect(() => {
    if (!fired.current && accuracy === 100) {
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      fired.current = true;
    }
  }, [accuracy]);

  const pieData = [
    { name: "Correct", value: correct, color: "#22c55e" },
    { name: "Incorrect", value: incorrect, color: "#ef4444" },
    { name: "Skipped", value: skipped, color: "#94a3b8" },
  ].filter((d) => d.value > 0);

  const grade =
    accuracy >= 90 ? "A+ 🏆" : accuracy >= 75 ? "A 🌟" : accuracy >= 60 ? "B 👍" : accuracy >= 40 ? "C 📖" : "D 💪";

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("NEETPrep IQ — Quiz Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Score: ${marks}/${maxMarks} (${percentage}%)`, 14, 35);
    doc.text(`Correct: ${correct}  |  Incorrect: ${incorrect}  |  Skipped: ${skipped}`, 14, 45);
    doc.text(`Accuracy: ${accuracy}%  |  Grade: ${grade}`, 14, 55);
    doc.save("NEETPrep-IQ-Result.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Score Hero */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card p-8 text-center"
      >
        <div className="text-5xl mb-2">
          {accuracy === 100 ? "🎉" : accuracy >= 75 ? "🌟" : accuracy >= 50 ? "👍" : "📖"}
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Quiz Complete!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Here's how you performed</p>

        {/* Big Score */}
        <div className="relative inline-flex flex-col items-center">
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-brand to-indigo-500 flex flex-col items-center justify-center shadow-xl shadow-brand/30 mb-4">
            <span className="text-3xl font-extrabold text-white">{marks}</span>
            <span className="text-white/70 text-xs">/ {maxMarks} marks</span>
          </div>
          <div className="chip bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 text-lg font-bold">
            Grade: {grade}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <Stat
            icon={<CheckCircle2 className="text-green-500 w-6 h-6" />}
            value={correct}
            label="Correct"
            sub={`+${correct * 4} marks`}
            color="text-green-600 dark:text-green-400"
          />
          <Stat
            icon={<XCircle className="text-red-500 w-6 h-6" />}
            value={incorrect}
            label="Incorrect"
            sub={negativeMarking ? `-${incorrect} marks` : "No deduction"}
            color="text-red-600 dark:text-red-400"
          />
          <Stat
            icon={<MinusCircle className="text-slate-400 w-6 h-6" />}
            value={skipped}
            label="Skipped"
            sub="0 marks"
            color="text-slate-500 dark:text-slate-400"
          />
        </div>

        {/* Accuracy Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-1">
            <span>Accuracy</span>
            <span className="font-bold text-slate-800 dark:text-white">{accuracy}%</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-brand to-green-500 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">📊 Performance Breakdown</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-3 w-full">
            {pieData.map((d) => (
              <div key={d.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-700 dark:text-slate-300">{d.name}</span>
                  </span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {d.value} ({Math.round((d.value / total) * 100)}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(d.value / total) * 100}%`,
                      backgroundColor: d.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">🔍 Question Review</h3>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const ans = answers[q.id];
            const status = !ans?.selected ? "skipped" : ans.selected === q.correctOption ? "correct" : "incorrect";
            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border-2 ${
                  status === "correct"
                    ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30"
                    : status === "incorrect"
                    ? "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {status === "correct" ? (
                      <CheckCircle2 className="text-green-500 w-5 h-5" />
                    ) : status === "incorrect" ? (
                      <XCircle className="text-red-500 w-5 h-5" />
                    ) : (
                      <MinusCircle className="text-slate-400 w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white mb-2 leading-snug">
                      Q{i + 1}. {q.question.split("\n")[0]}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        Your: {ans?.selected ?? "—"}
                      </span>
                      <span className="chip bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400">
                        Correct: {q.correctOption}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      💡 {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onRetryAll} className="flex-1 btn-primary flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> Retry Full Quiz
        </button>
        <button
          onClick={onRetryWrong}
          disabled={incorrect === 0}
          className="flex-1 btn-outline flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <XCircle className="w-4 h-4" /> Retry Wrong Only ({incorrect})
        </button>
        <button onClick={downloadPDF} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          <Download className="w-4 h-4" /> PDF Report
        </button>
      </div>
    </div>
  );
}

function Stat({ icon, value, label, sub, color }: { icon: React.ReactNode; value: number; label: string; sub: string; color: string }) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</div>
      <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
    </div>
  );
}