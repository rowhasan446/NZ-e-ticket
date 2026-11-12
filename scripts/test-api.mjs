/**
 * Full API Test Suite for NZ Ticket Registration
 * Tests: Registration, Admin Login, CRUD, Check-in, Export, Logout
 * Run: node scripts/test-api.mjs
 */

import { readFileSync, createReadStream, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "http://localhost:3000";

// ── Helpers ──────────────────────────────────────────────────────────────
let adminCookie = "";
let registrationToken = "";
let createdUserId = "";
let personMongoId = "";

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

async function req(method, path, { body, formData, cookie, json = true, raw = false } = {}) {
  const headers = {};
  if (cookie) headers["Cookie"] = cookie;
  
  let fetchBody;
  if (formData) {
    fetchBody = formData;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(body);
  }

  const res = await fetch(BASE + path, { method, headers, body: fetchBody });
  const setCookie = res.headers.get("set-cookie") || "";
  
  if (raw) {
    const buf = Buffer.from(await res.arrayBuffer());
    return { status: res.status, buffer: buf, text: buf.toString("utf-8"), setCookie, headers: res.headers };
  }

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  
  return { status: res.status, data, setCookie, headers: res.headers };
}

function pass(label, detail = "") {
  console.log(`  ✅ ${label}${detail ? " — " + detail : ""}`);
}
function fail(label, detail = "") {
  console.log(`  ❌ ${label}${detail ? " — " + detail : ""}`);
}
function section(title) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  ${title}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

// Results tracker
const results = [];
function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  ok ? pass(name, detail) : fail(name, detail);
}

// ── Test: Registration ────────────────────────────────────────────────────
async function testRegistration() {
  section("TEST: Public Registration API");

  // Build FormData with a tiny PNG
  const tiny1x1 = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==",
    "base64"
  );
  
  // Test 1: Missing required fields
  const fd1 = new FormData();
  fd1.append("name", "");
  const r1 = await req("POST", "/api/register", { formData: fd1 });
  record("Registration: rejects empty name", r1.status === 400, `status=${r1.status}`);

  // Test 2: Valid registration with NID
  const fd2 = new FormData();
  fd2.append("name", "পরীক্ষা ব্যক্তি");
  fd2.append("phone", "01712345678");
  fd2.append("email", "test@example.com");
  fd2.append("idType", "NID");
  fd2.append("idNumber", "1234567890");
  fd2.append("idDocument", new Blob([tiny1x1], { type: "image/png" }), "id.png");
  
  const r2 = await req("POST", "/api/register", { formData: fd2 });
  
  if (r2.status === 201 && r2.data?.userId) {
    createdUserId = r2.data.userId;
    // Extract token from redirectUrl
    const urlMatch = r2.data.redirectUrl?.match(/token=([^&]+)/);
    registrationToken = urlMatch ? urlMatch[1] : "";
    record("Registration: creates person with userId", true, `userId=${createdUserId}`);
    record("Registration: returns token in redirectUrl", !!registrationToken, `token=${registrationToken?.substring(0, 20)}...`);
  } else {
    record("Registration: creates person with userId", false, `status=${r2.status}, err=${JSON.stringify(r2.data)}`);
    record("Registration: returns token in redirectUrl", false, "no userId returned");
  }

  // Test 3: Duplicate phone
  const fd3 = new FormData();
  fd3.append("name", "আরেকজন");
  fd3.append("phone", "01712345678"); // same phone
  fd3.append("email", "other@example.com");
  fd3.append("idType", "NID");
  fd3.append("idNumber", "9876543210");
  fd3.append("idDocument", new Blob([tiny1x1], { type: "image/png" }), "id.png");
  
  const r3 = await req("POST", "/api/register", { formData: fd3 });
  record("Registration: rejects duplicate phone", r3.status === 409, `status=${r3.status}`);

  // Test 4: Invalid NID (wrong length)
  const fd4 = new FormData();
  fd4.append("name", "ভুল এনআইডি");
  fd4.append("phone", "01812345679");
  fd4.append("email", "wrong@example.com");
  fd4.append("idType", "NID");
  fd4.append("idNumber", "12345"); // only 5 digits — invalid
  fd4.append("idDocument", new Blob([tiny1x1], { type: "image/png" }), "id.png");
  
  const r4 = await req("POST", "/api/register", { formData: fd4 });
  record("Registration: rejects invalid NID length", r4.status === 400, `status=${r4.status}`);

  // Test 5: View registration page
  if (createdUserId && registrationToken) {
    const r5 = await req("GET", `/registration/${createdUserId}?token=${registrationToken}`);
    record("Registration: view page accessible with token", r5.status === 200, `status=${r5.status}`);
  }
}

