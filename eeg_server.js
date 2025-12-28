// eeg_server.js
// EEG ingestion server with CORS enabled (Railway-ready)

const http = require("http");

const PORT = process.env.PORT || 8080;

let latestEEG = null;

const server = http.createServer((req, res) => {
  // ---- CORS ----
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // ---- HEALTH CHECK ----
  if (req.method === "GET" && req.url === "/") {
    console.log("Health check hit");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "EEG server alive" }));
    return;
  }

  // Receive EEG from local parser
  if (req.method === "POST" && req.url === "/eeg") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        latestEEG = JSON.parse(body);
        console.log("Incoming EEG:", latestEEG);
      } catch {
        console.error("Invalid EEG payload");
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    });
    return;
  }

  // Serve latest EEG to Base
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
