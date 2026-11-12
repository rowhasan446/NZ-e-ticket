"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Save, UserPlus, AlertCircle } from "lucide-react";
import IdTypeSelector from "../IdTypeSelector";
import FileUpload from "../FileUpload";
import { ID_TYPES } from "@/lib/config";
import { 
  validateName, 
  validatePhone, 
  validateEmail, 
  validateIdNumber, 
  validateDocumentFile, 
  validatePhotoFile 
} from "@/lib/validators";
import { bnToEnDigits } from "@/lib/bn";

export default function PersonModal({ isOpen, onClose, person, onSaved }) {
  const isEditing = Boolean(person?._id);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    idType: "NID",
    idNumber: "",
  });

  const [idDocumentFile, setIdDocumentFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name || "",
        phone: person.phone || "",
        email: person.email || "",
        idType: person.idType || "NID",
        idNumber: person.idNumber || "",
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        idType: "NID",
        idNumber: "",
      });
    }
    setIdDocumentFile(null);
    setPhotoFile(null);
    setErrors({});
    setServerError("");
  }, [person, isOpen]);

  if (!isOpen) return null;

  const currentIdConfig = ID_TYPES[formData.idType] || ID_TYPES.NID;

  const handleIdTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, idType: type }));
    if (errors.idNumber) {
      setErrors((prev) => {
        const up = { ...prev };
        delete up.idNumber;
        return up;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const up = { ...prev };
        delete up[name];
        return up;
      });
    }
    if (serverError) setServerError("");
  };

  const validate = () => {
    const errs = {};
    const nameErr = validateName(formData.name);
    if (nameErr) errs.name = nameErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) errs.phone = phoneErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) errs.email = emailErr;

    const idNumberErr = validateIdNumber(formData.idType, formData.idNumber);
    if (idNumberErr) errs.idNumber = idNumberErr;

    // Document is required when creating, optional when editing unless replacing
    if (!isEditing) {
      const docErr = validateDocumentFile(idDocumentFile, true);
      if (docErr) errs.idDocument = docErr;
    } else if (idDocumentFile) {
      const docErr = validateDocumentFile(idDocumentFile, false);
      if (docErr) errs.idDocument = docErr;
    }

    if (photoFile) {
      const photoErr = validatePhotoFile(photoFile);
      if (photoErr) errs.photo = photoErr;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("phone", bnToEnDigits(formData.phone).replace(/[\s\-]/g, "").trim());
      data.append("email", formData.email.trim().toLowerCase());
      data.append("idType", formData.idType);
      data.append(
        "idNumber", 
        formData.idType === "PASSPORT"
          ? bnToEnDigits(formData.idNumber).replace(/[\s\-]/g, "").trim().toUpperCase()
          : bnToEnDigits(formData.idNumber).replace(/[\s\-]/g, "").trim()
      );

      if (idDocumentFile) data.append("idDocument", idDocumentFile);
      if (photoFile) data.append("photo", photoFile);

      const url = isEditing
        ? `/api/admin/people/${person._id}`
        : "/api/admin/people";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, { method, body: data });
      const result = await res.json();

      if (!res.ok || !result.success) {
        setServerError(result.error || "সংরক্ষণ করতে সমস্যা হয়েছে।");
        setLoading(false);
        return;
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Save person error:", err);
      setServerError("নেটওয়ার্ক বা সার্ভার ত্রুটি। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-elevated border border-brand-border relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cream text-brand-rust flex items-center justify-center">
              {isEditing ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-brand-heading">
                {isEditing ? "নিবন্ধন তথ্য সম্পাদনা" : "নতুন ব্যক্তি নিবন্ধন"}
              </h3>
              {isEditing && (
                <p className="text-xs text-brand-muted font-mono">
                  আইডি: {person.userId} (অপরিবর্তনযোগ্য)
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-brand-muted hover:text-brand-dark rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-brand-heading mb-1">
              পূর্ণ নাম <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ব্যক্তির পূর্ণ নাম"
              className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-rust focus:outline-none focus:ring-2 focus:ring-brand-ring/30"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">• {errors.name}</p>}
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-brand-heading mb-1">
                মোবাইল নম্বর <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="017XXXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-rust focus:outline-none focus:ring-2 focus:ring-brand-ring/30"
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">• {errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-brand-heading mb-1">
                ইমেইল ঠিকানা <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-rust focus:outline-none focus:ring-2 focus:ring-brand-ring/30"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">• {errors.email}</p>}
            </div>
          </div>

          {/* ID Type Selector */}
          <IdTypeSelector
            value={formData.idType}
            onChange={handleIdTypeChange}
          />

          {/* ID Number */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-brand-heading mb-1">
              {currentIdConfig.numberLabelBn} <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder={currentIdConfig.placeholderBn}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-sm uppercase focus:border-brand-rust focus:outline-none focus:ring-2 focus:ring-brand-ring/30"
            />
            {errors.idNumber && <p className="text-xs text-red-600 mt-1">• {errors.idNumber}</p>}
          </div>

          {/* ID Document File */}
          <FileUpload
            label={isEditing ? `${currentIdConfig.docLabelBn} (পরিবর্তন করতে চাইলে)` : currentIdConfig.docLabelBn}
            required={!isEditing}
            helperText="JPG, PNG বা PDF (সর্বোচ্চ ৫ MB)"
            file={idDocumentFile}
            onChange={setIdDocumentFile}
            error={errors.idDocument}
          />

          {/* User Photo */}
          <FileUpload
            label={isEditing ? "ছবি (পরিবর্তন করতে চাইলে)" : "ব্যক্তির পাসপোর্ট ছবি"}
            required={false}
            accept="image/jpeg,image/png,image/jpg"
            maxSizeMB={3}
            file={photoFile}
            onChange={setPhotoFile}
            error={errors.photo}
          />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-brand-border text-sm font-semibold text-brand-muted hover:bg-brand-cream/30"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:opacity-75 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? "হালনাগাদ করুন" : "নিবন্ধন সংরক্ষণ করুন"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

