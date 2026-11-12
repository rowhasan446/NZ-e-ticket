"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  X, 
  ExternalLink, 
  FileText, 
  CheckCircle, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Hash, 
  Calendar, 
  ShieldCheck,
  Download,
  Loader2 
} from "lucide-react";
import { getIdTypeLabel, formatBanglaDate, enToBnDigits } from "@/lib/bn";

export default function ViewDrawer({ isOpen, onClose, personId }) {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !personId) return;

    let isMounted = true;
    setLoading(true);
    setError("");

    fetch(`/api/admin/people/${personId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setPerson(data.person);
        } else {
          setError(data.error || "তথ্য লোড করা যায়নি");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError("নেটওয়ার্ক ত্রুটি");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, personId]);

  if (!isOpen) return null;

  const isDocPdf =
    person?.idDocument?.resourceType === "raw" ||
    person?.idDocument?.url?.toLowerCase().endsWith(".pdf") ||
    person?.idDocument?.previewUrl?.toLowerCase().includes(".pdf");

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="p-5 border-b border-brand-border/60 flex items-center justify-between bg-brand-cream/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-terracotta text-white flex items-center justify-center font-bold">
              #{person ? enToBnDigits(person.serial) : "—"}
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-heading">
                নিবন্ধনের পূর্ণাঙ্গ বিবরণ
              </h3>
              <p className="text-xs text-brand-muted font-mono">
                {person?.userId || "লোড হচ্ছে..."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-brand-muted hover:text-brand-dark rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-brand-muted">
              <Loader2 className="w-8 h-8 animate-spin text-brand-rust mb-2" />
              <span>তথ্য লোড হচ্ছে...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center">
              {error}
            </div>
          ) : person ? (
            <>
              {/* Photo & Quick Badge */}
              <div className="flex items-center gap-4 bg-brand-bg/40 p-4 rounded-2xl border border-brand-border/60">
                <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-brand-cream/50 border border-brand-border flex-shrink-0 flex items-center justify-center">
                  {person.photo?.url ? (
                    <Image
                      src={person.photo.url}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-brand-border" />
                  )}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xl text-brand-heading">
                    {person.name}
                  </h4>
                  <p className="text-sm text-brand-dark/80 mt-0.5">
                    {enToBnDigits(person.phone)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        person.checkedIn
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {person.checkedIn ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          চেক-ইন সম্পন্ন
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          চেক-ইন বাকি
                        </>
                      )}
                    </span>
                    {person.checkedInAt && (
                      <span className="text-xs text-brand-muted">
                        ({formatBanglaDate(person.checkedInAt)})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Data Details List */}
              <div className="space-y-3">
                <h5 className="font-serif font-bold text-base text-brand-heading border-b border-brand-border/60 pb-1.5">
                  ব্যক্তিগত ও যোগাযোগ তথ্য
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-xl border border-brand-border/60 shadow-xs">
                    <span className="text-xs text-brand-muted block">ইমেইল:</span>
                    <span className="font-medium text-brand-dark truncate block">{person.email}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-brand-border/60 shadow-xs">
                    <span className="text-xs text-brand-muted block">পরিচয়পত্রের ধরন:</span>
                    <span className="font-bold text-brand-rust block">{getIdTypeLabel(person.idType)}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-brand-border/60 shadow-xs sm:col-span-2">
                    <span className="text-xs text-brand-muted block">পরিচয়পত্র নম্বর:</span>
                    <span className="font-mono font-bold text-brand-heading text-base block">{person.idNumber}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-brand-border/60 shadow-xs sm:col-span-2">
                    <span className="text-xs text-brand-muted block">নিবন্ধনের সময়:</span>
                    <span className="font-medium text-brand-dark block">{formatBanglaDate(person.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Secure Document Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-brand-border/60 pb-1.5">
                  <h5 className="font-serif font-bold text-base text-brand-heading flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    সুরক্ষিত পরিচয়পত্র ফাইল
                  </h5>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    সাইনড ও এনক্রিপ্টেড লিঙ্ক
                  </span>
                </div>

                <div className="bg-brand-bg/40 p-4 rounded-2xl border border-brand-border/60">
                  {person.idDocument?.publicId || person.idDocument?.url ? (
                    <div className="space-y-3">
                      {isDocPdf ? (
                        <div className="space-y-3">
                          {/* Embedded Interactive PDF Viewer */}
                          <div className="relative w-full h-[460px] rounded-xl overflow-hidden border border-brand-border bg-white shadow-xs">
                            <iframe
                              src={`/api/admin/people/${person._id}/doc#toolbar=1`}
                              title="PDF ডকুমেন্ট প্রিভিউ"
                              className="w-full h-full border-0"
                            />
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                            <span className="text-brand-muted flex items-center gap-1.5 font-medium">
                              <FileText className="w-4 h-4 text-red-600" />
                              PDF পরিচয়পত্র ফাইল
                            </span>
                            <div className="flex items-center gap-2">
                              <a
                                href={`/api/admin/people/${person._id}/doc`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-brand-cream/80 hover:bg-brand-cream text-brand-dark px-3 py-1.5 rounded-lg border border-brand-border text-xs font-semibold transition-colors shadow-2xs"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                নতুন ট্যাবে খুলুন
                              </a>
                              <a
                                href={`/api/admin/people/${person._id}/doc?download=1`}
                                className="inline-flex items-center gap-1.5 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                              >
                                <Download className="w-3.5 h-3.5" />
                                ডাউনলোড
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="relative w-full h-72 rounded-xl overflow-hidden border border-brand-border bg-white shadow-xs">
                            <img
                              src={`/api/admin/people/${person._id}/doc`}
                              alt="পরিচয়পত্র ডকুমেন্ট"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-brand-muted font-medium">ছবি পরিচয়পত্র</span>
                            <a
                              href={`/api/admin/people/${person._id}/doc`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-bold text-brand-rust hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              আসল সাইজে দেখুন
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-brand-muted text-center py-4">কোনো ডকুমেন্ট ফাইল পাওয়া যায়নি</p>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

