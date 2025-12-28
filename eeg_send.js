// eeg_send.js
// Reads EEG data from your parser variables (you will call sendEEG(payload))

const SERVER_URL = process.env.EEG_SERVER_URL || "https://eeg-stream-server-production.up.railway.app/eeg";

async function sendEEG(payload) {
  try {
    const res = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.log("EEG send failed:", res.status, text);
      return false;
    }

    // Optional: log success
    // console.log("EEG sent OK");
    return true;
  } catch (err) {
    console.log("EEG send error:", err.message);
    return false;
  }
}

module.exports = { sendEEG };
