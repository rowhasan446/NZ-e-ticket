import { Music, Award, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-20 px-4 sm:px-8 relative z-10 scroll-mt-14">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 md:p-14 shadow-soft border border-brand-border/60 relative overflow-hidden transition-all duration-300 hover:shadow-elevated">
          {/* Subtle decorative background accent */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-cream/60 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block text-xs md:text-sm font-semibold tracking-wider text-brand-rust uppercase bg-brand-cream/70 px-3.5 py-1 rounded-full border border-brand-border/40">
              ঐতিহ্য ও সাংস্কৃতিক মেলবন্ধন
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-brand-heading tracking-tight">
              নজরুল উৎসব ২০২৬
            </h2>
            <div className="w-20 h-1 bg-brand-terracotta mx-auto rounded-full mt-2 mb-6" />
          </div>

          {/* Exact required text */}
          <div className="mt-8 text-base sm:text-lg md:text-xl text-brand-dark/90 leading-relaxed font-normal text-justify sm:text-center max-w-3xl mx-auto space-y-4">
            <p>
              বাংলাদেশ নজরুল সংগীত সংস্থা প্রতি বছরের ধারাবাহিকতায় এবারও আয়োজন করতে যাচ্ছে &apos;নজরুল উৎসব ২০২৬&apos;। এবারের উৎসবের প্রতিপাদ্য &apos;&apos;চির উন্নত মম শির&apos;&apos;—জাতীয় কবি কাজী নজরুল ইসলামের সাম্য ও মানবমুক্তির চেতনাকে ধারণ করে আগামী ২৭ ও ২৮ নভেম্বর দুই দিনব্যাপী অনুষ্ঠিত হবে এই আয়োজন। নজরুলের কালজয়ী সৃষ্টিকর্ম ও সংগীতের উদ্যাপনে মিলিত হবেন দেশ-বিদেশের নজরুলসংগীতের শিল্পী, অনুরাগী ও সংস্কৃতিপ্রেমীরা।
            </p>
          </div>

          {/* Key highlights cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-12 pt-8 border-t border-brand-border/40">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-bg/50 border border-brand-border/40">
              <div className="w-12 h-12 rounded-xl bg-brand-rust text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-brand-heading text-base">কালজয়ী সুর ও গান</h4>
                <p className="text-xs text-brand-muted">শাস্ত্রীয় ও রাগভিত্তিক সংগীতের মূর্ছনা</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-bg/50 border border-brand-border/40">
              <div className="w-12 h-12 rounded-xl bg-brand-terracotta text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-brand-heading text-base">গুণীজন সংবর্ধনা</h4>
                <p className="text-xs text-brand-muted">নজরুল গবেষক ও শিল্পীদের সম্মাননা</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-bg/50 border border-brand-border/40">
              <div className="w-12 h-12 rounded-xl bg-brand-dark text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-brand-heading text-base">উন্মুক্ত সংস্কৃতিপ্রেমী</h4>
                <p className="text-xs text-brand-muted">নিবন্ধিত দর্শকদের জন্য সুরক্ষিত প্রবেশ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

