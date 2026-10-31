"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy, Flame, Zap, BookOpen } from "lucide-react";

const MOCK_PROGRESS = [
  { chapter: "Cell Biology", accuracy: 88 },
  { chapter: "Genetics", accuracy: 72 },
  { chapter: "Photosynthesis", accuracy: 91 },
  { chapter: "Optics", accuracy: 65 },
  { chapter: "Electrochemistry", accuracy: 58 },
  { chapter: "Organic Chem", accuracy: 77 },
];

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
        📊 Your Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Trophy className="text-yellow-500 w-6 h-6" />, label: "Total Score", value: "1,240 pts" },
          { icon: <Flame className="text-orange-500 w-6 h-6" />, label: "Day Streak", value: "7 🔥" },
          { icon: <Zap className="text-blue-500 w-6 h-6" />, label: "Quizzes Taken", value: "24" },
          { icon: <BookOpen className="text-green-500 w-6 h-6" />, label: "Avg Accuracy", value: "74%" },
        ].map((stat, i) => (
          <div key={i} className="card p-5 text-center">
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-6 mb-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">📈 Chapter-wise Accuracy</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={MOCK_PROGRESS}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="chapter" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
            <Tooltip formatter={(v) => [`${v}%`, "Accuracy"]} />
            <Bar dataKey="accuracy" fill="#1A237E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weak/Strong Chapters */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h4 className="font-bold text-red-600 dark:text-red-400 mb-3">⚠️ Needs Attention</h4>
          {MOCK_PROGRESS
            .filter((c) => c.accuracy < 70)
            .map((c) => (
              <div key={c.chapter} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm text-slate-700 dark:text-slate-300">{c.chapter}</span>
                <span className="chip bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">{c.accuracy}%</span>
              </div>
            ))}
        </div>
        <div className="card p-5">
          <h4 className="font-bold text-green-600 dark:text-green-400 mb-3">✅ Strong Areas</h4>
          {MOCK_PROGRESS
            .filter((c) => c.accuracy >= 80)
            .map((c) => (
              <div key={c.chapter} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm text-slate-700 dark:text-slate-300">{c.chapter}</span>
                <span className="chip bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">{c.accuracy}%</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}