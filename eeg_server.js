// eeg_server.js
// FINAL Railway + Base-compatible EEG server

const http = require("http");

const PORT = process.env.PORT || 8080;

let latestEEG = {};

// ---- Helper: dynamic CORS ----
function setCORS(req, res) {
  const origin = req.headers.origin;

  // Allow Base + previews + localhost
  if (
    origin &&
    (
      origin.includes("base44.app") ||
      origin.includes("app.base44.com") ||
      origin.includes("localhost")
    )
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const server = http.createServer((req, res) => {
  setCORS(req, res);

  // ---- Preflight ----
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // ---- HEALTH CHECK (REQUIRED BY RAILWAY) ----
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      status: "ok",
      service: "eeg-stream-server",
      timestamp: Date.now()
    }));
  }

  // ---- RECEIVE EEG ----
  if (req.method === "POST" && req.url === "/eeg") {
    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", () => {
      try {
        latestEEG = JSON.parse(body);
        console.log("EEG RECEIVED:", latestEEG);
      } catch (e) {
        console.error("Invalid EEG payload");
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    });

    return;
  }

  // ---- SERVE EEG ----
  if (req.method === "GET" && req.url === "/eeg") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(latestEEG));
  }

  // ---- 404 ----
  res.writeHead(404);
  res.end();
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`EEG server LIVE on port ${PORT}`);
});