// ── Test: Admin Login ─────────────────────────────────────────────────────
async function testAdminLogin() {
  section("TEST: Admin Login API");

  const adminId  = process.env.ADMIN_ID;
  const adminPwd = process.env.ADMIN_PASSWORD;

  // Wrong password
  const r1 = await req("POST", "/api/admin/login", { body: { adminId: adminId, password: "wrongpassword123" } });
  record("Admin login: rejects wrong password", r1.status === 401, `status=${r1.status}`);

  // Correct credentials
  const r2 = await req("POST", "/api/admin/login", { body: { adminId: adminId, password: adminPwd } });
  if (r2.status === 200) {
    // Extract cookie
    const cookieHeader = r2.setCookie;
    if (cookieHeader) {
      adminCookie = cookieHeader.split(";")[0]; // e.g. "bnss_admin_token=eyJ..."
      record("Admin login: success + sets cookie", true, `cookie prefix: ${adminCookie.substring(0, 30)}...`);
    } else {
      // Try data for token
      record("Admin login: success + sets cookie", false, "No Set-Cookie header");
    }
  } else {
    record("Admin login: success + sets cookie", false, `status=${r2.status}, data=${JSON.stringify(r2.data)}`);
  }

  // Unauthenticated access to admin API
  const r3 = await req("GET", "/api/admin/people");
  record("Admin API: blocks unauthenticated access", r3.status === 401 || r3.status === 307 || r3.status === 302, `status=${r3.status}`);
}

// ── Test: Admin Dashboard ─────────────────────────────────────────────────
async function testAdminDashboard() {
  section("TEST: Admin Dashboard & People API");

  if (!adminCookie) {
    console.log("  ⚠️  Skipping — no admin cookie");
    return;
  }

  // GET /api/admin/people
  const r1 = await req("GET", "/api/admin/people", { cookie: adminCookie });
  if (r1.status === 200) {
    const { data } = r1;
    record("Admin: GET /api/admin/people", true, `total=${data.stats?.total ?? data.people?.length}`);
    record("Admin: response has stats object", !!data.stats, JSON.stringify(data.stats));
    record("Admin: response has people array", Array.isArray(data.people), `count=${data.people?.length}`);
  } else {
    record("Admin: GET /api/admin/people", false, `status=${r1.status}, data=${JSON.stringify(r1.data)}`);
  }

  // Search by name
  const r2 = await req("GET", "/api/admin/people?search=পরীক্ষা", { cookie: adminCookie });
  record("Admin: search by name works", r2.status === 200, `hits=${r2.data?.people?.length}`);

  // Filter by idType
  const r3 = await req("GET", "/api/admin/people?idType=NID", { cookie: adminCookie });
  record("Admin: filter by idType=NID", r3.status === 200, `hits=${r3.data?.people?.length}`);

  // Filter by checkedIn=false (API uses status=pending)
  const r4 = await req("GET", "/api/admin/people?status=pending", { cookie: adminCookie });
  record("Admin: filter by status=pending (not checked in)", r4.status === 200, `hits=${r4.data?.people?.length}`);
}

