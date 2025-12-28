// eeg_server.js — Railway-stable, no dependencies

const http = require("http");

const PORT = process.env.PORT || 8080;
let latestEEG = null;

const server = http.createServer((req, res) => {
  // ---- CORS (manual, safe) ----
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // ---- Railway health check ----
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("EEG server live");
  }

  // ---- POST EEG ----
  if (req.method === "POST" && req.url === "/eeg") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        latestEEG = JSON.parse(body);
        console.log("EEG received");
      } catch {
        console.error("Invalid EEG payload");
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    });
    return;
  }

  // ---- GET EEG ----
  if (req.method === "GET" && req.url === "/eeg") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(latestEEG || {}));
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`EEG server LIVE on port ${PORT}`);
});
