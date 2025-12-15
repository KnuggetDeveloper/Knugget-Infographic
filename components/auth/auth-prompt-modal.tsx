"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt?: string | null;
}

export function AuthPromptModal({ isOpen, onClose, prompt }: AuthPromptModalProps) {
  const router = useRouter();

  const handleContinueWithEmail = () => {
    router.push("/signup");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-[#2A2A2A] rounded-2xl p-8 m-4 relative border border-white/10">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-orange-500 via-purple-500 to-blue-500 rounded-xl" />
              </div>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Start Building.</h2>
                <p className="text-white/60">Create free account</p>
              </div>

              {/* Show prompt if provided */}
              {prompt && (
                <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-white/80 line-clamp-2">{prompt}</p>
                </div>
              )}

              {/* Auth Buttons */}
              <div className="space-y-3">
                {/* Email Button */}
                <button
                  onClick={handleContinueWithEmail}
                  className="w-full px-4 py-3 rounded-lg bg-white text-black hover:bg-gray-200 transition-colors font-semibold"
                >
                  Continue with email
                </button>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-white/60 mt-6">
                By continuing, you agree to the{" "}
                <a href="#" className="underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                  Privacy Policy
                </a>
                .
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
