import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// --- REQUIRED FOR RAILWAY ---
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// --- MAIN ROUTES ---
let latestEEG = {};

app.get("/", (req, res) => {
  res.send("EEG SERVER OK");
});

app.get("/eeg", (req, res) => {
  res.json(latestEEG);
});

app.post("/eeg", (req, res) => {
  latestEEG = req.body;
  res.json({ status: "ok" });
});

// --- PORT ---
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on PORT = ${PORT}`);
});
