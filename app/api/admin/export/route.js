import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Person from "@/models/Person";
import { getIdTypeLabel, formatBanglaDate } from "@/lib/bn";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    const people = await Person.find({}).sort({ serial: 1 }).lean();

    // Helper to safely escape CSV cell content
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      "ক্রমিক",
      "ইউজার আইডি (User ID)",
      "নাম",
      "মোবাইল নম্বর",
      "ইমেইল ঠিকানা",
      "পরিচয়পত্রের ধরন",
      "পরিচয়পত্র নম্বর",
      "চেক-ইন স্ট্যাটাস",
      "চেক-ইনের সময়",
      "নিবন্ধনের সময়",
    ];

    const rows = people.map((p) => [
      p.serial,
      p.userId,
      p.name,
      p.phone,
      p.email,
      getIdTypeLabel(p.idType),
      p.idNumber,
      p.checkedIn ? "সম্পন্ন" : "বাকি",
      p.checkedInAt ? formatBanglaDate(p.checkedInAt) : "—",
      p.createdAt ? formatBanglaDate(p.createdAt) : "—",
    ]);

    // CSV with UTF-8 BOM (\uFEFF)
    const csvContent =
      "\uFEFF" +
      [
        headers.map(escapeCsv).join(","),
        ...rows.map((row) => row.map(escapeCsv).join(",")),
      ].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="nazrul_festival_2026_registrations_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export CSV error:", error);
    return NextResponse.json({ success: false, error: "CSV ফাইল তৈরিতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}

