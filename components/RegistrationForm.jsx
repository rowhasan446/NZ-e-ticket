"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Send, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  Sparkles
} from "lucide-react";
import IdTypeSelector from "./IdTypeSelector";
import FileUpload from "./FileUpload";
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

export default function RegistrationForm() {
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    idType: "NID",
    idNumber: "",
    honeypot: "", // Bot prevention field (hidden)
  });

  const [idDocumentFile, setIdDocumentFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  // Validation & Submission states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const currentIdConfig = ID_TYPES[formData.idType] || ID_TYPES.NID;

  // Handle ID type change
  const handleIdTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      idType: newType,
    }));
    // Clear error on ID number when type switches
    if (errors.idNumber) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.idNumber;
        return updated;
      });
    }
  };

  // Handle field inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error on change
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    if (serverError) setServerError("");
  };

  // Client validation
  const validateForm = () => {
    const newErrors = {};

    const nameErr = validateName(formData.name);
    if (nameErr) newErrors.name = nameErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const idNumberErr = validateIdNumber(formData.idType, formData.idNumber);
    if (idNumberErr) newErrors.idNumber = idNumberErr;

    const docFileErr = validateDocumentFile(idDocumentFile, true);
    if (docFileErr) newErrors.idDocument = docFileErr;

    if (photoFile) {
      const photoErr = validatePhotoFile(photoFile);
      if (photoErr) newErrors.photo = photoErr;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Bot trap check
    if (formData.honeypot) {
      console.warn("Spam detected");
      return;
    }

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorKey);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

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
      data.append("honeypot", formData.honeypot);
      
      if (idDocumentFile) {
        data.append("idDocument", idDocumentFile);
      }
      if (photoFile) {
        data.append("photo", photoFile);
      }

      const res = await fetch("/api/register", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setServerError(result.error || "নিবন্ধন ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
        setIsSubmitting(false);
        return;
      }

      // Successful registration: redirect to printable registration card
      router.push(`/registration/${result.userId}`);
    } catch (err) {
      console.error("Submission error:", err);
      setServerError("নেটওয়ার্ক বা সার্ভারে ত্রুটি হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।");
      setIsSubmitting(false);
    }
  };

  return (
    <section id="register" className="py-16 md:py-20 px-4 sm:px-8 relative z-10 scroll-mt-14">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 md:p-12 shadow-elevated border border-brand-border/80">
          {/* Header */}
          <div className="text-center space-y-3 mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wider text-brand-rust uppercase bg-brand-cream/80 px-3.5 py-1 rounded-full border border-brand-border/40">
              <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
              বিনামূল্যে অংশগ্রহণ
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-brand-heading tracking-tight">
              উৎসবে অংশগ্রহণের নিবন্ধন
            </h2>
            <p className="text-sm sm:text-base text-brand-dark/80">
              সঠিক তথ্য প্রদান করে আপনার নিবন্ধন স্লিপ সংগ্রহ করুন
            </p>
            <div className="w-16 h-1 bg-brand-terracotta mx-auto rounded-full" />
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
              <div className="text-sm font-medium">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field (hidden from view) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="honeypot"
                tabIndex="-1"
                autoComplete="off"
                value={formData.honeypot}
                onChange={handleChange}
              />
            </div>

            {/* 1. Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm sm:text-base font-bold text-brand-heading">
                পূর্ণ নাম <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="আপনার পুরো নাম লিখুন"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl border text-brand-dark placeholder:text-brand-muted/60 bg-white transition-all duration-200 focus:outline-none focus:ring-3 ${
                    errors.name
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-brand-border focus:border-brand-rust focus:ring-brand-ring/30"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs sm:text-sm font-medium text-red-600 mt-1">
                  • {errors.name}
                </p>
              )}
            </div>

            {/* 2. Phone & Email in a 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-sm sm:text-base font-bold text-brand-heading">
                  মোবাইল নম্বর <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl border text-brand-dark placeholder:text-brand-muted/60 bg-white transition-all duration-200 focus:outline-none focus:ring-3 ${
                      errors.phone
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-brand-border focus:border-brand-rust focus:ring-brand-ring/30"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs sm:text-sm font-medium text-red-600 mt-1">
                    • {errors.phone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm sm:text-base font-bold text-brand-heading">
                  ইমেইল ঠিকানা <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl border text-brand-dark placeholder:text-brand-muted/60 bg-white transition-all duration-200 focus:outline-none focus:ring-3 ${
                      errors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-brand-border focus:border-brand-rust focus:ring-brand-ring/30"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs sm:text-sm font-medium text-red-600 mt-1">
                    • {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* 3. Document Type Selector */}
            <div className="pt-2">
              <IdTypeSelector
                value={formData.idType}
                onChange={handleIdTypeChange}
              />
            </div>

            {/* 4. ID Number (Dynamic per type) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="idNumber" className="block text-sm sm:text-base font-bold text-brand-heading">
                  {currentIdConfig.numberLabelBn} <span className="text-red-600">*</span>
                </label>
                <span className="text-xs text-brand-muted hidden sm:inline">
                  {currentIdConfig.helperBn}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted">
                  <CreditCard className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  placeholder={currentIdConfig.placeholderBn}
                  value={formData.idNumber}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl border text-brand-dark placeholder:text-brand-muted/60 bg-white transition-all duration-200 focus:outline-none focus:ring-3 uppercase ${
                    errors.idNumber
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-brand-border focus:border-brand-rust focus:ring-brand-ring/30"
                  }`}
                />
              </div>
              {errors.idNumber && (
                <p className="text-xs sm:text-sm font-medium text-red-600 mt-1">
                  • {errors.idNumber}
                </p>
              )}
            </div>

            {/* 5. Document File Upload */}
            <FileUpload
              label={currentIdConfig.docLabelBn}
              required={true}
              helperText="সর্বোচ্চ ৫ মেগাবাইট (JPG, PNG বা PDF)"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              maxSizeMB={5}
              file={idDocumentFile}
              onChange={setIdDocumentFile}
              error={errors.idDocument}
            />

            {/* 6. User Portrait Photo (Optional) */}
            <FileUpload
              label="আপনার সাম্প্রতিক পাসপোর্ট সাইজ ছবি"
              required={false}
              helperText="সর্বোচ্চ ৩ মেগাবাইট (JPG বা PNG)"
              accept="image/jpeg,image/png,image/jpg"
              maxSizeMB={3}
              file={photoFile}
              onChange={setPhotoFile}
              error={errors.photo}
            />

            {/* Security and Consent Notice */}
            <div className="p-4 rounded-xl bg-brand-cream/50 border border-brand-border/60 text-xs text-brand-muted leading-relaxed">
              <p>
                🔒 আপনার সকল ব্যক্তিগত তথ্য ও পরিচয়পত্র সম্পূর্ণ সুরক্ষিত রাখা হবে। এই তথ্য শুধুমাত্র নজরুল উৎসব ২০২৬-এ আপনার প্রবেশ যাচাইয়ের উদ্দেশ্যে সংরক্ষিত থাকবে।
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-elevated transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-ring/40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>নিবন্ধন যাচাই ও সম্পন্ন হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>নিবন্ধন সম্পন্ন করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

