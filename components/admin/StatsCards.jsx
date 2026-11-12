import { Users, UserCheck, Clock } from "lucide-react";
import { enToBnDigits } from "@/lib/bn";

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: "মোট নিবন্ধন",
      value: stats?.total ?? 0,
      icon: Users,
      bgColor: "bg-white",
      iconBg: "bg-brand-cream text-brand-heading",
      borderColor: "border-brand-border",
      textColor: "text-brand-heading",
    },
    {
      title: "চেক-ইন সম্পন্ন",
      value: stats?.checkedIn ?? 0,
      icon: UserCheck,
      bgColor: "bg-emerald-50/70",
      iconBg: "bg-emerald-100 text-emerald-800",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-900",
    },
    {
      title: "চেক-ইন বাকি",
      value: stats?.pending ?? 0,
      icon: Clock,
      bgColor: "bg-amber-50/70",
      iconBg: "bg-amber-100 text-amber-800",
      borderColor: "border-amber-200",
      textColor: "text-amber-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`${c.bgColor} ${c.borderColor} border rounded-2xl p-5 shadow-soft flex items-center justify-between transition-all duration-200 hover:shadow-elevated`}
          >
            <div>
              <p className="text-xs sm:text-sm font-semibold text-brand-muted">
                {c.title}
              </p>
              <h3 className={`text-2xl sm:text-3xl font-serif font-black ${c.textColor} mt-1`}>
                {enToBnDigits(c.value)} জন
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.iconBg}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

