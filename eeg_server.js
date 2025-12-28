// eeg_server.js
// Simple EEG ingestion server with CORS enabled

const http = require("http");

const PORT = process.env.PORT || 8080;

let latestEEG = null;

const server = http.createServer((req, res) => {
  // ---- CORS HEADERS (THIS IS THE FIX) ----
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight request
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // Receive EEG data
  if (req.method === "POST" && req.url === "/eeg") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        latestEEG = JSON.parse(body);
        console.log("Incoming EEG:", latestEEG);
      } catch (e) {
        console.error("Invalid EEG payload");
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    });

    return;
  }

  // Expose latest EEG to Base
  if (req.method === "GET" && req.url === "/eeg") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(latestEEG || {}));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`EEG server running on port ${PORT}`);
});
