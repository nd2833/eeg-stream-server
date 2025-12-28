import express from "express";
import cors from "cors";

const app = express();

// allow all origins for now (Base44 needs this)
app.use(cors());
app.use(express.json());

// health checks (Railway needs these)
app.get("/", (req, res) => res.status(200).send("EEG SERVER OK"));
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

let latestEEG = {};

app.get("/eeg", (req, res) => {
  res.status(200).json(latestEEG);
});

app.post("/eeg", (req, res) => {
  latestEEG = req.body || {};
  console.log("EEG RECEIVED", latestEEG);
  res.status(200).json({ status: "ok" });
});

// 🔴 THIS IS CRITICAL
const PORT = Number(process.env.PORT);
app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening on PORT =", PORT);
});
