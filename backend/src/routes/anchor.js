const express = require("express");
const ledger = require("../blockchain");
const { sha256Hex, stableStringify } = require("../utils/hash");

const router = express.Router();

router.post("/", async (req, res) => {
  const { auditId, docText, decision } = req.body;
  if (!auditId || !docText || !decision) {
    return res.status(400).json({ error: "auditId, docText and decision are required" });
  }
  try {
    const docHash = sha256Hex(docText);
    const decisionHash = sha256Hex(stableStringify(decision));
    const record = await ledger.anchor({ auditId, docHash, decisionHash });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Anchoring failed", detail: err.message });
  }
});

module.exports = router;
