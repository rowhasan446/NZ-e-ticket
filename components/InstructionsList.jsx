import { ShieldCheck, Info } from "lucide-react";

export default function InstructionsList() {
  const rules = [
    {
      num: "১",
      title: "বৈধ ই-টিকিট প্রদর্শন বাধ্যতামূলক",
      text: "উৎসবে প্রবেশের জন্য বৈধ ই-টিকিট প্রদর্শন বাধ্যতামূলক।",
    },
    {
      num: "২",
      title: "টিকিটের কপি অথবা PDF",
      text: "প্রবেশের সময় টিকিটের কপি অথবা PDF দেখিয়ে প্রবেশ করতে হবে।",
    },
    {
      num: "৩",
      title: "টিকিট হস্তান্তরযোগ্য নয়",
      text: "একজনের টিকিট অন্য জন ব্যবহার করতে পারবেন না।",
    },
    {
      num: "৪",
      title: "শৃঙ্খলা ও পরিচ্ছন্নতা বজায় রাখা",
      text: "উৎসবস্থলে শৃঙ্খলা, পরিচ্ছন্নতা ও সৌহার্দ্যপূর্ণ পরিবেশ বজায় রাখতে হবে।",
    },
    {
      num: "৫",
      title: "প্রবেশদ্বার উন্মুক্তের সময়",
      text: "অনুষ্ঠান শুরুর এক ঘণ্টা আগে প্রবেশদ্বার খুলে দেওয়া হবে।",
    },
    {
      num: "৬",
      title: "নিরাপত্তা নির্দেশনা মান্যকরণ",
      text: "আয়োজক কর্তৃপক্ষের নিরাপত্তা নির্দেশনা মেনে চলতে হবে।",
    },
    {
      num: "৭",
      title: "কর্তৃপক্ষের অধিকার সংরক্ষণ",
      text: "বিশেষ পরিস্থিতিতে আয়োজক কর্তৃপক্ষ প্রবেশ ও নিরাপত্তাসংক্রান্ত নিয়ম পরিবর্তনের অধিকার সংরক্ষণ করে।",
    },
  ];

  return (
    <section id="rules" className="py-16 md:py-20 px-4 sm:px-8 relative z-10 scroll-mt-14">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-10 md:mb-12">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider text-brand-rust uppercase bg-white/70 px-3.5 py-1 rounded-full border border-brand-border/40">
            উৎসবের শৃঙ্খলা ও নিরাপত্তা
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-brand-heading tracking-tight">
            দর্শনার্থীদের জন্য নির্দেশনা ও নিয়মাবলি
          </h2>
          <p className="text-base sm:text-lg text-brand-dark/80 font-medium">
            সুষ্ঠু ও সুন্দরভাবে উৎসব উদযাপনে আপনার সর্বাত্মক সহযোগিতা কাম্য
          </p>
          <div className="w-20 h-1 bg-brand-terracotta mx-auto rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {rules.map((rule) => (
            <div
              key={rule.num}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-soft border border-brand-border/60 hover:border-brand-rust/50 hover:shadow-elevated transition-all duration-300 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-cream border border-brand-border text-brand-heading font-serif font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                {rule.num}
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-brand-heading text-base sm:text-lg">
                  {rule.title}
                </h4>
                <p className="text-sm sm:text-base text-brand-dark/85 leading-relaxed">
                  {rule.text}
                </p>
              </div>
            </div>
          ))}

          {/* Additional Note Banner */}
          <div className="md:col-span-2 bg-brand-cream/80 border border-brand-rust/30 rounded-2xl p-5 flex items-center gap-4 text-brand-heading">
            <Info className="w-6 h-6 text-brand-rust flex-shrink-0" />
            <p className="text-sm sm:text-base font-medium">
              নিবন্ধন সম্পন্ন করার পর প্রাপ্ত নিবন্ধন স্লিপটি সংগ্রহে রাখুন। পরবর্তীতে অফিসিয়াল ই-টিকিট বিতরণের সময় এটি প্রয়োজন হতে পারে।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

