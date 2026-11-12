# নজরুল উৎসব ২০২৬ — ইভেন্ট রেজিস্ট্রেশন প্ল্যাটফর্ম
### Event Registration System for Bangladesh Nazrul Sangeet Sangstha (BNSS)

বাংলাদেশ নজরুল সংগীত সংস্থা (BNSS) আয়োজিত দুই দিনব্যাপী 'নজরুল উৎসব ২০২৬'-এর একক ইভেন্ট রেজিস্ট্রেশন এবং অ্যাডমিন ম্যানেজমেন্ট ওয়েবসাইট। সম্পূর্ণ সিস্টেমের ইউজার ইন্টারফেস, অ্যাডমিন ড্যাশবোর্ড, ভ্যালিডেশন বার্তা এবং প্রিন্টযোগ্য কপি প্রমিত বাংলায় তৈরি।

---

## ১. প্রযুক্তি ও ফিচারসমূহ (Tech Stack & Features)
- **ফ্রেমওয়ার্ক:** Next.js (App Router, `.jsx` ফরম্যাট)
- **স্টাইলিং:** Tailwind CSS (BNSS অফিশিয়াল কালার প্যালেট)
- **ডাটাবেস:** MongoDB Atlas with Mongoose
- **ফাইল স্টোরেজ:** Cloudinary (সংবেদনশীল পরিচয়পত্র সুরক্ষিত authenticated মোডে সংরক্ষিত)
- **অথেনটিকেশন:** `jose` লাইব্রেরি দিয়ে সিকিউর httpOnly Signed JWT সেশন
- **পিডিএফ ও প্রিন্ট:** `html2canvas` ও `jspdf` দিয়ে হাই-রেজোলিউশন বাংলা পিডিএফ ডাউনলোড এবং নেটিভ A4 প্রিন্ট সাপোর্ট
- **ফন্ট:** Google Fonts (`Hind Siliguri` বডির জন্য এবং `Noto Serif Bengali` শিরোনামের জন্য)
- **সুরক্ষা:** Honeypot ফিল্ড, আইপি রেট লিমিটিং, পারমাণবিক কাউন্টার দিয়ে ইউনিক `NZ2026-XXXX` সিরিয়াল ইউজার আইডি জেনারেশন।

---

## ২. সেটআপ ও লোকাল রান (Setup & Local Execution)

### পূর্বশর্ত:
- Node.js (v18.17+ বা v20+)
- MongoDB Atlas সংযোগ স্ট্রিং
- Cloudinary ফ্রি অ্যাকাউন্ট (Cloud Name, API Key, API Secret)

### ধাপসমূহ:

1. **ডিপেনডেন্সি ইনস্টল করুন:**
   ```bash
   npm install
   ```

2. **এনভায়রনমেন্ট ভেরিয়েবল সেটআপ করুন:**
   `.env.example` থেকে কপি করে `.env.local` ফাইল তৈরি করুন:
   ```bash
   cp .env.example .env.local
   ```
   এরপর `.env.local` ফাইলে আপনার আসল ক্রেডেনশিয়াল বসান:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/nazrul_utsav_2026?retryWrites=true&w=majority
   ADMIN_ID=admin
   ADMIN_PASSWORD=your_secure_password_here
   JWT_SECRET=your_jwt_secret_token_here_at_least_32_characters
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **ডেভেলপমেন্ট সার্ভার চালু করুন:**
   ```bash
   npm run dev
   ```
   ব্রাউজারে খুলুন: `http://localhost:3000`

---

## ৩. রুট এবং পেজসমূহ (Pages & Routes)

