// eeg_server.js
// FINAL Railway-stable EEG server using Express

const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

// ---- middleware ----
app.use(express.json());

// ---- CORS ----
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---- in-memory EEG ----
let latestEEG = null;

// ---- ROOT (Railway health check) ----
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.head("/", (req, res) => {
  res.sendStatus(200);
});

// ---- RECEIVE EEG ----
app.post("/eeg", (req, res) => {
  latestEEG = req.body;
  console.log("Incoming EEG:", latestEEG);
  res.json({ status: "ok" });
});

// ---- SERVE EEG ----
app.get("/eeg", (req, res) => {
  res.json(latestEEG || {});
});

// ---- START SERVER ----
app.listen(PORT, "0.0.0.0", () => {
  console.log(`EEG server LIVE on port ${PORT}`);
});

// ---- KEEP PROCESS ALIVE ----
process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down gracefully");
  process.exit(0);
});
