import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldX, Home, AlertCircle } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import Person from "@/models/Person";
import PrintableCard from "@/components/PrintableCard";
import { verifyRegistrationToken, verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RegistrationViewPage({ params, searchParams }) {
  const { userId } = params;
  const tokenFromQuery = searchParams?.token;

  // 1. Check authorization token
  const cookieStore = cookies();
  const tokenFromCookie = cookieStore.get(`bnss_reg_${userId}`)?.value;
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  let isAuthorized = false;

  // Check admin access
  if (adminCookie) {
    const adminPayload = await verifyAdminToken(adminCookie);
    if (adminPayload) isAuthorized = true;
  }

  // Check registration token (from cookie or URL query)
  if (!isAuthorized) {
    const candidateToken = tokenFromQuery || tokenFromCookie;
    if (candidateToken) {
      const isValid = await verifyRegistrationToken(candidateToken, userId);
      if (isValid) isAuthorized = true;
    }
  }

  // Unauthorized screen (Prevents scraping sequential user IDs)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-brand-bg">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-elevated border border-brand-border text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldX className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-serif font-black text-brand-heading">
            অননুমোদিত অ্যাক্সেস
          </h1>

          <p className="text-sm text-brand-dark/80 leading-relaxed">
            নিরাপত্তার স্বার্থে রেজিস্ট্রেশন তথ্য দেখার জন্য নির্দিষ্ট ভেরিফিকেশন টোকেন প্রয়োজন। আপনি যদি এই আইডিটির নিবন্ধক হয়ে থাকেন, তবে আপনার প্রাপ্ত লিঙ্কটি ব্যবহার করুন।
          </p>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-bold py-3 px-5 rounded-xl transition-all shadow-sm"
            >
              <Home className="w-4 h-4" />
              মূল পাতায় ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Fetch registrant from database
  await connectToDatabase();
  const person = await Person.findOne({ userId }).lean();

  if (!person) {
    return notFound();
  }

  // Prepare safe serializable person data (strictly omit idDocument for privacy)
  const safePerson = {
    userId: person.userId,
    serial: person.serial,
    name: person.name,
    phone: person.phone,
    email: person.email,
    idType: person.idType,
    idNumber: person.idNumber,
    photo: person.photo ? { url: person.photo.url } : null,
    createdAt: person.createdAt?.toISOString(),
  };

  return (
    <div className="min-h-screen bg-brand-bg py-6 sm:py-10">
      <PrintableCard person={safePerson} />
    </div>
  );
}

