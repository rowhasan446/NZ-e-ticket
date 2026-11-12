import Link from "next/link";
import { Heart, Shield } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white/90 relative z-20 border-t border-brand-border/20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {/* 
          // -------------------------------------------------------------
          // Top 3-column footer section (Commented out per user request)
          // -------------------------------------------------------------
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-10 border-b border-white/10">
            // Brand & Info
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 bg-white/10 rounded-xl p-1 border border-white/20">
                  <Image src="/logo.png" alt="BNSS Logo" fill className="object-contain p-0.5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-brand-cream">{EVENT_DETAILS.organizer}</h3>
                  <p className="text-xs text-white/70">নজরুল সংস্কৃতি ও ঐতিহ্যের ধারক</p>
                </div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                জাতীয় কবি কাজী নজরুল ইসলামের কালজয়ী সাহিত্য ও সংগীতের সুরধারা ছড়িয়ে দিতে প্রতি বছর আয়োজিত হয় নজরুল উৎসব।
              </p>
            </div>

            // Quick Links
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-base text-brand-cream border-b border-white/15 pb-2">দ্রুত লিঙ্ক</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#about" className="hover:text-brand-cream transition-colors">উৎসব পরিচিতি</a></li>
                <li><a href="#rules" className="hover:text-brand-cream transition-colors">দর্শনার্থীদের নিয়মাবলি</a></li>
                <li><a href="#register" className="hover:text-brand-cream transition-colors">অনলাইন টিকিট নিবন্ধন</a></li>
              </ul>
            </div>

            // Contact Details
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-base text-brand-cream border-b border-white/15 pb-2">যোগাযোগ ও উৎসবস্থল</h4>
              <div className="space-y-2 text-sm text-white/80">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-terracotta flex-shrink-0 mt-0.5" />
                  <span>{EVENT_DETAILS.venue}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-brand-terracotta flex-shrink-0" />
                  <span>{EVENT_DETAILS.phone}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-brand-terracotta flex-shrink-0" />
                  <span>{EVENT_DETAILS.email}</span>
                </p>
              </div>
            </div>
          </div>
        */}

        {/* Lower Part of Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-white/70 text-center sm:text-left">
          <div>
            <p>{EVENT_DETAILS.copyright}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            <span className="text-brand-cream font-medium">
              Developed and maintained by <span className="text-white font-bold underline decoration-brand-terracotta underline-offset-4">Rownak Hasan</span>
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <Link
              href="/admin/login"
              className="text-white/50 hover:text-white transition-colors inline-flex items-center gap-1"
              title="অ্যাডমিন পোর্টাল"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>অ্যাডমিন</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
