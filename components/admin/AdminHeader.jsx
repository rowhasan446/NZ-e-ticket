"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink, ShieldCheck, UserPlus, FileSpreadsheet } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/config";

export default function AdminHeader({ onAddClick, onExportClick, isExporting }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (e) {
      console.error("Logout failed:", e);
      setLoggingOut(false);
    }
  };

  return (
    <header className="bg-brand-dark text-white shadow-md border-b border-brand-border/20 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-white/10 rounded-xl p-1 border border-white/20 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="BNSS Logo"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <h1 className="font-serif font-bold text-base sm:text-lg text-brand-cream leading-tight">
              {EVENT_DETAILS.title}
            </h1>
            <p className="text-xs text-white/70 hidden sm:block">
              অ্যাডমিন ব্যবস্থাপনা ড্যাশবোর্ড
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-1.5 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">নতুন নিবন্ধন</span>
            <span className="sm:hidden">যুক্ত করুন</span>
          </button>

          <button
            onClick={onExportClick}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-70 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">CSV এক্সপোর্ট</span>
            <span className="sm:hidden">এক্সপোর্ট</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="মূল ওয়েবসাইট দেখুন"
          >
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="p-2 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-xl transition-colors ml-1"
            title="লগআউট করুন"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

