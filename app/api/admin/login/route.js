import { NextResponse } from "next/server";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

// Rate limiting for admin login (max 5 failed attempts per 15 min per IP)
const loginAttempts = new Map();

function recordAttempt(ip, isSuccess) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  let record = loginAttempts.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record = { count: 0, resetTime: now + windowMs };
  }

  if (isSuccess) {
    loginAttempts.delete(ip);
  } else {
    record.count += 1;
    loginAttempts.set(ip, record);
  }
}

function isRateLimited(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return false;
  if (now > record.resetTime) {
    loginAttempts.delete(ip);
    return false;
  }
  return record.count >= 5;
}

export async function POST(request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "একাধিকবার ভুল তথ্য প্রদানের কারণে লগইন সাময়িকভাবে স্থগিত করা হয়েছে। ১৫ মিনিট পর পুনরায় চেষ্টা করুন।" 
        },
        { status: 429 }
      );
    }

    const { adminId, password } = await request.json();

    const expectedAdminId = process.env.ADMIN_ID || "admin";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin1234";

    if (!adminId || !password) {
      return NextResponse.json(
        { success: false, error: "অ্যাডমিন আইডি এবং পাসওয়ার্ড প্রদান করুন।" },
        { status: 400 }
      );
    }

    // Verify credentials
    if (adminId.trim() !== expectedAdminId || password !== expectedPassword) {
      recordAttempt(clientIp, false);
      return NextResponse.json(
        { success: false, error: "ভুল অ্যাডমিন আইডি অথবা পাসওয়ার্ড।" },
        { status: 401 }
      );
    }

    recordAttempt(clientIp, true);

    // Issue signed JWT
    const token = await signAdminToken(adminId.trim());

    const response = NextResponse.json({
      success: true,
      message: "অ্যাডমিন লগইন সফল হয়েছে",
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "সার্ভারে সমস্যা দেখা দিয়েছে।" },
      { status: 500 }
    );
  }
}

