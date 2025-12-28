// eeg_server.js
// Railway EEG receiver (stable + CORS + health endpoints)

const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

// Parse JSON bodies
app.use(express.json({ limit: "1mb" }));

// CORS (no external dependency)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let latestEEG = null;
let latestAt = null;

// Health endpoints (Railway + browser)
app.get("/", (req, res) => {
  res.status(200).send("OK");
});
app.head("/", (req, res) => {
  res.sendStatus(200);
});
app.get("/health", (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

// Receive EEG from your Mac
app.post("/eeg", (req, res) => {
  latestEEG = req.body;
  latestAt = Date.now();
  console.log("Incoming EEG:", latestEEG);
  res.json({ status: "ok" });
});

// Base44 reads latest
app.get("/eeg", (req, res) => {
  res.json({
    ...((latestEEG && typeof latestEEG === "object") ? latestEEG : {}),
    _serverTime: Date.now(),
    _lastReceivedAt: latestAt,
  });
});

app.listen(PORT, () => {
  console.log(`EEG server LIVE on port ${PORT}`);
});
