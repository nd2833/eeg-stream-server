import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// REQUIRED health check
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// EEG ingest
app.post("/eeg", (req, res) => {
  console.log("EEG DATA:", req.body);
  res.status(200).json({ ok: true });
});

// DO NOT ADD ANYTHING BELOW
app.listen(PORT, "0.0.0.0", () => {
  console.log(`EEG HTTP server listening on ${PORT}`);
});
