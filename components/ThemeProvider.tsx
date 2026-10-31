"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useQuizStore } from "@/lib/quizStore";

const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
}>({ isDark: false, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSettings } = useQuizStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", settings.darkMode);
    }
  }, [settings.darkMode, mounted]);

  const toggleTheme = () => updateSettings({ darkMode: !settings.darkMode });

  if (!mounted) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ isDark: settings.darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);