"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { EVENT_DETAILS } from "@/lib/config";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show splash animation smoothly on first mount
    const timer = setTimeout(() => {
      setFading(true);
      const removeTimer = setTimeout(() => {
        setLoading(false);
      }, 500); // 500ms fade-out transition
      return () => clearTimeout(removeTimer);
    }, 1000); // Display for ~1s

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-bg transition-opacity duration-500 select-none ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-radial from-brand-cream/80 via-brand-bg to-brand-bg pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-sm mx-auto space-y-6 animate-fadeIn">
        {/* Animated Logo Container with Glowing Ring */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <div className="absolute w-36 h-36 rounded-full bg-brand-terracotta/20 animate-ping opacity-75" />

          {/* Rotating Decorative Border Ring */}
          <div className="w-32 h-32 rounded-full border-4 border-dashed border-brand-terracotta/40 animate-spin [animation-duration:8s] absolute" />

          {/* Spinning Accent Arc */}
          <div className="w-32 h-32 rounded-full border-4 border-transparent border-t-brand-rust border-r-brand-terracotta animate-spin [animation-duration:1.5s] absolute" />

          {/* Logo Card */}
          <div className="relative w-24 h-24 rounded-2xl bg-white/95 p-3 shadow-elevated border border-brand-border/80 flex items-center justify-center transform transition-transform duration-500 hover:scale-105">
            <Image
              src="/logo.png"
              alt="BNSS Logo"
              fill
              priority
              className="object-contain p-2"
            />
          </div>
        </div>

        {/* Festival Title & Theme */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-brand-heading tracking-tight">
            {EVENT_DETAILS.title}
          </h2>
          <p className="text-sm font-serif italic font-bold text-brand-rust">
            প্রতিপাদ্য: ''{EVENT_DETAILS.theme}''
          </p>
          <p className="text-xs text-brand-muted font-medium pt-0.5">
            {EVENT_DETAILS.organizer}
          </p>
        </div>

        {/* Elegant Animated Progress Bar */}
        <div className="w-48 space-y-2">
          <div className="w-full bg-brand-cream h-1.5 rounded-full overflow-hidden border border-brand-border/60">
            <div className="h-full bg-gradient-to-r from-brand-rust via-brand-terracotta to-brand-rust rounded-full animate-progress" />
          </div>
          <p className="text-[11px] text-brand-muted font-medium tracking-wider">
            লোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন
          </p>
        </div>
      </div>
    </div>
  );
}
