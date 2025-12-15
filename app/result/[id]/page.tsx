"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Download, Share2, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";

interface GenerationData {
  id: string;
  prompt: string;
  imageData: string;
  createdAt: string;
}

export default function ResultPage() {
  const params = useParams();
  const id = params.id as string;
  const [generation, setGeneration] = useState<GenerationData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAndGenerate() {
      try {
        // First, fetch the generation data
        const response = await fetch(`/api/generation/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load infographic");
        }

        setGeneration(data);
        setIsLoading(false);

        // If no image data, start generating
        if (!data.imageData || data.imageData === "") {
          setIsGenerating(true);
          
          const generateResponse = await fetch(`/api/generation/${id}/generate`, {
            method: "POST",
          });

          const generateData = await generateResponse.json();

          if (!generateResponse.ok) {
            throw new Error(generateData.error || "Failed to generate infographic");
          }

          if (generateData.success && generateData.imageData) {
            setGeneration(prev => prev ? { ...prev, imageData: generateData.imageData } : null);
            setIsGenerating(false);
            
            toast({
              title: "Generation Complete!",
              description: "Your infographic is ready.",
            });
          } else {
            throw new Error("No image data received");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load infographic");
        setIsGenerating(false);
        setIsLoading(false);
        toast({
          title: "Generation Failed",
          description: err instanceof Error ? err.message : "Something went wrong",
          variant: "destructive",
        });
      }
    }

    if (id) {
      fetchAndGenerate();
    }
  }, [id, toast]);

  const handleDownload = () => {
    if (!generation?.imageData) return;

    try {
      // Convert base64 to blob
      const byteCharacters = atob(generation.imageData);
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
      link.download = `infographic-${generation.id}.png`;
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

  const handleShare = async () => {
    if (!generation) return;

    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out my infographic",
          text: generation.prompt,
          url: shareUrl,
        });
        toast({
          title: "Shared!",
          description: "Thanks for sharing your infographic.",
        });
      } catch (err) {
        // User cancelled share
        console.log("Share cancelled");
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Link copied to clipboard!",
        });
      } catch {
        toast({
          title: "Failed to copy",
          description: "Could not copy link to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading || isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {/* Aurora Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] animate-aurora opacity-30 vibrant-glow-bg mix-blend-screen" />
        </div>
        
        <div className="relative z-10 text-center">
          <div className="mb-6">
            <Sparkles className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isLoading ? "Loading..." : "Creating your infographic"}
          </h2>
          <p className="text-white/60 mb-4">
            {isLoading ? "Setting things up..." : "This may take up to a minute..."}
          </p>
          {generation && (
            <div className="max-w-md mx-auto glass-card rounded-lg p-4 mt-6">
              <p className="text-sm text-white/80">{generation.prompt}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error || !generation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Oops!</h1>
          <p className="text-white/60 mb-6">
            {error || "We couldn't find that infographic."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] animate-aurora opacity-30 vibrant-glow-bg mix-blend-screen" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-sm bg-background/50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors text-sm font-semibold"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Prompt */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Your Infographic</h1>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                {generation.prompt}
              </p>
            </div>

            {/* Image Display */}
            <div className="glass-card rounded-2xl overflow-hidden p-1">
              <div className="relative w-full bg-black/50 rounded-xl overflow-hidden">
                <Image
                  src={`data:image/png;base64,${generation.imageData}`}
                  alt={`Infographic: ${generation.prompt}`}
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  unoptimized
                  priority
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-6 text-center text-sm text-white/40">
              Created on {new Date(generation.createdAt).toLocaleDateString()} at{" "}
              {new Date(generation.createdAt).toLocaleTimeString()}
            </div>
          </motion.div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

