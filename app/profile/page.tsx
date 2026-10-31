"use client";
import { useState } from "react";
import { User, Mail, Lock, Chrome } from "lucide-react";

export default function ProfilePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  if (isGuest) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">👤</div>
        <h2 className="text-3xl font-extrabold text-slate-800 
        dark:text-white mb-2">
          Guest Mode
        </h2>
        <p className="text-slate-500 mb-6">
          You are using NEETPrep IQ as a guest!
        </p>
        <div className="card p-6 text-left space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-600 
            dark:text-slate-400">Mode</span>
            <span className="font-bold text-green-500">
              Guest ✅
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 
            dark:text-slate-400">Progress Saved</span>
            <span className="font-bold text-yellow-500">
              Session Only
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsGuest(false)}
          className="btn-primary w-full"
        >
          Sign In for Full Access
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-2xl font-extrabold text-slate-800 
          dark:text-white">
            {isLogin ? "Welcome Back!" : "Join NEETPrep IQ"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isLogin
              ? "Login to track your progress"
              : "Create account to get started"}
          </p>
        </div>

        {/* Guest Mode Button */}
        <button
          onClick={() => setIsGuest(true)}
          className="w-full py-3 rounded-xl border-2 
          border-dashed border-slate-300 dark:border-slate-600 
          text-slate-600 dark:text-slate-400 font-semibold 
          hover:border-brand hover:text-brand 
          transition-all mb-6 flex items-center 
          justify-center gap-2"
        >
          <User className="w-4 h-4" />
          Continue as Guest
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-200 
          dark:bg-slate-700" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="flex-1 h-px bg-slate-200 
          dark:bg-slate-700" />
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          {!isLogin && (
            <div>
              <label className="text-sm font-semibold 
              text-slate-700 dark:text-slate-300 mb-1 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 
                -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl 
                  border border-slate-200 dark:border-slate-700 
                  bg-slate-50 dark:bg-slate-800 text-sm 
                  focus:outline-none focus:ring-2 
                  focus:ring-brand dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold 
            text-slate-700 dark:text-slate-300 mb-1 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 
              -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl 
                border border-slate-200 dark:border-slate-700 
                bg-slate-50 dark:bg-slate-800 text-sm 
                focus:outline-none focus:ring-2 
                focus:ring-brand dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold 
            text-slate-700 dark:text-slate-300 mb-1 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 
              -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl 
                border border-slate-200 dark:border-slate-700 
                bg-slate-50 dark:bg-slate-800 text-sm 
                focus:outline-none focus:ring-2 
                focus:ring-brand dark:text-white"
              />
            </div>
          </div>
        </div>

        <button className="btn-primary w-full mb-4">
          {isLogin ? "Login" : "Create Account"}
        </button>

        <p className="text-center text-sm text-slate-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand dark:text-blue-400 
            font-bold hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}