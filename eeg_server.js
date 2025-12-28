const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

let latestEEG = null;

app.use(express.json());

// ---- CORS (Base44 + preview safe) ----
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---- Railway health check ----
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// ---- EEG ingest ----
app.post("/eeg", (req, res) => {
  latestEEG = req.body;
  console.log("Incoming EEG:", latestEEG);
  res.json({ status: "ok" });
});

// ---- EEG fetch ----
app.get("/eeg", (req, res) => {
  res.json(latestEEG || {});
});

app.listen(PORT, () => {
  console.log(`EEG server LIVE on port ${PORT}`);
});
