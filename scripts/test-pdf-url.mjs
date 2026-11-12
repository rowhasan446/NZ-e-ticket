import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
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
}

loadEnv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);

const publicId = "nazrul_festival_2026/NZ2026-0014_doc_test";
const expiresAt = Math.floor(Date.now() / 1000) + 900;

// Test 1: utils.private_download_url
try {
  const url1 = cloudinary.utils.private_download_url(publicId, "pdf", {
    resource_type: "raw",
    type: "authenticated",
    expires_at: expiresAt,
  });
  console.log("URL 1 (private_download_url):", url1);
} catch (e) {
  console.error("URL 1 failed:", e.message);
}

// Test 2: cloudinary.url with sign_url
try {
  const url2 = cloudinary.url(publicId, {
    resource_type: "raw",
    type: "authenticated",
    sign_url: true,
    expires_at: expiresAt,
  });
  console.log("URL 2 (cloudinary.url raw):", url2);
} catch (e) {
  console.error("URL 2 failed:", e.message);
}

// Test 3: cloudinary.url with sign_url and format
try {
  const url3 = cloudinary.url(publicId, {
    resource_type: "image",
    type: "authenticated",
    sign_url: true,
    expires_at: expiresAt,
    format: "pdf",
  });
  console.log("URL 3 (cloudinary.url image/pdf):", url3);
} catch (e) {
  console.error("URL 3 failed:", e.message);
}

