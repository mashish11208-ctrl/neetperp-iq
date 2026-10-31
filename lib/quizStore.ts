import { create } from "zustand";
import { Question } from "@/data/mockQuestions";

export type Difficulty = "Easy" | "Medium" | "Hard" | "Mixed";
export type TimerDuration = 30 | 60 | 90 | 0; // 0 = no limit

export type UserAnswer = {
  questionId: string;
  selected: "A" | "B" | "C" | "D" | null;
  bookmarked: boolean;
  timeTaken: number;
};

export type QuizSettings = {
  difficulty: Difficulty;
  questionCount: number;
  timer: TimerDuration;
  negativeMarking: boolean;
  darkMode: boolean;
  language: "English" | "Hindi";
};

type QuizStore = {
  // Settings
  settings: QuizSettings;
  updateSettings: (s: Partial<QuizSettings>) => void;

  // Quiz session
  questions: Question[];
  currentIndex: number;
  answers: Record<string, UserAnswer>;
  isQuizActive: boolean;
  selectedSubject: string;
  selectedChapters: string[];

  // Actions
  setQuestions: (q: Question[]) => void;
  setCurrentIndex: (i: number) => void;
  answerQuestion: (qId: string, option: "A" | "B" | "C" | "D") => void;
  toggleBookmark: (qId: string) => void;
  skipQuestion: (qId: string) => void;
  startQuiz: (subject: string, chapters: string[]) => void;
  endQuiz: () => void;
  resetQuiz: () => void;
  setSelectedSubject: (s: string) => void;
  setSelectedChapters: (c: string[]) => void;

  // Computed
  getScore: () => { correct: number; incorrect: number; skipped: number; total: number; marks: number };
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  settings: {
    difficulty: "Medium",
    questionCount: 10,
    timer: 60,
    negativeMarking: true,
    darkMode: false,
    language: "English",
  },

  questions: [],
  currentIndex: 0,
  answers: {},
  isQuizActive: false,
  selectedSubject: "",
  selectedChapters: [],

  updateSettings: (s) =>
    set((state) => ({ settings: { ...state.settings, ...s } })),

  setQuestions: (q) => set({ questions: q }),
  setCurrentIndex: (i) => set({ currentIndex: i }),

  answerQuestion: (qId, option) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [qId]: {
          questionId: qId,
          selected: option,
          bookmarked: state.answers[qId]?.bookmarked ?? false,
          timeTaken: state.answers[qId]?.timeTaken ?? 0,
        },
      },
    })),

  toggleBookmark: (qId) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [qId]: {
          ...state.answers[qId],
          questionId: qId,
          selected: state.answers[qId]?.selected ?? null,
          bookmarked: !state.answers[qId]?.bookmarked,
          timeTaken: state.answers[qId]?.timeTaken ?? 0,
        },
      },
    })),

  skipQuestion: (qId) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [qId]: {
          questionId: qId,
          selected: null,
          bookmarked: state.answers[qId]?.bookmarked ?? false,
          timeTaken: state.answers[qId]?.timeTaken ?? 0,
        },
      },
    })),

  startQuiz: (subject, chapters) =>
    set({ isQuizActive: true, selectedSubject: subject, selectedChapters: chapters, currentIndex: 0, answers: {} }),

  endQuiz: () => set({ isQuizActive: false }),

  resetQuiz: () =>
    set({ questions: [], currentIndex: 0, answers: {}, isQuizActive: false }),

  setSelectedSubject: (s) => set({ selectedSubject: s, selectedChapters: [] }),
  setSelectedChapters: (c) => set({ selectedChapters: c }),

  getScore: () => {
    const { questions, answers, settings } = get();
    let correct = 0, incorrect = 0, skipped = 0;
    questions.forEach((q) => {
      const ans = answers[q.id];
      if (!ans || ans.selected === null) {
        skipped++;
      } else if (ans.selected === q.correctOption) {
        correct++;
      } else {
        incorrect++;
      }
    });
    const marks = correct * 4 - (settings.negativeMarking ? incorrect * 1 : 0);
    return { correct, incorrect, skipped, total: questions.length, marks };
  },
}));