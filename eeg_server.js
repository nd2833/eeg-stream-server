// eeg_server.js
// Railway-stable EEG ingestion server (FINAL)

const express = require("express");
const cors = require("cors");

const app = express();

// Railway assigns PORT dynamically — REQUIRED
const PORT = process.env.PORT || 8080;

// ---- Middleware ----
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "1mb" }));

let latestEEG = null;

// ---- Health check (CRITICAL for Railway) ----
app.get("/", (req, res) => {
  res.status(200).send("EEG SERVER OK");
});

// ---- Receive EEG from local parser ----
app.post("/eeg", (req, res) => {
  try {
    latestEEG = req.body;
    console.log("Incoming EEG:", latestEEG);
    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Invalid EEG payload", err);
    res.status(400).json({ error: "Invalid EEG payload" });
  }
});

// ---- Serve EEG to Base ----
app.get("/eeg", (req, res) => {
  res.status(200).json(latestEEG || {});
});

// ---- Start server (DO NOT EXIT) ----
app.listen(PORT, "0.0.0.0", () => {
  console.log(`EEG server LIVE on port ${PORT}`);
});

// ---- Graceful shutdown (Railway sends SIGTERM) ----
process.on("SIGTERM", () => {
  console.log("SIGTERM received — keeping process alive until closed");
});
