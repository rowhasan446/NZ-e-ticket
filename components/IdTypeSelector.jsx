import { CreditCard, BookOpen, FileCheck } from "lucide-react";
import { ID_TYPES } from "@/lib/config";

export default function IdTypeSelector({ value, onChange }) {
  const options = [
    {
      type: "NID",
      label: ID_TYPES.NID.labelBn,
      desc: "জাতীয় পরিচয়পত্র",
      icon: CreditCard,
    },
    {
      type: "PASSPORT",
      label: ID_TYPES.PASSPORT.labelBn,
      desc: "আন্তর্জাতিক পাসপোর্ট",
      icon: BookOpen,
    },
    {
      type: "BIRTH_CERTIFICATE",
      label: ID_TYPES.BIRTH_CERTIFICATE.labelBn,
      desc: "ডিজিটাল সনদপত্র",
      icon: FileCheck,
    },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm sm:text-base font-bold text-brand-heading">
        পরিচয়পত্রের ধরন নির্বাচন করুন <span className="text-red-600">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {options.map((opt) => {
          const isSelected = value === opt.type;
          const Icon = opt.icon;
          return (
            <button
              type="button"
              key={opt.type}
              onClick={() => onChange(opt.type)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left flex items-center sm:flex-col sm:items-center sm:text-center gap-3 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-brand-terracotta text-white border-brand-terracotta shadow-md scale-[1.02]"
                  : "bg-white text-brand-dark/90 border-brand-border/80 hover:border-brand-rust/60 hover:bg-brand-cream/30"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? "bg-white/20 text-white" : "bg-brand-cream text-brand-rust"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-sm sm:text-base leading-tight">
                  {opt.label}
                </span>
                <span
                  className={`block text-xs mt-0.5 ${
                    isSelected ? "text-brand-cream" : "text-brand-muted"
                  }`}
                >
                  {opt.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

