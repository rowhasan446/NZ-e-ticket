import mongoose from "mongoose";

const PersonSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    serial: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "নাম লেখা আবশ্যক"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "মোবাইল নম্বর লেখা আবশ্যক"],
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "ইমেইল ঠিকানা লেখা আবশ্যক"],
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    idType: {
      type: String,
      required: [true, "পরিচয়পত্রের ধরন নির্বাচন করা আবশ্যক"],
      enum: ["NID", "PASSPORT", "BIRTH_CERTIFICATE"],
    },
    idNumber: {
      type: String,
      required: [true, "পরিচয়পত্র নম্বর লেখা আবশ্যক"],
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
    },
    idDocument: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      resourceType: { type: String, default: "image" },
    },
    photo: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    checkedIn: {
      type: Boolean,
      default: false,
      index: true,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful compound indexes if needed for search
PersonSchema.index({ name: "text", phone: "text", email: "text", idNumber: "text" });

const Person = mongoose.models.Person || mongoose.model("Person", PersonSchema);

export default Person;

