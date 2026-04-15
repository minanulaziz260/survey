import express from "express";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
const PORT = 3000;

// ===== CONFIG =====
const TELEGRAM_TOKEN = "ISI_BOT_TOKEN";
const CHAT_ID = "ISI_CHAT_ID";

// Simpan data lama
const FILE = "data.json";

function loadData() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data));
}

// Kirim Telegram
async function sendTelegram(text) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
    }),
  });
}

// Dummy checker (sementara)
async function checkSurvey() {
  // nanti bisa kita upgrade ke real scraping/API
  const fakeData = [
    {
      title: "Survey Baru",
      reward: "Rp5.000",
    },
  ];

  const old = loadData();

  const isNew = JSON.stringify(old) !== JSON.stringify(fakeData);

  if (isNew) {
    await sendTelegram("🔥 Survey baru tersedia!");
    saveData(fakeData);
  }
}

// Route manual
app.get("/check", async (req, res) => {
  await checkSurvey();
  res.send("Checked!");
});

// Auto tiap 3 menit
setInterval(checkSurvey, 180000);

app.listen(PORT, () => {
  console.log("Server jalan di port", PORT);
});
