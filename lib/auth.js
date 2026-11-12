import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "fallback-secret-nazrul-utsav-2026-very-secure-key";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);

export const ADMIN_COOKIE_NAME = "bnss_admin_token";
export const REGISTRATION_COOKIE_PREFIX = "bnss_reg_";

/**
 * Sign an admin session JWT
 */
export async function signAdminToken(adminId) {
  return await new SignJWT({ adminId, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET_KEY);
}

/**
 * Verify an admin session JWT
 */
export async function verifyAdminToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (payload.role === "admin") {
      return payload;
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Sign a short-lived view token for a registered user's printable registration page
 */
export async function signRegistrationToken(userId) {
  return await new SignJWT({ userId, purpose: "view_registration" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("48h")
    .sign(SECRET_KEY);
}

/**
 * Verify if token has permission to view registration for this userId
 */
export async function verifyRegistrationToken(token, expectedUserId) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    // If admin, can view any registration
    if (payload.role === "admin") return true;
    
    // Otherwise must match user ID
    if (payload.purpose === "view_registration" && payload.userId === expectedUserId) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

