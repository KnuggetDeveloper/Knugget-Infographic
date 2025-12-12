"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Sparkles,
  PieChart,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export function Hero({ onGenerate, isGenerating }: HeroProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 pt-32 pb-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-10 max-w-4xl"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          New: Real-time Data Integration
        </div>

        <h1 className="mb-6 text-6xl font-bold tracking-tight sm:text-8xl leading-[0.9]">
          Visualize your <br />
          <span className="bg-linear-to-br from-emerald-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Data Story
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-white/70 sm:text-xl">
          Transform boring spreadsheets into viral infographics instantly. Just
          upload your data or describe what you need.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl"
      >
        <div className="relative group">
          {/* Enhanced input glow */}
          <div className="absolute -inset-1 rounded-[24px] bg-linear-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 blur-xl opacity-100 transition duration-500" />

          <div className="relative flex flex-col gap-2 rounded-[20px] bg-[#1A1A1A]/80 p-2 ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 focus-within:bg-[#1A1A1A] focus-within:ring-white/20">
            <div className="relative flex items-start">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your infographic (e.g. 'Compare Tesla vs Toyota sales 2024')..."
                className="border-0 bg-transparent text-lg shadow-none focus-visible:ring-0 placeholder:text-white/40 h-14 w-full px-4"
                disabled={isGenerating}
              />
            </div>

            <div className="flex items-center justify-between px-2 pb-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" /> Data Source
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <PieChart className="h-3.5 w-3.5" /> Style
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40 font-medium mr-2">
                  Generate
                </span>
                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90"
                >
                  {isGenerating ? (
                    <Sparkles className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rotate-90 transform">➤</div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.form>
    </section>
  );
}
