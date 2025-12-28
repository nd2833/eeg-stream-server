// eeg_server.js
// FINAL Railway-safe EEG ingestion server with full CORS + health checks

const http = require("http");

const PORT = process.env.PORT || 8080;

// Store latest EEG sample in memory
let latestEEG = null;

const server = http.createServer((req, res) => {
  // -------------------------
  // CORS (required for Base44)
  // -------------------------
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // -------------------------
  // Handle preflight requests
  // -------------------------
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // -------------------------
  // Railway health check
  // IMPORTANT: must support GET + HEAD
  // -------------------------
  if ((req.method === "GET" || req.method === "HEAD") && req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  // -------------------------
  // Receive EEG data (POST)
  // -------------------------
  if (req.method === "POST" && req.url === "/eeg") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        latestEEG = JSON.parse(body);
        console.log("Incoming EEG:", latestEEG);
      } catch (err) {
        console.error("Invalid EEG payload");
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    });

    return;
  }

  // -------------------------
  // Serve latest EEG (GET)
  // -------------------------
  if (req.method === "GET" && req.url === "/eeg") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(latestEEG || {}));
    return;
  }

  // -------------------------
  // Fallback
  // -------------------------
  res.writeHead(404);
  res.end();
});

// -------------------------
// Start server
// -------------------------
server.listen(PORT, () => {
  console.log(`EEG server listening on ${PORT}`);
});
