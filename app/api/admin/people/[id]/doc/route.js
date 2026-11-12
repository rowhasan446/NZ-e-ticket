import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Person from "@/models/Person";
import { getSignedDocumentUrl, getAuthenticatedImageUrl } from "@/lib/cloudinary";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const shouldDownload = searchParams.get("download") === "1";

    await connectToDatabase();
    const person = await Person.findById(id).lean();

    if (!person || !person.idDocument?.publicId) {
      return new NextResponse("ডকুমেন্ট পাওয়া যায়নি", { status: 404 });
    }

    const { publicId, resourceType, url } = person.idDocument;

    // Local placeholder fallback
    if (publicId.startsWith("local_")) {
      return NextResponse.redirect(new URL(url || "/placeholder-doc.pdf", request.url));
    }

    const isPdf =
      resourceType === "raw" ||
      url?.toLowerCase().endsWith(".pdf") ||
      publicId?.toLowerCase().endsWith(".pdf");

    // Generate signed authenticated URL for Cloudinary
    let signedFetchUrl;
    const expiresAt = Math.floor(Date.now() / 1000) + 1200; // 20 mins

    if (resourceType === "raw") {
      signedFetchUrl = cloudinary.url(publicId, {
        resource_type: "raw",
        type: "authenticated",
        sign_url: true,
        expires_at: expiresAt,
      });
    } else {
      signedFetchUrl = cloudinary.url(publicId + (isPdf && !publicId.endsWith(".pdf") ? ".pdf" : ""), {
        resource_type: "image",
        type: "authenticated",
        sign_url: true,
        expires_at: expiresAt,
      });
    }

    // Fetch the asset from Cloudinary server-side
    const cdnResponse = await fetch(signedFetchUrl);

    if (!cdnResponse.ok) {
      // Try raw download fallback
      const fallbackUrl = cloudinary.utils.private_download_url(publicId, isPdf ? "pdf" : "", {
        resource_type: resourceType || "raw",
        type: "authenticated",
        expires_at: expiresAt,
      });
      const fallbackRes = await fetch(fallbackUrl);
      if (!fallbackRes.ok) {
        return new NextResponse("ডকুমেন্ট লোড করতে ব্যর্থ হয়েছে", { status: 502 });
      }
      const data = await fallbackRes.arrayBuffer();
      const contentType = isPdf ? "application/pdf" : fallbackRes.headers.get("content-type") || "application/octet-stream";
      const disposition = shouldDownload ? "attachment" : "inline";
      return new NextResponse(data, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `${disposition}; filename="doc_${person.userId}.${isPdf ? "pdf" : "jpg"}"`,
          "Cache-Control": "private, max-age=3600",
        },
      });
    }

    const fileBuffer = await cdnResponse.arrayBuffer();
    const contentType = isPdf
      ? "application/pdf"
      : cdnResponse.headers.get("content-type") || "image/jpeg";

    const disposition = shouldDownload ? "attachment" : "inline";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `${disposition}; filename="doc_${person.userId}.${isPdf ? "pdf" : "jpg"}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Doc proxy error:", error);
    return new NextResponse("সার্ভার ত্রুটি", { status: 500 });
  }
}

