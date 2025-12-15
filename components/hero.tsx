"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
    <section className="relative pt-[180px] pb-[100px] text-center px-4">
      <div className="container max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-[3.5rem] md:text-[5rem] font-bold leading-[1.1] mb-6 tracking-[-0.02em]">
            Build something{" "}
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Lovable
            </span>
          </h1>
          <p className="text-xl text-[#e4e4e7] mb-12 max-w-[600px] mx-auto">
            Create infographics and visualizations by chatting with AI.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          onSubmit={handleSubmit}
          className="max-w-[800px] mx-auto"
        >
          <div className="bg-[rgba(20,20,20,0.6)] backdrop-blur-[20px] border border-white/10 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-200 focus-within:border-white/20">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask Lovable to create a..."
                disabled={isGenerating}
                className="flex-1 bg-transparent border-none text-white text-lg px-2 py-2 outline-none placeholder:text-white/40 font-normal"
              />
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center justify-center h-10 w-10 rounded-lg bg-white text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                title="Generate"
              >
                {isGenerating ? (
                  <Sparkles className="h-5 w-5 animate-spin" />
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
