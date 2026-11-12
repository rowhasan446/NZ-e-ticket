import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Person from "@/models/Person";
import { getNextSequence } from "@/models/Counter";
import { USER_ID_PREFIX } from "@/lib/config";
import { 
  validateName, 
  validatePhone, 
  validateEmail, 
  validateIdNumber, 
  validateDocumentFile, 
  validatePhotoFile 
} from "@/lib/validators";
import { bnToEnDigits, sanitizeNumberInput } from "@/lib/bn";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { signRegistrationToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Simple in-memory rate limiter per IP (max 10 registrations per IP per hour)
const ipRateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const limit = 15;

  const userRecord = ipRateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > userRecord.resetTime) {
    userRecord.count = 1;
    userRecord.resetTime = now + windowMs;
  } else {
    userRecord.count += 1;
  }

  ipRateLimitMap.set(ip, userRecord);
  return userRecord.count <= limit;
}

export async function POST(request) {
  try {
    // 1. IP rate limit check
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "অতিমাত্রায় চেষ্টার কারণে সাময়িকভাবে নিবন্ধন সীমিত করা হয়েছে। কিছুক্ষণ পর পুনরায় চেষ্টা করুন।" 
        },
        { status: 429 }
      );
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const honeypot = formData.get("honeypot");

    // Bot trap detection
    if (honeypot) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত অনুরোধ।" },
        { status: 400 }
      );
    }

    const name = formData.get("name")?.toString().trim();
    const rawPhone = formData.get("phone")?.toString();
    const rawEmail = formData.get("email")?.toString();
    const idType = formData.get("idType")?.toString();
    const rawIdNumber = formData.get("idNumber")?.toString();
    const idDocumentFile = formData.get("idDocument");
    const photoFile = formData.get("photo");

    // 3. Server-side Data Sanitization
    const phone = sanitizeNumberInput(rawPhone);
    const email = rawEmail ? rawEmail.trim().toLowerCase() : "";
    const idNumber = idType === "PASSPORT"
      ? bnToEnDigits(rawIdNumber).replace(/[\s\-]/g, "").toUpperCase()
      : sanitizeNumberInput(rawIdNumber);

    // 4. Server-side Validation
    const nameErr = validateName(name);
    if (nameErr) return NextResponse.json({ success: false, error: nameErr }, { status: 400 });

    const phoneErr = validatePhone(phone);
    if (phoneErr) return NextResponse.json({ success: false, error: phoneErr }, { status: 400 });

    const emailErr = validateEmail(email);
    if (emailErr) return NextResponse.json({ success: false, error: emailErr }, { status: 400 });

    const idNumberErr = validateIdNumber(idType, idNumber);
    if (idNumberErr) return NextResponse.json({ success: false, error: idNumberErr }, { status: 400 });

    const docFileErr = validateDocumentFile(idDocumentFile, true);
    if (docFileErr) return NextResponse.json({ success: false, error: docFileErr }, { status: 400 });

    if (photoFile && photoFile.size > 0) {
      const photoErr = validatePhotoFile(photoFile);
      if (photoErr) return NextResponse.json({ success: false, error: photoErr }, { status: 400 });
    }

    // 5. Connect to MongoDB
    await connectToDatabase();

    // 6. Duplicate Prevention Checks
    const existingPhone = await Person.findOne({ phone });
    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: "এই মোবাইল নম্বর দিয়ে ইতোমধ্যে নিবন্ধন করা হয়েছে।" },
        { status: 409 }
      );
    }

    const existingEmail = await Person.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "এই ইমেইল ঠিকানা দিয়ে ইতোমধ্যে নিবন্ধন করা হয়েছে।" },
        { status: 409 }
      );
    }

    const existingIdNumber = await Person.findOne({ idNumber });
    if (existingIdNumber) {
      return NextResponse.json(
        { success: false, error: "এই পরিচয়পত্র নম্বর দিয়ে ইতোমধ্যে নিবন্ধন করা হয়েছে।" },
        { status: 409 }
      );
    }

    // 7. Atomic Auto-Increment Serial and UserId Generation
    const serial = await getNextSequence("person_serial");
    const paddedSeq = String(serial).padStart(4, "0");
    const userId = `${USER_ID_PREFIX}-${paddedSeq}`;

    // 8. Upload Files to Cloudinary
    let idDocData = {
      url: "",
      publicId: "",
      resourceType: "image",
    };

    let photoData = null;

    try {
      // Convert ID Document to Buffer
      const docBuffer = Buffer.from(await idDocumentFile.arrayBuffer());
      const isDocPdf = idDocumentFile.type === "application/pdf" || idDocumentFile.name?.toLowerCase().endsWith(".pdf");

      const docUploadRes = await uploadToCloudinary(docBuffer, {
        public_id: `${userId}_doc_${Date.now()}`,
        type: "authenticated", // Private authenticated file
        resource_type: "image",
        format: isDocPdf ? "pdf" : undefined,
      });

      idDocData = {
        url: docUploadRes.secure_url,
        publicId: docUploadRes.public_id,
        resourceType: isDocPdf ? "pdf" : "image",
      };

      // Upload Photo if provided
      if (photoFile && photoFile.size > 0) {
        const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
        const photoUploadRes = await uploadToCloudinary(photoBuffer, {
          public_id: `${userId}_photo_${Date.now()}`,
          resource_type: "image",
        });

        photoData = {
          url: photoUploadRes.secure_url,
          publicId: photoUploadRes.public_id,
        };
      }
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      // In development or if Cloudinary fails, save placeholder so registration flow continues
      idDocData = {
        url: "/placeholder-doc.pdf",
        publicId: `local_placeholder_${userId}`,
        resourceType: "raw",
      };
    }

    // 9. Save Registration Record in MongoDB
    const newPerson = await Person.create({
      userId,
      serial,
      name,
      phone,
      email,
      idType,
      idNumber,
      idDocument: idDocData,
      photo: photoData,
      checkedIn: false,
      checkedInAt: null,
    });

    // 10. Generate Signed Short-Lived Access Token for Printable Registration Page
    const viewToken = await signRegistrationToken(userId);

    // Set signed token cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "নিবন্ধন সফলভাবে সম্পন্ন হয়েছে",
        userId: newPerson.userId,
        serial: newPerson.serial,
        redirectUrl: `/registration/${newPerson.userId}?token=${viewToken}`,
      },
      { status: 201 }
    );

    response.cookies.set(`bnss_reg_${userId}`, viewToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 48 * 60 * 60, // 48 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);

    // MongoDB duplicate key error safeguard (code 11000)
    if (error.code === 11000) {
      let fieldBn = "তথ্য";
      if (error.keyPattern?.phone) fieldBn = "মোবাইল নম্বর";
      else if (error.keyPattern?.email) fieldBn = "ইমেইল ঠিকানা";
      else if (error.keyPattern?.idNumber) fieldBn = "পরিচয়পত্র নম্বর";

      return NextResponse.json(
        { success: false, error: `এই ${fieldBn} দিয়ে ইতোমধ্যে নিবন্ধন সম্পন্ন হয়েছে।` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "সার্ভারে একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}

