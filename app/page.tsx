"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SYLLABUS } from "@/data/syllabus";
import { useQuizStore } from "@/lib/quizStore";
import { Zap, TrendingUp, Target, Award, ArrowRight, Shuffle } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { setSelectedSubject, startQuiz, setQuestions } = useQuizStore();

  const handleSubjectClick = (subjectId: string) => {
    setSelectedSubject(subjectId);
    router.push(`/subject/${subjectId}`);
  };

  const handleQuick10 = () => {
    const allSubjects = ["physics", "chemistry", "biology"];
    const randSubject = allSubjects[Math.floor(Math.random() * 3)];
    startQuiz(randSubject, ["random"]);
    router.push(`/quiz?subject=${randSubject}&quick=true`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 bg-brand/10 text-brand dark:text-blue-400 dark:bg-blue-900/30 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Zap className="w-4 h-4" />
          AI-Powered NEET MCQ Generator
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
          Master NEET with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
            Precision Practice
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Generate unlimited chapter-wise MCQs in Physics, Chemistry & Biology.
          Set your difficulty, track your progress, and crack NEET with confidence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleQuick10}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            <Shuffle className="w-5 h-5" />
            Quick 10 — Start Now!
          </button>
          <button
            onClick={() => router.push("/subject/biology")}
            className="btn-outline flex items-center gap-2 justify-center"
          >
            Browse Chapters <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
      >
        {[
          { icon: <Target className="text-blue-500" />, value: "97", label: "Chapters Covered" },
          { icon: <Zap className="text-yellow-500" />, value: "5000+", label: "NEET MCQs" },
          { icon: <TrendingUp className="text-green-500" />, value: "3", label: "Difficulty Levels" },
          { icon: <Award className="text-purple-500" />, value: "99%", label: "Syllabus Coverage" },
        ].map((stat, i) => (
          <div key={i} className="card p-5 text-center">
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Subject Cards */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        📚 Choose Your Subject
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {SYLLABUS.map((subject, i) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.4 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSubjectClick(subject.id)}
            className="cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className={`bg-gradient-to-br ${subject.color} p-8 text-white`}>
              <div className="text-5xl mb-3">{subject.emoji}</div>
              <h3 className="text-2xl font-bold">{subject.name}</h3>
              <p className="text-white/80 text-sm mt-1">
                {subject.chapters.length} Chapters • NEET Syllabus
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Top Chapters
                </span>
                <span className="chip bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  {subject.chapters.length} total
                </span>
              </div>
              <div className="space-y-1.5">
                {subject.chapters.slice(0, 3).map((ch) => (
                  <div
                    key={ch.id}
                    className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {ch.name}
                  </div>
                ))}
                <div className="text-sm text-brand dark:text-blue-400 font-semibold mt-2 flex items-center gap-1">
                  +{subject.chapters.length - 3} more chapters <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* How it works */}
      <div className="card p-8 mb-10">
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-8">
          🚀 How NEETPrep IQ Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Pick Subject", desc: "Select Physics, Chemistry or Biology", icon: "📖" },
            { step: "2", title: "Choose Chapter", desc: "Select one or multiple chapters", icon: "📑" },
            { step: "3", title: "Set Difficulty", desc: "Easy, Medium, Hard or Mixed", icon: "🎯" },
            { step: "4", title: "Start Quiz", desc: "Get instant NEET-style MCQs", icon: "⚡" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                {item.step}
              </div>
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="font-semibold text-slate-800 dark:text-white">{item.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