| রুট | বিবরণ | অ্যাক্সেস |
|---|---|---|
| `/` | মূল ল্যান্ডিং পেজ, উৎসব পরিচিতি, সূচী, নিয়মাবলি এবং রেজিস্ট্রেশন ফর্ম | উন্মুক্ত (Public) |
| `/registration/[userId]` | প্রিন্টযোগ্য ও ডাউনলোডযোগ্য অফিসিয়াল রেজিস্ট্রেশন কপি | সাইনড টোকেন বা অ্যাডমিন সেশন দ্বারা সুরক্ষিত |
| `/admin/login` | অ্যাডমিন লগইন পোর্টাল | উন্মুক্ত (ব্রুট-ফোর্স রেট লিমিটেড) |
| `/admin` | সম্পূর্ণ অ্যাডমিন ড্যাশবোর্ড (সার্চ, ফিল্টার, ইনস্ট্যান্ট চেক-ইন, এডিট, এক্সেল CSV এক্সপোর্ট) | শুধুমাত্র অথেনটিকেটেড অ্যাডমিন |

---

## ৪. কাস্টমাইজেশন নির্দেশিকা (Customization Guide)

### ক. অনুষ্ঠান সূচী পরিবর্তন (`/data/schedule.js`)
সূচীর দিন, সময়, নাম বা বর্ণনা পরিবর্তন করার জন্য কোনো কম্পোনেন্ট কোড পরিবর্তন করতে হবে না। শুধুমাত্র `/data/schedule.js` ফাইলটি এডিট করলেই হবে:
```javascript
export const schedule = [
  {
    day: "প্রথম দিন",
    date: "২৭ নভেম্বর ২০২৬",
    items: [
      { time: "বিকাল ৪:০০", title: "উদ্বোধনী অনুষ্ঠান", description: "বিবরণ..." },
    ],
  },
  // ...
];
```

### খ. ইউজার আইডি প্রিফিক্স পরিবর্তন (`/lib/config.js`)
আইডির প্রিফিক্স ডিফল্টভাবে `"NZ2026"` রাখা আছে। এটি পরিবর্তন করতে `/lib/config.js` ফাইলের `USER_ID_PREFIX` পরিবর্তন করুন:
```javascript
export const USER_ID_PREFIX = "NZ2026";
```

### গ. ব্যাকগ্রাউন্ড নজরুল স্কেচ ওয়াটারমার্ক পরিবর্তন
- ওয়াটারমার্ক ফাইলের অবস্থান: `/public/watermark/nazrul-sketch.png`
- ফাইলটি রিপ্লেস করলেই স্বয়ংক্রিয়ভাবে পুরো সাইটে নতুন ছবি কার্যকর হবে।
- ওয়াটারমার্কের অপাসিটি এবং পজিশন পরিবর্তন করতে চাইলে `/lib/config.js` এর `WATERMARK_CONFIG` এডিট করুন:
```javascript
export const WATERMARK_CONFIG = {
  src: "/watermark/nazrul-sketch.png",
  opacity: 0.07, // ৫% থেকে ৮% অপাসিটি
  position: "fixed",
  maxWidth: "720px",
  mixBlendMode: "multiply",
};
```

### ঘ. লোগো ও হিরো ব্যানার পরিবর্তন
- লোগো: `/public/logo.png`
- হিরো ব্যানার: `/public/banner/hero.jpg`
এই ফাইলগুলো নতুন ছবি দিয়ে প্রতিস্থাপন করলেই সাইটে তাৎক্ষণিকভাবে নতুন হাই-রেজোলিউশন ছবি দেখা যাবে।

---

## ৫. Vercel ডিপ্লয়মেন্ট গাইড (Vercel Deployment)

1. গিটহাবে প্রজেক্ট পুশ করুন:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Nazrul Festival 2026 registration platform"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. [Vercel Dashboard](https://vercel.com)-এ যান এবং `Add New Project` নির্বাচন করে গিটহাব রিপোটি ইমপোর্ট করুন।
3. **Environment Variables** সেকশনে `.env.local`-এর সকল কি (`MONGODB_URI`, `ADMIN_ID`, `ADMIN_PASSWORD`, `JWT_SECRET`, `CLOUDINARY_*`) যোগ করুন।
4. `Deploy` বাটনে ক্লিক করুন। কয়েক সেকেন্ডেই লাইভ সাইট তৈরি হয়ে যাবে।

