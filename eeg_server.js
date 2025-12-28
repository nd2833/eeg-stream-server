// eeg_server.js — Railway-compatible EEG server

const http = require("http");

const PORT = process.env.PORT;
if (!PORT) {
  console.error("PORT env variable missing");
  process.exit(1);
}

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

  if (req.method === "POST" && req.url === "/eeg") {
    let body = "";

    req.on("data", chunk => (body += chunk));
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

  if (req.method === "GET" && req.url === "/eeg") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(latestEEG || {}));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`EEG server listening on ${PORT}`);
});
