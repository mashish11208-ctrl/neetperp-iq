"use client";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import {
  Sun,
  Moon,
  BookOpen,
  BarChart2,
  Settings,
  User,
  Zap,
} from "lucide-react";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-brand dark:bg-slate-950 shadow-lg shadow-brand/30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            NEETPrep <span className="text-yellow-300">IQ</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/" icon={<BookOpen className="w-4 h-4" />} label="Subjects" />
          <NavLink href="/dashboard" icon={<BarChart2 className="w-4 h-4" />} label="Dashboard" />
          <NavLink href="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
          <NavLink href="/profile" icon={<User className="w-4 h-4" />} label="Profile" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link
            href="/profile"
            className="bg-yellow-400 text-brand font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-all text-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all text-sm font-medium"
    >
      {icon}
      {label}
    </Link>
  );
}