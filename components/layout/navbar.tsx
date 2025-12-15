"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-5 backdrop-blur-[10px] bg-black/20 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white text-xl font-bold no-underline hover:opacity-80 transition-opacity"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
            Infograph
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a
              href="#"
              className="text-[#e4e4e7] no-underline hover:text-white transition-colors"
            >
              Solutions
            </a>
            <a
              href="#"
              className="text-[#e4e4e7] no-underline hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-[#e4e4e7] no-underline hover:text-white transition-colors"
            >
              Community
            </a>
          </div>

          <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse bg-white/10 rounded-full" />
          ) : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <UserIcon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:block">
                  {session.user.name || session.user.email?.split("@")[0]}
                </span>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 glass-card rounded-lg p-2 z-50">
                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-white/60">{session.user.email}</p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 rounded transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-white text-sm font-medium no-underline hover:opacity-80 transition-opacity hidden sm:block"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold no-underline hover:-translate-y-0.5 transition-transform"
              >
                Get started
              </Link>
            </>
          )}
        </div>
        </div>
      </nav>
    </>
  );
}

