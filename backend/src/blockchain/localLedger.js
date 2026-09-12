const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const LEDGER_PATH = path.join(__dirname, "..", "..", "data", "ledger.json");

function readAll() {
  if (!fs.existsSync(LEDGER_PATH)) return [];
  const raw = fs.readFileSync(LEDGER_PATH, "utf8").trim();
  return raw ? JSON.parse(raw) : [];
}

function writeAll(records) {
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(records, null, 2));
}

/**
 * Simulated on-chain anchor: appends an immutable-looking record with a
 * deterministic fake tx hash. Swap this module for blockchain/contractClient.js
 * (set CHAIN_MODE=onchain in .env) to write to a real testnet instead — both
 * expose the same anchor()/get()/list() interface, so nothing else in the
 * backend needs to change.
 */
async function anchor({ auditId, docHash, decisionHash }) {
  const records = readAll();
  const timestamp = Date.now();
  const txHash =
    "0x" +
    crypto
      .createHash("sha256")
      .update(auditId + docHash + decisionHash + timestamp)
      .digest("hex");

  const record = { auditId, docHash, decisionHash, timestamp, txHash, mode: "local-simulated" };
  records.push(record);
  writeAll(records);
  return record;
}

async function get(auditId) {
  const records = readAll();
  const matches = records.filter((r) => r.auditId === auditId);
  return matches.length ? matches[matches.length - 1] : null; // most recent anchor for this ID
}

async function list() {
  return readAll();
}

module.exports = { anchor, get, list };
