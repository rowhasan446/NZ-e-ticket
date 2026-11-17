import Image from "next/image";
import { UserPlus, MapPin, Calendar, ArrowDownCircle, ShieldCheck } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/config";

export default function HeroBanner() {
  return (
    <section className="relative w-full bg-brand-dark text-white overflow-hidden select-none border-b border-brand-border/30">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-rust/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-terracotta/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* 1. Left Column: Information, About, Details & Registration Button */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            {/* Top Partner Logo: Guardian Life Insurance */}
            <div className="inline-flex">
              <div className="relative h-[52px] sm:h-[62px] md:h-[70px] w-[170px] sm:w-[210px] md:w-[240px] bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-md border border-white/30 flex items-center justify-center overflow-hidden">
                <Image
                  src="/Gardian.jpeg"
                  alt="Guardian Life Insurance"
                  fill
                  priority
                  className="object-contain p-1"
                />
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-serif font-black tracking-tight leading-tight text-white drop-shadow-sm">
                {EVENT_DETAILS.title}
              </h1>
              <div className="border-l-4 border-brand-terracotta pl-3.5 py-0.5">
                <p className="text-xs sm:text-sm text-brand-cream/80 font-medium uppercase tracking-wider">
                  উৎসবের প্রতিপাদ্য
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-brand-cream tracking-wide">
                  ''{EVENT_DETAILS.theme}''
                </p>
              </div>
            </div>

            {/* About / Overview Short Copy */}
            <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed font-normal">
              জাতীয় কবি কাজী নজরুল ইসলামের সাম্য, দ্রোহ ও মানবমুক্তির চেতনাকে ধারণ করে অনুষ্ঠিত হতে যাচ্ছে দুইদিনব্যাপী এই বর্ণাঢ্য আয়োজন। নজরুলের অমর সৃষ্টিকর্ম ও সুরধারার উৎযাপনে দেশ-বিদেশের শিল্পী, অনুরাগী ও সংস্কৃতিপ্রেমীদের মিলনমেলা।
            </p>

            {/* Date & Location Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-3 bg-white/10 border border-white/15 p-3 rounded-2xl backdrop-blur-xs">
                <div className="w-10 h-10 rounded-xl bg-brand-terracotta flex items-center justify-center flex-shrink-0 text-white shadow-xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-brand-cream/70 block">তারিখ</span>
                  <span className="text-xs sm:text-sm font-bold text-white block">
                    {EVENT_DETAILS.dates}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 border border-white/15 p-3 rounded-2xl backdrop-blur-xs">
                <div className="w-10 h-10 rounded-xl bg-brand-rust flex items-center justify-center flex-shrink-0 text-white shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-brand-cream/70 block">উৎসবস্থল</span>
                  <span className="text-xs sm:text-sm font-bold text-white block">
                    {EVENT_DETAILS.venue}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row: CTA Button + Anondo & Novoair Partner Logos */}
            <div className="pt-2 sm:pt-3 space-y-3">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Registration CTA Button */}
                <a
                  href="#register"
                  className="inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-bold text-base sm:text-lg px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl shadow-elevated transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-ring/40 w-full sm:w-auto"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>নিবন্ধন করুন</span>
                  <ArrowDownCircle className="w-5 h-5 text-brand-cream" />
                </a>

                {/* Bottom 2 Partner Logos */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* Anondo Logo Card */}
                  <div className="relative h-[48px] sm:h-[54px] w-[64px] sm:w-[74px] bg-white rounded-xl sm:rounded-2xl p-1 shadow-sm border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <Image
                      src="/anondo.jpeg"
                      alt="Anondo Logo"
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Novoair Logo Card */}
                  <div className="relative h-[48px] sm:h-[54px] w-[100px] sm:w-[124px] bg-white rounded-xl sm:rounded-2xl p-1 shadow-sm border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <Image
                      src="/novoair.jpeg"
                      alt="NOVOAIR Logo"
                      fill
                      className="object-contain p-1.5"
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/60 flex items-center gap-1.5 pl-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>বিনামূল্যে ডিজিটাল রেজিস্ট্রেশন স্লিপ সংগ্রহ করুন</span>
              </p>
            </div>
          </div>

          {/* 2. Right Column: Full Banner Image without cropping */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-border/40 bg-black/40 group transition-all duration-300 hover:shadow-elevated hover:border-brand-border/70">
              <div className="relative w-full aspect-[1024/726]">
                <Image
                  src="/banner/hero.jpg"
                  alt="নজরুল উৎসব ২০২৬ অফিশিয়াল ব্যানার"
                  fill
                  priority
                  quality={95}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
