import { sanitizeNumberInput, bnToEnDigits } from "./bn";

/**
 * Validate Person's full name (2 to 80 chars)
 */
export function validateName(name) {
  if (!name || typeof name !== "string") {
    return "অনুগ্রহ করে আপনার পুরো নাম লিখুন";
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return "নাম কমপক্ষে ২ অক্ষরের হতে হবে";
  }
  if (trimmed.length > 80) {
    return "নাম সর্বোচ্চ ৮০ অক্ষরের মধ্যে হতে হবে";
  }
  return null;
}

/**
 * Validate Bangladesh phone number (01XXXXXXXXX - 11 digits starting with 01)
 */
export function validatePhone(phone) {
  if (!phone) {
    return "অনুগ্রহ করে সচল মোবাইল নম্বর লিখুন";
  }
  const clean = sanitizeNumberInput(phone);
  const bdPhoneRegex = /^01[3-9]\d{8}$/;
  if (!bdPhoneRegex.test(clean)) {
    return "সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)";
  }
  return null;
}

/**
 * Validate Email address
 */
export function validateEmail(email) {
  if (!email) {
    return "অনুগ্রহ করে আপনার ইমেইল ঠিকানা লিখুন";
  }
  const trimmed = String(email).trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return "একটি সঠিক ইমেইল ঠিকানা লিখুন (যেমন: example@mail.com)";
  }
  return null;
}

/**
 * Validate ID Type & Number
 */
export function validateIdNumber(idType, idNumber) {
  if (!idNumber) {
    return "পরিচয়পত্র নম্বর লেখা আবশ্যক";
  }

  const cleanNum = sanitizeNumberInput(idNumber);

  if (idType === "NID") {
    // 10, 13 or 17 digits
    const nidRegex = /^(\d{10}|\d{13}|\d{17})$/;
    if (!nidRegex.test(cleanNum)) {
      return "এনআইডি নম্বর ১০, ১৩ বা ১৭ ডিজিটের হতে হবে";
    }
  } else if (idType === "PASSPORT") {
    // 6 to 12 alphanumeric
    const passportClean = bnToEnDigits(idNumber).replace(/[\s\-]/g, "").toUpperCase();
    const passportRegex = /^[A-Z0-9]{6,12}$/;
    if (!passportRegex.test(passportClean)) {
      return "পাসপোর্ট নম্বর ৬ থেকে ১২ অক্ষরের অ্যালফানিউমেরিক হতে হবে";
    }
  } else if (idType === "BIRTH_CERTIFICATE") {
    // 17 digits
    const bcRegex = /^\d{17}$/;
    if (!bcRegex.test(cleanNum)) {
      return "জন্ম নিবন্ধন নম্বর ঠিক ১৭ ডিজিটের হতে হবে";
    }
  } else {
    return "অনুগ্রহ করে একটি সঠিক পরিচয়পত্রের ধরন নির্বাচন করুন";
  }

  return null;
}

/**
 * Validate document file (client or server)
 */
export function validateDocumentFile(file, isRequired = true) {
  if (!file) {
    return isRequired ? "পরিচয়পত্রের ছবি বা PDF আপলোড করা আবশ্যক" : null;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.type)) {
    return "পরিচয়পত্র ফাইলটি অবশ্যই JPG, PNG অথবা PDF ফরম্যাটে হতে হবে";
  }

  // Max 5 MB
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return "পরিচয়পত্রের ফাইলের আকার সর্বোচ্চ ৫ মেগাবাইট (5 MB) হতে পারে";
  }

  return null;
}

/**
 * Validate user portrait photo (optional, max 3 MB, JPG/PNG)
 */
export function validatePhotoFile(file) {
  if (!file) return null;

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  if (!allowedTypes.includes(file.type)) {
    return "ছবি অবশ্যই JPG অথবা PNG ফরম্যাটে হতে হবে";
  }

  // Max 3 MB
  const maxSize = 3 * 1024 * 1024;
  if (file.size > maxSize) {
    return "ছবির আকার সর্বোচ্চ ৩ মেগাবাইট (3 MB) হতে পারে";
  }

  return null;
}

