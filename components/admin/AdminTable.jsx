"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  FileText, 
  ExternalLink 
} from "lucide-react";
import { enToBnDigits, formatBanglaDate, getIdTypeLabel } from "@/lib/bn";

export default function AdminTable({
  people = [],
  pagination,
  onPageChange,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  idTypeFilter,
  onIdTypeFilterChange,
  onCheckInToggle,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-soft border border-brand-border/80 overflow-hidden">
      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-6 border-b border-brand-border/60 bg-brand-cream/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="নাম, ফোন, ইমেইল, আইডি বা পরিচয়পত্র নম্বর দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-xs sm:text-sm focus:border-brand-rust focus:outline-none focus:ring-2 focus:ring-brand-ring/30 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-brand-muted hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-white border border-brand-border rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-brand-dark focus:border-brand-rust focus:outline-none"
            >
              <option value="all">সব চেক-ইন স্ট্যাটাস</option>
              <option value="checkedIn">চেক-ইন সম্পন্ন</option>
              <option value="pending">চেক-ইন বাকি</option>
            </select>
          </div>

          {/* ID Type Filter */}
          <select
            value={idTypeFilter}
            onChange={(e) => onIdTypeFilterChange(e.target.value)}
            className="bg-white border border-brand-border rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-brand-dark focus:border-brand-rust focus:outline-none"
          >
            <option value="all">সকল পরিচয়পত্র</option>
            <option value="NID">এনআইডি</option>
            <option value="PASSPORT">পাসপোর্ট</option>
            <option value="BIRTH_CERTIFICATE">জন্ম নিবন্ধন সনদ</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-sm text-brand-dark">
          <thead className="bg-brand-cream/60 text-brand-heading font-serif font-bold text-xs uppercase tracking-wider border-b border-brand-border">
            <tr>
              <th className="py-3.5 px-4 text-center">ক্রমিক</th>
              <th className="py-3.5 px-4">ইউজার আইডি</th>
              <th className="py-3.5 px-4">ছবি</th>
              <th className="py-3.5 px-4">নাম</th>
              <th className="py-3.5 px-4">মোবাইল ও ইমেইল</th>
              <th className="py-3.5 px-4">পরিচয়পত্র</th>
              <th className="py-3.5 px-4">নিবন্ধনের সময়</th>
              <th className="py-3.5 px-4 text-center">চেক-ইন</th>
              <th className="py-3.5 px-4 text-center">পদক্ষেপ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/40 font-normal">
            {people.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-brand-muted font-medium">
                  কোনো নিবন্ধিত ব্যক্তি পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              people.map((person) => {
                const isCheckedIn = person.checkedIn;
                return (
                  <tr
                    key={person._id}
                    className={`transition-colors duration-150 ${
                      isCheckedIn
                        ? "bg-emerald-50/50 hover:bg-emerald-100/40"
                        : "hover:bg-brand-cream/20"
                    }`}
                  >
                    {/* Serial */}
                    <td className="py-3 px-4 text-center font-bold text-brand-heading">
                      #{enToBnDigits(person.serial)}
                    </td>

                    {/* User ID */}
                    <td className="py-3 px-4 font-mono font-bold text-xs text-brand-rust">
                      {person.userId}
                    </td>

                    {/* Photo thumbnail */}
                    <td className="py-3 px-4">
                      <div className="relative w-9 h-11 rounded-lg overflow-hidden bg-brand-cream/50 border border-brand-border/60 flex items-center justify-center">
                        {person.photo?.url ? (
                          <Image
                            src={person.photo.url}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-brand-muted" />
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4 font-semibold text-brand-dark">
                      {person.name}
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      <div className="text-xs font-semibold">{enToBnDigits(person.phone)}</div>
                      <div className="text-xs text-brand-muted truncate max-w-[150px]">{person.email}</div>
                    </td>

                    {/* ID Type + ID Number */}
                    <td className="py-3 px-4">
                      <span className="inline-block text-[11px] font-bold text-brand-terracotta bg-brand-cream/80 px-2 py-0.5 rounded-md border border-brand-border/40">
                        {getIdTypeLabel(person.idType)}
                      </span>
                      <div className="text-xs font-mono font-bold mt-0.5 text-brand-dark">
                        {person.idNumber}
                      </div>
                    </td>

                    {/* Registered At */}
                    <td className="py-3 px-4 text-xs text-brand-muted">
                      {formatBanglaDate(person.createdAt)}
                    </td>

                    {/* Check-in toggle button with optimistic UI */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onCheckInToggle(person._id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                          isCheckedIn
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-white hover:bg-amber-50 text-amber-900 border border-amber-300"
                        }`}
                      >
                        {isCheckedIn ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            সম্পন্ন
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            বাকি
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onView(person._id)}
                          className="p-1.5 text-brand-heading hover:bg-brand-cream rounded-lg transition-colors"
                          title="বিবরণ দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(person)}
                          className="p-1.5 text-brand-rust hover:bg-brand-cream rounded-lg transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(person)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards View */}
      <div className="lg:hidden p-4 space-y-4">
        {people.length === 0 ? (
          <div className="py-8 text-center text-brand-muted text-sm font-medium">
            কোনো নিবন্ধিত ব্যক্তি পাওয়া যায়নি।
          </div>
        ) : (
          people.map((person) => {
            const isCheckedIn = person.checkedIn;
            return (
              <div
                key={person._id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCheckedIn
                    ? "bg-emerald-50/60 border-emerald-300"
                    : "bg-white border-brand-border/80 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-brand-cream/50 border border-brand-border/60 flex items-center justify-center flex-shrink-0">
                      {person.photo?.url ? (
                        <Image
                          src={person.photo.url}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-brand-muted" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-brand-rust">
                        #{enToBnDigits(person.serial)} • {person.userId}
                      </span>
                      <h4 className="font-serif font-bold text-base text-brand-heading">
                        {person.name}
                      </h4>
                      <p className="text-xs text-brand-muted">{enToBnDigits(person.phone)}</p>
                    </div>
                  </div>

                  {/* Mobile Check-in Toggle */}
                  <button
                    onClick={() => onCheckInToggle(person._id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      isCheckedIn
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-amber-900 border border-amber-300"
                    }`}
                  >
                    {isCheckedIn ? "সম্পন্ন" : "বাকি"}
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-brand-border/40 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-brand-muted block">পরিচয়পত্র:</span>
                    <span className="font-bold text-brand-terracotta">
                      {getIdTypeLabel(person.idType)}
                    </span>
                    <span className="font-mono block text-brand-dark">{person.idNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-brand-muted block">নিবন্ধনের সময়:</span>
                    <span className="text-brand-dark block">
                      {formatBanglaDate(person.createdAt).split(",")[0]}
                    </span>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="mt-3 pt-3 border-t border-brand-border/40 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onView(person._id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-heading px-3 py-1.5 rounded-lg bg-brand-cream/60"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    বিবরণ
                  </button>
                  <button
                    onClick={() => onEdit(person)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-rust px-3 py-1.5 rounded-lg bg-brand-cream/60"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => onDelete(person)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 px-3 py-1.5 rounded-lg bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    মুছুন
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Bar */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-4 sm:p-5 border-t border-brand-border/60 bg-brand-cream/20 flex items-center justify-between">
          <p className="text-xs text-brand-muted font-medium">
            মোট {enToBnDigits(pagination.total)} জনের মধ্যে পৃষ্ঠা {enToBnDigits(pagination.page)} / {enToBnDigits(pagination.totalPages)}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-xl border border-brand-border bg-white disabled:opacity-50 text-brand-dark hover:bg-brand-cream/40 transition-colors"
              title="পূর্ববর্তী পৃষ্ঠা"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-xl border border-brand-border bg-white disabled:opacity-50 text-brand-dark hover:bg-brand-cream/40 transition-colors"
              title="পরবর্তী পৃষ্ঠা"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

