"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, FileText, X, CheckCircle2, Image as ImageIcon } from "lucide-react";

export default function FileUpload({
  label,
  required = false,
  helperText,
  accept = "image/jpeg,image/png,application/pdf",
  maxSizeMB = 5,
  file,
  onChange,
  error,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isPdf = file?.type === "application/pdf" || file?.name?.toLowerCase().endsWith(".pdf");
  const isImage = file?.type?.startsWith("image/");
  const previewUrl = file && isImage ? URL.createObjectURL(file) : null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm sm:text-base font-bold text-brand-heading">
          {label} {required ? <span className="text-red-600">*</span> : <span className="text-xs font-normal text-brand-muted">(ঐচ্ছিক)</span>}
        </label>
        {helperText && (
          <span className="text-xs text-brand-muted hidden sm:inline">{helperText}</span>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-brand-terracotta bg-brand-cream/60"
            : error
            ? "border-red-400 bg-red-50/60"
            : file
            ? "border-emerald-400 bg-emerald-50/40"
            : "border-brand-border hover:border-brand-rust/60 bg-white/70 hover:bg-brand-cream/20"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-brand-border/60 shadow-xs">
            <div className="flex items-center gap-3 overflow-hidden">
              {isImage && previewUrl ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-brand-border flex-shrink-0">
                  <Image
                    src={previewUrl}
                    alt="প্রিভিউ"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
              )}

              <div className="text-left truncate">
                <p className="text-sm font-semibold text-brand-dark truncate">
                  {file.name}
                </p>
                <p className="text-xs text-brand-muted">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • আপলোড প্রস্তুত
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-brand-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="মুছে ফেলুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2 py-2">
            <div className="w-12 h-12 rounded-full bg-brand-cream/80 text-brand-rust flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-heading">
                ফাইল নির্বাচন করতে ক্লিক করুন বা ড্র্যাগ করে আনুন
              </p>
              <p className="text-xs text-brand-muted mt-1">
                {accept.includes("pdf") ? "JPG, PNG অথবা PDF ফাইল" : "JPG অথবা PNG ছবি"} (সর্বোচ্চ {maxSizeMB} MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs sm:text-sm font-medium text-red-600 mt-1 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
}

