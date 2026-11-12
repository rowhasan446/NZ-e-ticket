// Helpers for Bengali digit conversion, number formatting and labels

const EN_TO_BN_DIGITS = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

const BN_TO_EN_DIGITS = {
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",
};

/**
 * Convert any string containing Bengali digits to English digits
 */
export function bnToEnDigits(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/[০-৯]/g, (d) => BN_TO_EN_DIGITS[d] || d);
}

/**
 * Convert any string containing English digits to Bengali digits
 */
export function enToBnDigits(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/[0-9]/g, (d) => EN_TO_BN_DIGITS[d] || d);
}

/**
 * Clean phone or ID number: converts Bengali digits to English, trims whitespace and dashes
 */
export function sanitizeNumberInput(val) {
  if (!val) return "";
  return bnToEnDigits(val).replace(/[\s\-]/g, "").trim();
}

/**
 * Get Bengali label for ID Type
 */
export function getIdTypeLabel(type) {
  const map = {
    NID: "এনআইডি",
    PASSPORT: "পাসপোর্ট",
    BIRTH_CERTIFICATE: "জন্ম নিবন্ধন সনদ",
  };
  return map[type] || type;
}

/**
 * Format a Date to a friendly Bengali string (e.g. ১২ নভেম্বর ২০২৬, দুপুর ১২:৪৫)
 */
export function formatBanglaDate(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const months = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];

  const day = enToBnDigits(date.getDate());
  const month = months[date.getMonth()];
  const year = enToBnDigits(date.getFullYear());
  
  let hours = date.getHours();
  const minutes = enToBnDigits(String(date.getMinutes()).padStart(2, "0"));
  let period = "সকাল";
  if (hours >= 12 && hours < 16) {
    period = "দুপুর";
  } else if (hours >= 16 && hours < 19) {
    period = "বিকাল";
  } else if (hours >= 19 || hours < 5) {
    period = "রাত";
  }

  const displayHours = hours % 12 || 12;
  const hoursBn = enToBnDigits(displayHours);

  return `${day} ${month} ${year}, ${period} ${hoursBn}:${minutes}`;
}

