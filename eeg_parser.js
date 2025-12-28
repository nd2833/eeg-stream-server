// eeg_parser.js
// ThinkGear / TGAM EEG parser
// Sends EEG data to eeg_server.js (local)

const { SerialPort } = require("serialport");

// ================= CONFIG =================
const SERIAL_PATH = "/dev/tty.usbserial-110";
const BAUD_RATE = 57600;
const EEG_ENDPOINT = "http://localhost:8081/eeg"; // MUST match eeg_server.js
// =========================================

let buffer = [];

let eegState = {
  signal: null,
  attention: null,
  meditation: null,
  bands: null
};

// ---------- ThinkGear decoding ----------
function decodePayload(payload) {
  let i = 0;

  while (i < payload.length) {
    const code = payload[i++];

    // Signal quality
    if (code === 0x02) {
      eegState.signal = payload[i++];
    }

    // Attention
    else if (code === 0x04) {
      eegState.attention = payload[i++];
    }

    // Meditation
    else if (code === 0x05) {
      eegState.meditation = payload[i++];
    }

    // EEG band powers
    else if (code === 0x83) {
      const len = payload[i++]; // usually 24 bytes

      const names = [
        "delta",
        "theta",
        "lowAlpha",
        "highAlpha",
        "lowBeta",
        "highBeta",
        "lowGamma",
        "midGamma"
      ];

      eegState.bands = {};

      for (let b = 0; b < 8; b++) {
        eegState.bands[names[b]] =
          (payload[i] << 16) |
          (payload[i + 1] << 8) |
          payload[i + 2];
        i += 3;
      }
    }

    // Skip any other extended codes
    else if (code >= 0x80) {
      const len = payload[i++];
      i += len;
    }
  }
}

// ---------- Packet parsing ----------
function parseByte(byte) {
  buffer.push(byte);

  // Align to ThinkGear sync bytes (0xAA 0xAA)
  while (buffer.length >= 2 && !(buffer[0] === 0xaa && buffer[1] === 0xaa)) {
    buffer.shift();
  }

  if (buffer.length < 4) return;

  const payloadLength = buffer[2];
  if (buffer.length < payloadLength + 4) return;

  const payload = buffer.slice(3, 3 + payloadLength);
  decodePayload(payload);

  buffer = buffer.slice(payloadLength + 4);
}

// ---------- Serial port ----------
const port = new SerialPort({
  path: SERIAL_PATH,
  baudRate: BAUD_RATE
});

port.on("open", () => {
  console.log("EEG serial connected");
});

port.on("error", (err) => {
  console.error("Serial error:", err.message);
});

port.on("data", async (data) => {
  for (const byte of data) {
    parseByte(byte);
  }

  console.clear();
  console.log("EEG STATE");
  console.log("Signal:", eegState.signal);
  console.log("Attention:", eegState.attention);
  console.log("Meditation:", eegState.meditation);
  if (eegState.bands) console.log("Bands:", eegState.bands);

  try {
    await fetch(EEG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eegState)
    });
  } catch (err) {
    console.log("EEG send error");
  }
});
