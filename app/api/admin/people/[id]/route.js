import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Person from "@/models/Person";
import { 
  validateName, 
  validatePhone, 
  validateEmail, 
  validateIdNumber, 
  validateDocumentFile, 
  validatePhotoFile 
} from "@/lib/validators";
import { sanitizeNumberInput, bnToEnDigits } from "@/lib/bn";
import { 
  getSignedDocumentUrl, 
  getAuthenticatedImageUrl, 
  uploadToCloudinary, 
  deleteFromCloudinary 
} from "@/lib/cloudinary";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    const person = await Person.findById(id).lean();
    if (!person) {
      return NextResponse.json({ success: false, error: "ব্যক্তি খুঁজে পাওয়া যায়নি।" }, { status: 404 });
    }

    // Generate signed expiring document URL for private preview in admin drawer
    let signedDocUrl = person.idDocument?.url;
    if (person.idDocument?.publicId && !person.idDocument.publicId.startsWith("local_")) {
      try {
        if (person.idDocument.resourceType === "raw" || person.idDocument.url.endsWith(".pdf")) {
          signedDocUrl = getSignedDocumentUrl(person.idDocument.publicId, "raw", 900); // 15 mins
        } else {
          signedDocUrl = getAuthenticatedImageUrl(person.idDocument.publicId, "image", 900);
        }
      } catch (signErr) {
        console.warn("Could not sign URL, fallback to stored url:", signErr);
      }
    }

    return NextResponse.json({
      success: true,
      person: {
        ...person,
        idDocument: {
          ...person.idDocument,
          previewUrl: signedDocUrl,
        },
      },
    });
  } catch (error) {
    console.error("Admin get person detail error:", error);
    return NextResponse.json({ success: false, error: "তথ্য আনতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    const person = await Person.findById(id);
    if (!person) {
      return NextResponse.json({ success: false, error: "ব্যক্তি খুঁজে পাওয়া যায়নি।" }, { status: 404 });
    }

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

    // Validate
    const nameErr = validateName(name);
    if (nameErr) return NextResponse.json({ success: false, error: nameErr }, { status: 400 });

    const phoneErr = validatePhone(phone);
    if (phoneErr) return NextResponse.json({ success: false, error: phoneErr }, { status: 400 });

    const emailErr = validateEmail(email);
    if (emailErr) return NextResponse.json({ success: false, error: emailErr }, { status: 400 });

    const idNumberErr = validateIdNumber(idType, idNumber);
    if (idNumberErr) return NextResponse.json({ success: false, error: idNumberErr }, { status: 400 });

    // Check duplicate if changed
    if (phone !== person.phone) {
      const existingPhone = await Person.findOne({ phone, _id: { $ne: id } });
      if (existingPhone) return NextResponse.json({ success: false, error: "এই মোবাইল নম্বরটি অন্য ব্যক্তির ক্ষেত্রে ব্যবহৃত হয়েছে।" }, { status: 409 });
    }

    if (email !== person.email) {
      const existingEmail = await Person.findOne({ email, _id: { $ne: id } });
      if (existingEmail) return NextResponse.json({ success: false, error: "এই ইমেইল ঠিকানাটি অন্য ব্যক্তির ক্ষেত্রে ব্যবহৃত হয়েছে।" }, { status: 409 });
    }

    if (idNumber !== person.idNumber) {
      const existingId = await Person.findOne({ idNumber, _id: { $ne: id } });
      if (existingId) return NextResponse.json({ success: false, error: "এই পরিচয়পত্র নম্বরটি অন্য ব্যক্তির ক্ষেত্রে ব্যবহৃত হয়েছে।" }, { status: 409 });
    }

    // Handle replacement document upload if provided
    if (idDocumentFile && typeof idDocumentFile !== "string" && idDocumentFile.size > 0) {
      const docFileErr = validateDocumentFile(idDocumentFile, true);
      if (docFileErr) return NextResponse.json({ success: false, error: docFileErr }, { status: 400 });

      try {
        const docBuffer = Buffer.from(await idDocumentFile.arrayBuffer());
        const isDocPdf = idDocumentFile.type === "application/pdf" || idDocumentFile.name?.toLowerCase().endsWith(".pdf");

        // Delete old file if present
        if (person.idDocument?.publicId && !person.idDocument.publicId.startsWith("local_")) {
          await deleteFromCloudinary(person.idDocument.publicId, person.idDocument.resourceType || "image", "authenticated");
        }

        const uploadRes = await uploadToCloudinary(docBuffer, {
          public_id: `${person.userId}_doc_${Date.now()}`,
          type: "authenticated",
          resource_type: isDocPdf ? "raw" : "image",
        });

        person.idDocument = {
          url: uploadRes.secure_url,
          publicId: uploadRes.public_id,
          resourceType: isDocPdf ? "raw" : "image",
        };
      } catch (err) {
        console.error("Replacement document upload failed:", err);
      }
    }

    // Handle replacement photo upload if provided
    if (photoFile && typeof photoFile !== "string" && photoFile.size > 0) {
      const photoErr = validatePhotoFile(photoFile);
      if (photoErr) return NextResponse.json({ success: false, error: photoErr }, { status: 400 });

      try {
        const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
        if (person.photo?.publicId && !person.photo.publicId.startsWith("local_")) {
          await deleteFromCloudinary(person.photo.publicId, "image", "upload");
        }

        const photoRes = await uploadToCloudinary(photoBuffer, {
          public_id: `${person.userId}_photo_${Date.now()}`,
          resource_type: "image",
        });

        person.photo = {
          url: photoRes.secure_url,
          publicId: photoRes.public_id,
        };
      } catch (err) {
        console.error("Replacement photo upload failed:", err);
      }
    }

    person.name = name;
    person.phone = phone;
    person.email = email;
    person.idType = idType;
    person.idNumber = idNumber;
    // Note: userId is not editable per requirement

    await person.save();

    return NextResponse.json({
      success: true,
      message: "তথ্য সফলভাবে হালনাগাদ করা হয়েছে",
      person,
    });
  } catch (error) {
    console.error("Admin update person error:", error);
    return NextResponse.json({ success: false, error: "হালনাগাদ করতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    const person = await Person.findById(id);
    if (!person) {
      return NextResponse.json({ success: false, error: "ব্যক্তি খুঁজে পাওয়া যায়নি।" }, { status: 404 });
    }

    // Delete files from Cloudinary
    if (person.idDocument?.publicId && !person.idDocument.publicId.startsWith("local_")) {
      await deleteFromCloudinary(
        person.idDocument.publicId, 
        person.idDocument.resourceType || "image", 
        "authenticated"
      );
    }

    if (person.photo?.publicId && !person.photo.publicId.startsWith("local_")) {
      await deleteFromCloudinary(person.photo.publicId, "image", "upload");
    }

    await Person.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "ব্যক্তি এবং সম্পর্কিত ফাইল সফলভাবে মুছে ফেলা হয়েছে",
    });
  } catch (error) {
    console.error("Admin delete person error:", error);
    return NextResponse.json({ success: false, error: "মুছে ফেলতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}

