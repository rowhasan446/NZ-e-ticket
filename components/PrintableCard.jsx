"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Printer, 
  Download, 
  CheckCircle, 
  ArrowLeft, 
  ShieldAlert, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Hash, 
  Loader2 
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { EVENT_DETAILS } from "@/lib/config";
import { enToBnDigits, formatBanglaDate, getIdTypeLabel } from "@/lib/bn";

export default function PrintableCard({ person }) {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      // Use html2canvas with forced desktop width to guarantee identical layout
      const element = cardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5, // High resolution for crisp Bengali text
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF",
        windowWidth: 1024,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`নজরুল_উৎসব_নিবন্ধন_${person.userId}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("PDF তৈরিতে সাময়িক ত্রুটি হয়েছে। আপনি 'প্রিন্ট' অপশন থেকে 'Save as PDF' নির্বাচন করতে পারেন।");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top action and back navigation (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/90 p-4 sm:p-5 rounded-2xl shadow-soft border border-brand-border">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-heading hover:text-brand-terracotta transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          মূল পাতায় ফিরে যান
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-brand-dark hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-brand-cream" />
            প্রিন্ট করুন
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:opacity-75 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                PDF তৈরি হচ্ছে...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                PDF ডাউনলোড
              </>
            )}
          </button>
        </div>
      </div>

      {/* Printable Slip Card (A4 Aspect Ratio friendly) */}
      <div
        ref={cardRef}
        className="print-area bg-white text-brand-dark rounded-3xl p-8 sm:p-12 shadow-elevated border-2 border-brand-border relative overflow-hidden"
      >
        {/* Subtle Watermark seal */}
        <div className="absolute right-6 bottom-6 opacity-5 pointer-events-none select-none">
          <Image
            src="/logo.png"
            alt=""
            width={320}
            height={320}
            className="object-contain"
          />
        </div>

        {/* Header Section */}
        <div className="border-b-2 border-brand-rust/30 pb-6 mb-6">
          <div className="print-row flex flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-brand-cream/60 p-1.5 rounded-2xl border border-brand-border flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="BNSS Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-brand-heading">
                  {EVENT_DETAILS.organizer}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-brand-rust tracking-wide uppercase">
                  Bangladesh Nazrul Sangeet Sangstha
                </p>
                <p className="text-xs text-brand-muted mt-0.5">
                  {EVENT_DETAILS.venue}
                </p>
              </div>
            </div>

            {/* Official Registration Slip Badge */}
            <div className="bg-brand-cream/80 border border-brand-rust/40 rounded-2xl px-5 py-2.5 text-center flex-shrink-0">
              <span className="block text-xs font-semibold text-brand-rust uppercase tracking-wider">
                অফিসিয়াল কপি
              </span>
              <span className="block text-sm sm:text-base font-serif font-bold text-brand-heading">
                নিবন্ধন তথ্য স্লিপ
              </span>
            </div>
          </div>
        </div>

        {/* Title & Theme Banner */}
        <div className="text-center bg-brand-bg/60 border border-brand-border/60 rounded-2xl p-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-heading">
            {EVENT_DETAILS.title}
          </h1>
          <p className="text-sm font-serif italic text-brand-rust font-bold mt-1">
            প্রতিপাদ্য: ''{EVENT_DETAILS.theme}''
          </p>
          <p className="text-xs font-medium text-brand-muted mt-1">
            তারিখ: {EVENT_DETAILS.dates} | স্থান: {EVENT_DETAILS.venue}
          </p>
        </div>

        {/* Primary Identifier Box (Prominent User ID & Serial) */}
        <div className="print-grid-2 grid grid-cols-2 gap-4 bg-brand-dark text-white rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-cream">
              <Hash className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs text-brand-cream/80 font-medium">
                নিবন্ধন শনাক্তকারী আইডি (User ID)
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-brand-cream">
                {person.userId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 border-l border-white/20 pl-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-cream">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs text-brand-cream/80 font-medium">
                ক্রমিক নম্বর (Serial No)
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-black text-white">
                #{enToBnDigits(person.serial)}
              </span>
            </div>
          </div>
        </div>

        {/* Registrant Details Grid & Photo */}
        <div className="print-details-container flex flex-row gap-6 mb-8 items-start">
          {/* Details Table */}
          <div className="flex-1 space-y-3">
            <h3 className="font-serif font-bold text-lg text-brand-heading border-b border-brand-border/60 pb-2">
              নিবন্ধিত ব্যক্তির বিবরণ
            </h3>

            <div className="print-grid-2 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-brand-bg/40 p-3 rounded-xl border border-brand-border/40">
                <span className="text-xs text-brand-muted block">পূর্ণ নাম:</span>
                <span className="font-bold text-brand-dark text-base">{person.name}</span>
              </div>

              <div className="bg-brand-bg/40 p-3 rounded-xl border border-brand-border/40">
                <span className="text-xs text-brand-muted block">মোবাইল নম্বর:</span>
                <span className="font-bold text-brand-dark text-base">{enToBnDigits(person.phone)}</span>
              </div>

              <div className="bg-brand-bg/40 p-3 rounded-xl border border-brand-border/40">
                <span className="text-xs text-brand-muted block">ইমেইল ঠিকানা:</span>
                <span className="font-bold text-brand-dark truncate block">{person.email}</span>
              </div>

              <div className="bg-brand-bg/40 p-3 rounded-xl border border-brand-border/40">
                <span className="text-xs text-brand-muted block">পরিচয়পত্রের ধরন:</span>
                <span className="font-bold text-brand-rust text-base">
                  {getIdTypeLabel(person.idType)}
                </span>
              </div>

              <div className="print-col-span-2 col-span-2 bg-brand-bg/40 p-3 rounded-xl border border-brand-border/40">
                <span className="text-xs text-brand-muted block">পরিচয়পত্র নম্বর:</span>
                <span className="font-mono font-bold text-brand-dark text-base tracking-wide">
                  {person.idNumber}
                </span>
              </div>

              <div className="print-col-span-2 col-span-2 bg-brand-bg/40 p-3 rounded-xl border border-brand-border/40">
                <span className="text-xs text-brand-muted block">নিবন্ধনের তারিখ ও সময়:</span>
                <span className="font-medium text-brand-dark">
                  {formatBanglaDate(person.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* User Photo (if provided) */}
          <div className="flex flex-col items-center justify-start text-center flex-shrink-0">
            <span className="text-xs font-semibold text-brand-muted mb-2">নিবন্ধকের ছবি</span>
            <div className="print-photo-box relative w-36 h-44 rounded-2xl overflow-hidden border-2 border-brand-border bg-brand-cream/30 shadow-sm flex items-center justify-center">
              {person.photo?.url ? (
                <Image
                  src={person.photo.url}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-brand-muted p-4">
                  <User className="w-12 h-12 text-brand-border" />
                  <span className="text-xs mt-2 font-medium">ছবি সংযুক্ত নেই</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prominent Mandatory Note Requirement: "এটি ই-টিকিট নয়। ই-টিকিট পরে সরবরাহ করা হবে।" */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 text-amber-900 mb-8">
          <ShieldAlert className="w-6 h-6 text-amber-700 flex-shrink-0" />
          <div>
            <p className="font-serif font-bold text-base sm:text-lg">
              বিশেষ দ্রষ্টব্য: এটি ই-টিকিট নয়। ই-টিকিট পরে সরবরাহ করা হবে।
            </p>
            <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
              উৎসবে প্রবেশের নির্দিষ্ট সময়সূচী ও প্রবেশপত্র (ই-টিকিট) প্রদানের তথ্য আপনার নিবন্ধিত মোবাইল নম্বর ও ইমেইলে প্রেরণ করা হবে।
            </p>
          </div>
        </div>

        {/* Footer of the Printable Card */}
        <div className="print-row border-t border-brand-border/60 pt-4 flex flex-row items-center justify-between text-xs text-brand-muted gap-2 text-left">
          <span>{EVENT_DETAILS.copyright}</span>
          <span>উৎসব সংক্রান্ত যেকোনো তথ্যের জন্য: {EVENT_DETAILS.phone}</span>
        </div>
      </div>
    </div>
  );
}

