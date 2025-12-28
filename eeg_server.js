// eeg_server.js
const express = require("express");
const WebSocket = require("ws");

const app = express();
app.use(express.json());

let latestEEG = null;

// HTTP endpoint (parser sends data here)
app.post("/eeg", (req, res) => {
  latestEEG = req.body;
  console.log("Incoming EEG:", latestEEG);
  res.sendStatus(200);

  // broadcast to websocket clients
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(latestEEG));
    }
  });
});

// Health check
app.get("/", (req, res) => {
  res.send("EEG server running");
});

const server = app.listen(8081, () => {
  console.log("EEG server running on port 8081");
});

// WebSocket
const wss = new WebSocket.Server({ server });
