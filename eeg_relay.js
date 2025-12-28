// eeg_relay.js
// Receives EEG locally and forwards to cloud

const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔴 CHANGE THIS TO YOUR RAILWAY URL
const CLOUD_ENDPOINT =
  "https://eeg-stream-server-production.up.railway.app/eeg";

app.post("/eeg", async (req, res) => {
  try {
    await fetch(CLOUD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    console.log("EEG FORWARDED TO CLOUD");
    res.sendStatus(200);
  } catch {
    console.log("Cloud forward error");
    res.sendStatus(500);
  }
});

app.listen(8080, () => {
  console.log("Local EEG relay on port 8080");
});
