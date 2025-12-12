"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/hero";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2 } from "lucide-react";

// Interface for the generated result
interface GeneratedResult {
  id: string;
  imageData: string; // Base64 image data
  prompt: string;
}

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setResult(null); // Clear previous result

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate infographic");
      }

      if (data.success && data.imageData) {
        setIsGenerating(false);
        toast({
          title: "Infographic Generated",
          description: "Your design is ready to view.",
        });

        setResult({
          id: Date.now().toString(),
          imageData: data.imageData,
          prompt: prompt,
        });
      } else {
        throw new Error("No image data received");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: errorMessage || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!result?.imageData) return;

    try {
      // Convert base64 to blob
      const byteCharacters = atob(result.imageData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `infographic-${result.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your infographic is being downloaded.",
      });
    } catch {
      toast({
        title: "Download Failed",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden">
      {/* Aurora Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] animate-aurora opacity-30 vibrant-glow-bg mix-blend-screen" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="grow flex flex-col items-center justify-start pb-20">
          <Hero onGenerate={handleGenerate} isGenerating={isGenerating} />

          {/* Result Section - Shows when generating or when there is a result */}
          <AnimatePresence>
            {(isGenerating || result) && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-full max-w-4xl px-4 mt-8"
              >
                <div className="glass-card rounded-2xl overflow-hidden p-1">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/50">
                    {/* Loading State */}
                    {isGenerating && !result && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white/30 border-r-white mb-4"></div>
                          <p className="text-white text-lg font-medium">
                            Generating...
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Display the generated image */}
                    {result?.imageData && (
                      <Image
                        src={`data:image/png;base64,${result.imageData}`}
                        alt={`Infographic: ${result.prompt}`}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    )}

                    {/* Overlay Actions - Only show when result is available */}
                    {result && (
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button
                          onClick={handleDownload}
                          className="rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/70 border border-white/10"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/70 border border-white/10">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
