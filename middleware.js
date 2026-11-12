import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "fallback-secret-nazrul-utsav-2026-very-secure-key";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect admin pages and admin API routes
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get("bnss_admin_token")?.value;

  let isValidAdmin = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (payload && payload.role === "admin") {
        isValidAdmin = true;
      }
    } catch (err) {
      isValidAdmin = false;
    }
  }

  if (!isValidAdmin) {
    if (isAdminApi) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে লগইন করুন।" },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};

