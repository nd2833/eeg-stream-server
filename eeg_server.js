// eeg_server.js — Railway-stable EEG server (FINAL)

const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

let latestEEG = null;

// ---- middleware ----
app.use(express.json());

// ---- CORS (manual, no cors package) ----
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---- HEALTH CHECK (REQUIRED BY RAILWAY) ----
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.head("/", (req, res) => {
  res.sendStatus(200);
});

// ---- EEG INGEST ----
app.post("/eeg", (req, res) => {
  latestEEG = req.body;
  console.log("Incoming EEG:", latestEEG);
  res.json({ status: "ok" });
});

// ---- EEG READ ----
app.get("/eeg", (req, res) => {
  res.json(latestEEG || {});
});

// ---- START ----
app.listen(PORT, "0.0.0.0", () => {
  console.log(`EEG server LIVE on port ${PORT}`);
});
