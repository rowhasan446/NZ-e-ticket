"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Calendar, MapPin, UserCheck } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/config";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "উৎসব সম্পর্কে", href: "#about" },
    // { label: "অনুষ্ঠান সূচী", href: "#schedule" }, // Commented out per user request
    { label: "নিয়মাবলি", href: "#rules" },
    { label: "নিবন্ধন", href: "#register", isCta: true },
  ];

  return (
    <header className="w-full relative z-30 select-none">
      {/* 1. Dark Top Bar */}
      <div className="bg-brand-dark text-white/90 text-xs md:text-sm py-1.5 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-brand-cream/90 font-medium">
              <Calendar className="w-3.5 h-3.5 text-brand-terracotta" />
              {EVENT_DETAILS.dates}
            </span>
            <span className="hidden md:inline text-white/30">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-white/80">
              <MapPin className="w-3.5 h-3.5 text-brand-terracotta" />
              {EVENT_DETAILS.venue}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-brand-cream/80">
            <span className="italic font-serif">প্রতিপাদ্য: ''{EVENT_DETAILS.theme}''</span>
            <Link
              href="/admin/login"
              className="text-white/60 hover:text-white transition-colors duration-200 ml-2 border-l border-white/20 pl-2"
            >
              অ্যাডমিন
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Cream Brand Header */}
      <div className="bg-brand-cream py-3 sm:py-4 px-4 sm:px-8 border-b border-brand-border/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-white/70 p-1 rounded-xl shadow-sm border border-brand-border/30">
              <Image
                src="/logo.png"
                alt="BNSS Logo"
                fill
                priority
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-brand-heading leading-tight tracking-tight">
                {EVENT_DETAILS.organizer}
              </h1>
              <p className="text-xs sm:text-sm font-semibold tracking-wider text-brand-rust uppercase mt-0.5">
                Bangladesh Nazrul Sangeet Sangstha (BNSS)
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center text-right">
            <div className="bg-white/60 border border-brand-border/60 rounded-xl px-4 py-2 shadow-sm backdrop-blur-sm">
              <span className="block text-xs font-semibold text-brand-rust">বিশেষ জাতীয় উৎসব</span>
              <span className="text-sm font-serif font-bold text-brand-heading">নজরুল উৎসব ২০২৬</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Terracotta Navigation Bar (Sticky with dynamic shadow) */}
      <nav
        className={`bg-brand-rust text-white transition-all duration-300 ${
          isScrolled
            ? "sticky top-0 shadow-elevated z-40 bg-brand-rust/95 backdrop-blur-md border-b border-brand-terracotta"
            : "relative shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-13 sm:h-14">
          {/* Logo hint on scroll */}
          <div className={`transition-opacity duration-300 flex items-center gap-2 ${isScrolled ? "opacity-100" : "opacity-0 pointer-events-none w-0"}`}>
            <span className="font-serif font-bold text-sm tracking-wide text-brand-cream truncate max-w-[200px] sm:max-w-none">
              নজরুল উৎসব ২০২৬
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 sm:space-x-2 font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  link.isCta
                    ? "bg-brand-cream text-brand-dark font-bold hover:bg-white hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 ml-4 flex items-center gap-1.5"
                    : "text-white/95 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.isCta && <UserCheck className="w-4 h-4 text-brand-rust" />}
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center ml-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-cream transition-colors"
              aria-label="মেনু টগল করুন"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-brand-dark/98 border-t border-white/10 px-4 pt-3 pb-5 space-y-2 text-center animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  link.isCta
                    ? "bg-brand-terracotta text-white font-bold shadow-md hover:bg-brand-terracotta-dark"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

