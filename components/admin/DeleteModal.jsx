"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, person, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !person) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/people/${person._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "মুছে ফেলতে সমস্যা হয়েছে।");
        setLoading(false);
        return;
      }

      onDeleted();
      onClose();
    } catch (err) {
      setError("নেটওয়ার্ক সমস্যা হয়েছে।");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-brand-border text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="font-serif font-bold text-xl text-brand-heading">
          নিবন্ধন মুছে ফেলার নিশ্চয়তা
        </h3>

        <p className="text-sm text-brand-dark/80 leading-relaxed">
          আপনি কি নিশ্চিত যে আপনি <span className="font-bold text-brand-dark">'{person.name}'</span> (আইডি: {person.userId}) এর নিবন্ধন স্থায়ীভাবে মুছে ফেলতে চান? ক্লাউডিনারি থেকে এর সকল ফাইলও মুছে যাবে।
        </p>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl">• {error}</p>
        )}

        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-brand-border text-sm font-semibold text-brand-muted hover:bg-brand-cream/30"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-75 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                মুছে ফেলা হচ্ছে...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                হ্যাঁ, মুছে ফেলুন
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

