"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/hero";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { AuthPromptModal } from "@/components/auth/auth-prompt-modal";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const { toast } = useToast();
  const { status } = useSession();
  const router = useRouter();
  const hasProcessedPendingPrompt = useRef(false);

  const handleGenerate = useCallback(
    async (prompt: string) => {
      // Check if user is authenticated
      if (status === "unauthenticated") {
        // Save prompt to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("pendingPrompt", prompt);
        }
        setPendingPrompt(prompt);
        setShowAuthPrompt(true);
        return;
      }

      if (status === "loading") {
        toast({
          title: "Please wait",
          description: "Checking authentication...",
        });
        return;
      }

      setIsGenerating(true);

      try {
        // Create generation record first (without image data)
        const response = await fetch("/api/generation/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create generation");
        }

        if (data.success && data.generationId) {
          // Navigate to the result page where generation will happen
          router.push(`/result/${data.generationId}`);
        } else {
          throw new Error("No generation ID received");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setIsGenerating(false);
        toast({
          title: "Generation Failed",
          description:
            errorMessage || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    },
    [status, router, toast]
  );

  // Check for pending prompt after login (only once)
  useEffect(() => {
    if (
      status === "authenticated" &&
      typeof window !== "undefined" &&
      !hasProcessedPendingPrompt.current
    ) {
      const savedPrompt = localStorage.getItem("pendingPrompt");
      if (savedPrompt) {
        hasProcessedPendingPrompt.current = true; // Prevent double execution
        localStorage.removeItem("pendingPrompt");
        // Auto-trigger generation with saved prompt
        handleGenerate(savedPrompt);
      }
    }
  }, [status, handleGenerate]);

  return (
    <div className="relative min-h-screen">
      {/* Lovable-style Gradient Background */}
      <div className="lovable-gradient" />
      <div className="noise-overlay" />

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero onGenerate={handleGenerate} isGenerating={isGenerating} />
        </main>
      </div>

      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={() => {
          setShowAuthPrompt(false);
          // Clear pending prompt if user closes modal
          if (typeof window !== "undefined") {
            localStorage.removeItem("pendingPrompt");
          }
        }}
        prompt={pendingPrompt}
      />

      <Toaster />
    </div>
  );
}
