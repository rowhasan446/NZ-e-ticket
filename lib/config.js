// Core application configuration and constants

export const USER_ID_PREFIX = "NZ2026";

export const EVENT_DETAILS = {
  title: "নজরুল উৎসব ২০২৬",
  theme: "চির উন্নত মম শির",
  dates: "২৭ ও ২৮ নভেম্বর ২০২৬",
  datesShort: "২৭ ও ২৮ নভেম্বর",
  organizer: "বাংলাদেশ নজরুল সংগীত সংস্থা",
  venue: "গুলশান সোসাইটি লেক পার্ক, ঢাকা",
  email: "info@bnssbd.org",
  phone: "+880 1711-000000",
  website: "bnssbd.org",
  copyright: "© ২০২৬ বাংলাদেশ নজরুল সংগীত সংস্থা। সর্বস্বত্ব সংরক্ষিত।"
};

export const WATERMARK_CONFIG = {
  src: "/watermark/nazrul-sketch.png",
  opacity: 0.07, // 7% opacity (5-8% range as specified)
  position: "fixed",
  maxWidth: "720px",
  mixBlendMode: "multiply",
};

export const ID_TYPES = {
  NID: {
    code: "NID",
    labelBn: "এনআইডি",
    numberLabelBn: "এনআইডি নম্বর",
    docLabelBn: "এনআইডি কার্ডের ছবি বা PDF",
    placeholderBn: "১০, ১৩ বা ১৭ ডিজিটের এনআইডি নম্বর লিখুন",
    helperBn: "১০ ডিজিট (স্মার্ট কার্ড), ১৩ ডিজিট বা ১৭ ডিজিট গ্রহণযোগ্য",
  },
  PASSPORT: {
    code: "PASSPORT",
    labelBn: "পাসপোর্ট",
    numberLabelBn: "পাসপোর্ট নম্বর",
    docLabelBn: "পাসপোর্টের ছবি বা PDF",
    placeholderBn: "পাসপোর্ট নম্বর লিখুন (উদা: A12345678)",
    helperBn: "৬ থেকে ১২ অক্ষরের বৈধ পাসপোর্ট নম্বর (অ্যালফানিউমেরিক)",
  },
  BIRTH_CERTIFICATE: {
    code: "BIRTH_CERTIFICATE",
    labelBn: "জন্ম নিবন্ধন সনদ",
    numberLabelBn: "জন্ম নিবন্ধন নম্বর",
    docLabelBn: "জন্ম নিবন্ধন সনদের ছবি বা PDF",
    placeholderBn: "১৭ ডিজিটের জন্ম নিবন্ধন নম্বর লিখুন",
    helperBn: "১৭ ডিজিটের ডিজিটাল জন্ম নিবন্ধন নম্বর",
  },
};

