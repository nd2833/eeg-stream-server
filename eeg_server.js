import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`EEG server LIVE on port ${PORT}`);
});

