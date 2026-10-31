import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "NEETPrep IQ — Chapter-wise MCQ Generator",
  description:
    "Ace your NEET exam with AI-powered chapter-wise MCQs in Physics, Chemistry & Biology. Customizable difficulty, analytics, and more.",
  keywords: "NEET, MCQ, Physics, Chemistry, Biology, NEET preparation, mock test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}