// ── Test: Check-in Toggle ─────────────────────────────────────────────────
async function testCheckin() {
  section("TEST: Check-in Toggle");

  if (!adminCookie) {
    console.log("  ⚠️  Skipping — no admin cookie");
    return;
  }

  // Find the person we registered
  const list = await req("GET", "/api/admin/people?search=পরীক্ষা", { cookie: adminCookie });
  const person = list.data?.people?.[0];
  if (!person) {
    record("Check-in: find test person", false, "person not found in search");
    return;
  }
  personMongoId = person._id;
  record("Check-in: find test person", true, `_id=${personMongoId}, checkedIn=${person.checkedIn}`);

  // Toggle check-in ON
  const r1 = await req("PATCH", `/api/admin/people/${personMongoId}/checkin`, {
    cookie: adminCookie,
    body: { checkedIn: true }
  });
  record("Check-in: toggle ON", r1.status === 200, `checkedIn=${r1.data?.checkedIn}`);

  // Toggle check-in OFF
  const r2 = await req("PATCH", `/api/admin/people/${personMongoId}/checkin`, {
    cookie: adminCookie,
    body: { checkedIn: false }
  });
  record("Check-in: toggle OFF", r2.status === 200, `checkedIn=${r2.data?.checkedIn}`);
}

// ── Test: Edit Person ─────────────────────────────────────────────────────
async function testEditPerson() {
  section("TEST: Edit Person (Admin)");

  if (!adminCookie || !personMongoId) {
    console.log("  ⚠️  Skipping — missing cookie or person ID");
    return;
  }

  const tiny1x1 = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==",
    "base64"
  );

  const fd = new FormData();
  fd.append("name", "পরীক্ষা ব্যক্তি (সংশোধিত)");
  fd.append("phone", "01712345678");
  fd.append("email", "test@example.com");
  fd.append("idType", "NID");
  fd.append("idNumber", "1234567890");

  const r = await req("PUT", `/api/admin/people/${personMongoId}`, {
    cookie: adminCookie,
    formData: fd
  });
  record("Edit person: PUT request", r.status === 200, `status=${r.status}, name=${r.data?.person?.name || r.data?.name}`);
}

// ── Test: Get Single Person (Signed URL) ──────────────────────────────────
async function testGetPerson() {
  section("TEST: Get Single Person with Signed Cloudinary URL");

  if (!adminCookie || !personMongoId) {
    console.log("  ⚠️  Skipping — missing cookie or person ID");
    return;
  }

  const r = await req("GET", `/api/admin/people/${personMongoId}`, { cookie: adminCookie });
  if (r.status === 200) {
    record("Get person: returns person data", true, `userId=${r.data?.person?.userId || r.data?.userId}`);
    const hasSignedUrl = r.data?.person?.idDocument?.previewUrl || r.data?.person?.idDocument?.url;
    record("Get person: has document URL", !!hasSignedUrl, hasSignedUrl ? "URL present" : "no URL");
  } else {
    record("Get person: returns person data", false, `status=${r.status}`);
  }
}

// ── Test: CSV Export ──────────────────────────────────────────────────────
async function testExport() {
  section("TEST: CSV Export");

  if (!adminCookie) {
    console.log("  ⚠️  Skipping — no admin cookie");
    return;
  }

  const r = await req("GET", "/api/admin/export", { cookie: adminCookie, raw: true });
  if (r.status === 200) {
    const contentType = r.headers.get("content-type") || "";
    const contentDisp = r.headers.get("content-disposition") || "";
    record("CSV Export: status 200", true, `Content-Type: ${contentType}`);
    record("CSV Export: is CSV file", contentType.includes("csv") || contentDisp.includes(".csv"), contentDisp);
    
    // Check first 3 bytes for UTF-8 BOM: 0xEF, 0xBB, 0xBF
    const buf = r.buffer;
    const hasBOM = buf && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
    record("CSV Export: has UTF-8 BOM", hasBOM, hasBOM ? "BOM (0xEF 0xBB 0xBF) present" : "no BOM detected");
    record("CSV Export: has Bengali headers", typeof r.text === "string" && r.text.includes("নাম"), 
      typeof r.text === "string" ? "first 100 chars: " + r.text.substring(0, 100) : "not a string");
  } else {
    record("CSV Export: status 200", false, `status=${r.status}`);
  }
}

