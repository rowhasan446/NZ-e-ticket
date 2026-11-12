/**
 * Connection Test Script
 * Tests MongoDB Atlas and Cloudinary connections
 * Run: node scripts/test-connections.mjs
 */

import { createRequire } from "module";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load .env.local manually
function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../.env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx < 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
    console.log("✅ .env.local loaded\n");
  } catch (e) {
    console.error("❌ Could not load .env.local:", e.message);
    process.exit(1);
  }
}

// ── Test 1: MongoDB Atlas ──────────────────────────────────────────────────
async function testMongoDB() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔵 TEST 1: MongoDB Atlas Connection");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI not set");
    return { ok: false, reason: "MONGODB_URI missing" };
  }
  console.log("   URI prefix:", uri.substring(0, 30) + "...");

  try {
    const mongoose = require("mongoose");
    const start = Date.now();
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    const latency = Date.now() - start;
    console.log(`✅ Connected! Latency: ${latency}ms`);

    // Ping test
    const admin = mongoose.connection.db.admin();
    const pingResult = await admin.ping();
    console.log("✅ Ping result:", JSON.stringify(pingResult));

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ Collections in DB: ${collections.length > 0 ? collections.map(c => c.name).join(", ") : "(none yet — fresh DB)"}`);

    // Write test
    const TestModel = mongoose.model("_test_connection", new mongoose.Schema({ ts: Date }));
    const doc = await TestModel.create({ ts: new Date() });
    console.log("✅ Write test: document inserted, _id:", doc._id.toString());
    await TestModel.deleteOne({ _id: doc._id });
    console.log("✅ Cleanup: test document deleted");

    await mongoose.disconnect();
    console.log("✅ Disconnected cleanly\n");
    return { ok: true, latency };
  } catch (err) {
    console.error("❌ MongoDB FAILED:", err.message);
    console.error("   Code:", err.code);
    return { ok: false, reason: err.message };
  }
}

// ── Test 2: Cloudinary ────────────────────────────────────────────────────
async function testCloudinary() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🟠 TEST 2: Cloudinary Connection");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("❌ One or more Cloudinary env vars missing");
    return { ok: false, reason: "Missing env vars" };
  }
  console.log("   Cloud name:", cloudName);
  console.log("   API key prefix:", apiKey.substring(0, 6) + "...");

  try {
    const { v2: cloudinary } = require("cloudinary");
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

    // Ping
    const start = Date.now();
    const ping = await cloudinary.api.ping();
    const latency = Date.now() - start;
    console.log(`✅ Ping OK: status=${ping.status}, latency=${latency}ms`);

    // Account usage
    const usage = await cloudinary.api.usage();
    console.log(`✅ Usage: ${usage.resources} resources, ${(usage.storage.usage / 1024 / 1024).toFixed(2)} MB used`);

    // Upload a tiny test image (1x1 red pixel base64 PNG)
    const tiny1x1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==";
    console.log("   Uploading 1×1 test image...");
    const uploadResult = await cloudinary.uploader.upload(tiny1x1, {
      folder: "nz2026_test",
      public_id: "connection_test_" + Date.now(),
      resource_type: "image",
    });
    console.log("✅ Upload OK:", uploadResult.secure_url);
    console.log("   public_id:", uploadResult.public_id);

    // Generate signed URL
    const signedUrl = cloudinary.url(uploadResult.public_id, {
      type: "upload",
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    });
    console.log("✅ Signed URL generated:", signedUrl.substring(0, 80) + "...");

    // Delete test image
    const delResult = await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log("✅ Cleanup: test image deleted, result:", delResult.result);

    console.log("");
    return { ok: true, latency };
  } catch (err) {
    console.error("❌ Cloudinary FAILED:", err.message || JSON.stringify(err));
    return { ok: false, reason: err.message || JSON.stringify(err) };
  }
}

// ── Test 3: Check required env vars ──────────────────────────────────────
function testEnvVars() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🟡 TEST 3: Environment Variables Check");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const required = [
    "MONGODB_URI",
    "ADMIN_ID",
    "ADMIN_PASSWORD",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "NEXT_PUBLIC_APP_URL",
  ];
  let allOk = true;
  for (const key of required) {
    const val = process.env[key];
    if (!val) {
      console.error(`❌ ${key}: NOT SET`);
      allOk = false;
    } else {
      const preview = key.includes("SECRET") || key.includes("PASSWORD") || key.includes("URI")
        ? val.substring(0, 8) + "***"
        : val;
      console.log(`✅ ${key}: ${preview}`);
    }
  }
  console.log("");
  return { ok: allOk };
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   NZ Ticket Registration — Test Suite ║");
  console.log("╚════════════════════════════════════════╝\n");

  loadEnv();

  const envResult   = testEnvVars();
  const mongoResult = await testMongoDB();
  const cdnResult   = await testCloudinary();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 FINAL SUMMARY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Env Vars   : ${envResult.ok   ? "✅ All set"            : "❌ Some missing"}`);
  console.log(`  MongoDB    : ${mongoResult.ok  ? `✅ OK (${mongoResult.latency}ms)` : "❌ FAILED — " + mongoResult.reason}`);
  console.log(`  Cloudinary : ${cdnResult.ok    ? `✅ OK (${cdnResult.latency}ms)`   : "❌ FAILED — " + cdnResult.reason}`);
  console.log("");

  process.exit(envResult.ok && mongoResult.ok && cdnResult.ok ? 0 : 1);
}

main();

