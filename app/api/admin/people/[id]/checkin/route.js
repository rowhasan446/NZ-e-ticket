import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Person from "@/models/Person";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();

    const person = await Person.findById(id);
    if (!person) {
      return NextResponse.json({ success: false, error: "ব্যক্তি খুঁজে পাওয়া যায়নি।" }, { status: 404 });
    }

    // Toggle checkedIn state
    const nextCheckedInState = !person.checkedIn;
    person.checkedIn = nextCheckedInState;
    person.checkedInAt = nextCheckedInState ? new Date() : null;

    await person.save();

    return NextResponse.json({
      success: true,
      message: nextCheckedInState ? "চেক-ইন সম্পন্ন হয়েছে" : "চেক-ইন বাতিল করা হয়েছে",
      checkedIn: person.checkedIn,
      checkedInAt: person.checkedInAt,
    });
  } catch (error) {
    console.error("Admin checkin toggle error:", error);
    return NextResponse.json({ success: false, error: "চেক-ইন স্ট্যাটাস পরিবর্তন করা যায়নি।" }, { status: 500 });
  }
}

