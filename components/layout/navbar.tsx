"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-background/50 border-b border-white/5">
      <div className="flex items-center gap-2">
        <Link href="/">
          <span className="text-xl font-display font-bold tracking-tighter hover:opacity-80 transition-opacity cursor-pointer">
            Infograph<span className="text-primary">.ai</span>
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">Showcase</a>
        <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
        <a href="#" className="hover:text-foreground transition-colors">API</a>
      </div>

      <div className="flex items-center gap-4">
        <a href="#" className="text-sm font-medium hover:text-foreground transition-colors hidden sm:block">Log in</a>
        <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
          Get Started
        </button>
      </div>
    </nav>
  );
}

