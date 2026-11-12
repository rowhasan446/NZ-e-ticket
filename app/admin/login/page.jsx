"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, User, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { EVENT_DETAILS } from "@/lib/config";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করে পুনরায় চেষ্টা করুন।");
        setLoading(false);
        return;
      }

      router.push(from);
    } catch (err) {
      setError("নেটওয়ার্ক বা সার্ভারে সমস্যা দেখা দিয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 shadow-elevated rounded-3xl border border-brand-border">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="adminId"
            className="block text-sm font-bold text-brand-heading"
          >
            অ্যাডমিন আইডি (Admin ID)
          </label>
          <div className="mt-1.5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
              <User className="w-5 h-5" />
            </div>
            <input
              id="adminId"
              name="adminId"
              type="text"
              required
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="অ্যাডমিন আইডি লিখুন"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border text-brand-dark focus:border-brand-rust focus:ring-3 focus:ring-brand-ring/30 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-bold text-brand-heading"
          >
            পাসওয়ার্ড (Password)
          </label>
          <div className="mt-1.5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border text-brand-dark focus:border-brand-rust focus:ring-3 focus:ring-brand-ring/30 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:opacity-75 text-white font-bold py-3.5 px-4 rounded-xl shadow-elevated transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>লগইন করুন</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-brand-muted border-t border-brand-border/60 pt-4">
        🔒 শুধুমাত্র অনুমোদিত কর্মকর্তাদের জন্য সংরক্ষিত
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Back Link */}
        <div className="mb-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-heading hover:text-brand-terracotta transition-colors bg-white/80 px-4 py-2 rounded-xl shadow-xs border border-brand-border"
          >
            <ArrowLeft className="w-4 h-4" />
            ওয়েবসাইটের মূল পাতায় যান
          </Link>
        </div>

        {/* Logo */}
        <div className="relative w-20 h-20 mx-auto bg-white p-2 rounded-2xl shadow-soft border border-brand-border mb-4">
          <Image
            src="/logo.png"
            alt="BNSS Logo"
            fill
            className="object-contain p-1"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-heading">
          {EVENT_DETAILS.title}
        </h1>
        <p className="mt-1 text-sm text-brand-rust font-semibold">
          অ্যাডমিনিস্ট্রেটর পোর্টাল
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="bg-white p-8 rounded-3xl text-center text-brand-muted">লোড হচ্ছে...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
