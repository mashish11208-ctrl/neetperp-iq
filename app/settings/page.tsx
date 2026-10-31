"use client";
import { useQuizStore } from "@/lib/quizStore";
import { Moon, Sun, Globe, Bell, Shield, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import clsx from "clsx";

export default function SettingsPage() {
  const { settings, updateSettings } = useQuizStore();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">⚙️ Settings</h1>

      <div className="space-y-4">
        {/* Appearance */}
        <Section title="🎨 Appearance">
          <SettingRow
            icon={isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            label="Dark Mode"
            description="Toggle dark/light theme"
          >
            <Toggle value={isDark} onChange={toggleTheme} />
          </SettingRow>
        </Section>

        {/* Quiz Preferences */}
        <Section title="🎯 Quiz Preferences">
          <SettingRow
            icon={<Shield className="w-5 h-5 text-red-400" />}
            label="Negative Marking"
            description="-1 mark for wrong answers"
          >
            <Toggle
              value={settings.negativeMarking}
              onChange={() => updateSettings({ negativeMarking: !settings.negativeMarking })}
            />
          </SettingRow>
          <SettingRow
            icon={<Bell className="w-5 h-5 text-purple-400" />}
            label="Default Difficulty"
            description="Applies to all new quizzes"
          >
            <select
              value={settings.difficulty}
              onChange={(e) => updateSettings({ difficulty: e.target.value as any })}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm px-3 py-1.5 text-slate-700 dark:text-slate-300"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
              <option>Mixed</option>
            </select>
          </SettingRow>
          <SettingRow
            icon={<ChevronRight className="w-5 h-5 text-slate-400" />}
            label="Questions Per Session"
            description="Default number of MCQs"
          >
            <select
              value={settings.questionCount}
              onChange={(e) => updateSettings({ questionCount: Number(e.target.value) })}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm px-3 py-1.5 text-slate-700 dark:text-slate-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </SettingRow>
        </Section>

        {/* Language */}
        <Section title="🌐 Language">
          <SettingRow
            icon={<Globe className="w-5 h-5 text-green-400" />}
            label="Language"
            description="Interface language preference"
          >
            <div className="flex gap-2">
              {(["English", "Hindi"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => updateSettings({ language: lang })}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all",
                    settings.language === lang
                      ? "border-brand bg-brand text-white"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </SettingRow>
        </Section>

        {/* About */}
        <div className="card p-6 text-center">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-bold text-slate-800 dark:text-white">NEETPrep IQ</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Version 1.0.0 • Built for NEET Aspirants</p>
          <p className="text-xs text-slate-400 mt-2">Syllabus: NTA NEET 2024-25</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">{children}</div>
    </div>
  );
}

function SettingRow({
  icon, label, description, children,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{description}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={clsx(
        "w-12 h-6 rounded-full transition-all duration-300 relative",
        value ? "bg-brand" : "bg-slate-300 dark:bg-slate-600"
      )}
      aria-label="Toggle setting"
    >
      <div
        className={clsx(
          "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow",
          value ? "left-6" : "left-0.5"
        )}
      />
    </button>
  );
}