"use client";
import { useParams, useRouter } from "next/navigation";
import { SYLLABUS } from "@/data/syllabus";
import { useQuizStore } from "@/lib/quizStore";
import ChapterSelector from "@/components/ChapterSelector";
import DifficultySlider from "@/components/DifficultySlider";
import QuizConfigPanel from "@/components/QuizConfigPanel";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, Suspense } from "react";

function SubjectContent() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const router = useRouter();
  const {
    startQuiz,
    selectedChapters,
    setSelectedSubject,
  } = useQuizStore();

  // ✅ Fix 1 — Use useEffect instead of calling during render
  useEffect(() => {
    if (subjectId) {
      setSelectedSubject(subjectId);
    }
  }, [subjectId]);

  const subject = SYLLABUS.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold">Subject not found</h2>
        <Link href="/" className="btn-primary mt-4 inline-block">
          Go Home
        </Link>
      </div>
    );
  }

  const handleProceed = () => {
    startQuiz(subjectId, selectedChapters);
    router.push(`/quiz?subject=${subjectId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2
        text-slate-500 hover:text-slate-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Subjects
      </Link>

      {/* Subject Header */}
      <div
        className={`bg-gradient-to-br ${subject.color}
        rounded-2xl p-8 text-white mb-8`}
      >
        <div className="text-5xl mb-3">{subject.emoji}</div>
        <h1 className="text-4xl font-extrabold">{subject.name}</h1>
        <p className="text-white/80 mt-2">
          {subject.chapters.length} chapters • NTA NEET Syllabus
        </p>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Chapter Selector */}
        <div className="md:col-span-2 space-y-4">
          <ChapterSelector
            subject={subject}
            onProceed={handleProceed}
          />
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
          <DifficultySlider />
          <QuizConfigPanel />
        </div>
      </div>
    </div>
  );
}

// ✅ Fix 2 — Wrap with Suspense
export default function SubjectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading subject...</p>
          </div>
        </div>
      }
    >
      <SubjectContent />
    </Suspense>
  );
}