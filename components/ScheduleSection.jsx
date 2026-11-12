"use client";

import { useState } from "react";
import { Clock, Calendar, ChevronRight } from "lucide-react";
import { schedule } from "@/data/schedule";

export default function ScheduleSection() {
  const [activeTab, setActiveTab] = useState(0);

  const currentSchedule = schedule[activeTab] || schedule[0];

  return (
    <section id="schedule" className="py-16 md:py-20 px-4 sm:px-8 relative z-10 scroll-mt-14">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10 md:mb-12">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider text-brand-rust uppercase bg-white/70 px-3.5 py-1 rounded-full border border-brand-border/40">
            দুই দিনব্যাপী উৎসবের রূপরেখা
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-brand-heading tracking-tight">
            অনুষ্ঠান সূচী
          </h2>
          <p className="text-base sm:text-lg text-brand-dark/80 font-medium">
            দুই দিনব্যাপী আয়োজনের পূর্ণাঙ্গ সূচী
          </p>
          <div className="w-20 h-1 bg-brand-terracotta mx-auto rounded-full mt-2" />
        </div>

        {/* Day Selector Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/90 border border-brand-border shadow-soft backdrop-blur-md">
            {schedule.map((item, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-5 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 flex items-center gap-2.5 ${
                    isActive
                      ? "bg-brand-rust text-white shadow-md transform -translate-y-0.5"
                      : "text-brand-dark/75 hover:text-brand-rust hover:bg-brand-cream/40"
                  }`}
                >
                  <Calendar className={`w-4 h-4 ${isActive ? "text-brand-cream" : "text-brand-muted"}`} />
                  <span>
                    {item.day} ({item.date.split(" ")[0]} {item.date.split(" ")[1]})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 md:p-12 shadow-soft border border-brand-border/60 transition-all duration-300">
          <div className="border-b border-brand-border/40 pb-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-heading">
                {currentSchedule.day} — {currentSchedule.date}
              </h3>
              {currentSchedule.daySubtitle && (
                <p className="text-xs sm:text-sm text-brand-muted font-medium mt-0.5">
                  {currentSchedule.daySubtitle}
                </p>
              )}
            </div>
            <span className="text-xs bg-brand-cream text-brand-heading font-semibold px-3 py-1 rounded-full border border-brand-border/40">
              মোট {currentSchedule.items.length} টি অধিবেশন
            </span>
          </div>

          {/* Timeline Items */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-brand-rust/30">
            {currentSchedule.items.map((session, sIdx) => (
              <div
                key={sIdx}
                className="relative group transition-all duration-200"
              >
                {/* Timeline node */}
                <div className="absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full bg-brand-rust border-4 border-white shadow-sm group-hover:scale-125 transition-transform" />

                <div className="bg-brand-bg/40 hover:bg-brand-bg/70 border border-brand-border/50 hover:border-brand-rust/40 p-4 sm:p-5 rounded-2xl transition-all duration-200 hover:shadow-soft">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-brand-terracotta px-3 py-1 rounded-lg shadow-xs">
                      <Clock className="w-3.5 h-3.5" />
                      {session.time}
                    </span>
                    <span className="text-xs text-brand-muted font-medium flex items-center gap-1">
                      অধিবেশন #{sIdx + 1}
                      <ChevronRight className="w-3 h-3 text-brand-rust opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-serif font-bold text-brand-heading mt-1">
                    {session.title}
                  </h4>

                  {session.description && (
                    <p className="text-sm sm:text-base text-brand-dark/80 mt-1.5 leading-relaxed">
                      {session.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