// ── Test: Admin Add Person ────────────────────────────────────────────────
async function testAdminAddPerson() {
  section("TEST: Admin Add Person");

  if (!adminCookie) {
    console.log("  ⚠️  Skipping — no admin cookie");
    return;
  }

  const tiny1x1 = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==",
    "base64"
  );

  const fd = new FormData();
  fd.append("name", "অ্যাডমিন যোগ করা ব্যক্তি");
  fd.append("phone", "01911111111");
  fd.append("email", "adminadded@example.com");
  fd.append("idType", "PASSPORT");
  fd.append("idNumber", "AB123456");
  fd.append("idDocument", new Blob([tiny1x1], { type: "image/png" }), "passport.png");

  const r = await req("POST", "/api/admin/people", { cookie: adminCookie, formData: fd });
  if (r.status === 200 || r.status === 201) {
    const person = r.data?.person || r.data;
    record("Admin add person: POST success", true, `userId=${person?.userId}`);
    // Clean up this person too
    const adminAddedId = person?._id || person?.id;
    if (adminAddedId) {
      const del = await req("DELETE", `/api/admin/people/${adminAddedId}`, { cookie: adminCookie });
      record("Admin add person: cleanup delete", del.status === 200, `status=${del.status}`);
    }
  } else {
    record("Admin add person: POST success", false, `status=${r.status}, data=${JSON.stringify(r.data)}`);
  }
}

// ── Test: Delete Person ───────────────────────────────────────────────────
async function testDeletePerson() {
  section("TEST: Delete Person");

  if (!adminCookie || !personMongoId) {
    console.log("  ⚠️  Skipping — missing cookie or person ID");
    return;
  }

  const r = await req("DELETE", `/api/admin/people/${personMongoId}`, { cookie: adminCookie });
  record("Delete person: DELETE request", r.status === 200, `status=${r.status}, msg=${r.data?.message}`);

  // Verify gone
  const r2 = await req("GET", `/api/admin/people/${personMongoId}`, { cookie: adminCookie });
  record("Delete person: person no longer found", r2.status === 404, `status=${r2.status}`);
}

// ── Test: Logout ──────────────────────────────────────────────────────────
async function testLogout() {
  section("TEST: Admin Logout");

  if (!adminCookie) {
    console.log("  ⚠️  Skipping — no admin cookie");
    return;
  }

  const r = await req("POST", "/api/admin/logout", { cookie: adminCookie });
  const clearedCookie = r.setCookie && (r.setCookie.includes("Max-Age=0") || r.setCookie.includes("bnss_admin_token=;"));
  record("Admin logout: POST success", r.status === 200, `status=${r.status}`);
  record("Admin logout: clears admin auth cookie", !!clearedCookie, r.setCookie || "Set-Cookie header missing");
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  loadEnv();

  console.log("\n╔════════════════════════════════════════════╗");
  console.log("║   NZ Ticket — Full API Test Suite          ║");
  console.log("╚════════════════════════════════════════════╝");

  try {
    await testRegistration();
    await testAdminLogin();
    await testAdminDashboard();
    await testCheckin();
    await testEditPerson();
    await testGetPerson();
    await testExport();
    await testAdminAddPerson();
    await testDeletePerson();
    await testLogout();
  } catch (err) {
    console.error("\n💥 Unexpected error during tests:", err.message);
    console.error(err.stack);
  }

  // ── Summary ──
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  📋 FINAL TEST SUMMARY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  for (const r of results) {
    console.log(`  ${r.ok ? "✅" : "❌"} ${r.name}${r.detail ? " — " + r.detail : ""}`);
  }
  console.log(`\n  Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log("");
  
  process.exit(failed > 0 ? 1 : 0);
}

main();
