// EEG Stream Server — Railway Safe (NO external deps)

const http = require("http");

const PORT = process.env.PORT || 8080;

let latestEEG = null;

const server = http.createServer((req, res) => {
  // ---- CORS (manual, bulletproof) ----
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // ---- POST /eeg  (ingest data) ----
  if (req.method === "POST" && req.url === "/eeg") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        latestEEG = JSON.parse(body);
        console.log("EEG received:", latestEEG);
      } catch (err) {
        console.error("Invalid EEG JSON");
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    });

    return;
  }

  // ---- GET /eeg  (Base fetches here) ----
  if (req.method === "GET" && req.url === "/eeg") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(latestEEG || {}));
    return;
  }

  // ---- Health check ----
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200);
    res.end("EEG server live");
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`EEG server LIVE on port ${PORT}`);
});
