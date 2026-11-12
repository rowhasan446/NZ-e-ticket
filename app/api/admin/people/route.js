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
import { sanitizeNumberInput, bnToEnDigits } from "@/lib/bn";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "all";
    const idType = searchParams.get("idType") || "all";

    // 1. Build Query
    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { userId: searchRegex },
        { idNumber: searchRegex },
      ];
    }

    if (status === "checkedIn") {
      query.checkedIn = true;
    } else if (status === "pending") {
      query.checkedIn = false;
    }

    if (idType && idType !== "all") {
      query.idType = idType;
    }

    // 2. Pagination calculation
    const skip = (page - 1) * limit;

    const [people, totalFiltered, totalAll, totalCheckedIn] = await Promise.all([
      Person.find(query)
        .sort({ serial: 1 }) // Ordered by serial
        .skip(skip)
        .limit(limit)
        .lean(),
      Person.countDocuments(query),
      Person.countDocuments({}),
      Person.countDocuments({ checkedIn: true }),
    ]);

    const stats = {
      total: totalAll,
      checkedIn: totalCheckedIn,
      pending: totalAll - totalCheckedIn,
    };

    return NextResponse.json({
      success: true,
      people,
      pagination: {
        page,
        limit,
        total: totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("Admin list people error:", error);
    return NextResponse.json(
      { success: false, error: "তালিকা আনতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim();
    const rawPhone = formData.get("phone")?.toString();
    const rawEmail = formData.get("email")?.toString();
    const idType = formData.get("idType")?.toString();
    const rawIdNumber = formData.get("idNumber")?.toString();
    const idDocumentFile = formData.get("idDocument");
    const photoFile = formData.get("photo");

    const phone = sanitizeNumberInput(rawPhone);
    const email = rawEmail ? rawEmail.trim().toLowerCase() : "";
    const idNumber = idType === "PASSPORT"
      ? bnToEnDigits(rawIdNumber).replace(/[\s\-]/g, "").toUpperCase()
      : sanitizeNumberInput(rawIdNumber);

    // Validation
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

    await connectToDatabase();

    // Check duplicates
    const [existingPhone, existingEmail, existingIdNumber] = await Promise.all([
      Person.findOne({ phone }),
      Person.findOne({ email }),
      Person.findOne({ idNumber }),
    ]);

    if (existingPhone) return NextResponse.json({ success: false, error: "এই মোবাইল নম্বর দিয়ে ইতোমধ্যেই নিবন্ধন রয়েছে।" }, { status: 409 });
    if (existingEmail) return NextResponse.json({ success: false, error: "এই ইমেইল ঠিকানা দিয়ে ইতোমধ্যেই নিবন্ধন রয়েছে।" }, { status: 409 });
    if (existingIdNumber) return NextResponse.json({ success: false, error: "এই পরিচয়পত্র নম্বর দিয়ে ইতোমধ্যেই নিবন্ধন রয়েছে।" }, { status: 409 });

    // Generate serial and userId
    const serial = await getNextSequence("person_serial");
    const paddedSeq = String(serial).padStart(4, "0");
    const userId = `${USER_ID_PREFIX}-${paddedSeq}`;

    // Upload files
    let idDocData = { url: "", publicId: "", resourceType: "image" };
    let photoData = null;

    try {
      const docBuffer = Buffer.from(await idDocumentFile.arrayBuffer());
      const isDocPdf = idDocumentFile.type === "application/pdf" || idDocumentFile.name?.toLowerCase().endsWith(".pdf");

      const docUploadRes = await uploadToCloudinary(docBuffer, {
        public_id: `${userId}_doc_${Date.now()}`,
        type: "authenticated",
        resource_type: "image",
        format: isDocPdf ? "pdf" : undefined,
      });

      idDocData = {
        url: docUploadRes.secure_url,
        publicId: docUploadRes.public_id,
        resourceType: isDocPdf ? "pdf" : "image",
      };

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
    } catch (e) {
      console.warn("Upload fallback in admin add:", e);
      idDocData = { url: "/placeholder-doc.pdf", publicId: `local_${userId}`, resourceType: "raw" };
    }

    const createdPerson = await Person.create({
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

    return NextResponse.json({
      success: true,
      message: "নতুন ব্যক্তি সফলভাবে যুক্ত হয়েছে",
      person: createdPerson,
    });
  } catch (error) {
    console.error("Admin add person error:", error);
    return NextResponse.json({ success: false, error: "ব্যক্তি যোগ করতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}

