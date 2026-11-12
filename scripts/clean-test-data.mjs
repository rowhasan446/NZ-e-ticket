import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

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

async function clean() {
  loadEnv();
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const res = await db.collection("people").deleteMany({
    $or: [
      { email: /example\.com$/ },
      { name: /পরীক্ষা/ },
      { name: /অ্যাডমিন যোগ করা/ }
    ]
  });
  console.log(`Cleaned ${res.deletedCount} test records.`);
  await mongoose.disconnect();
}

clean();

