const express = require("express");
const ledger = require("../blockchain");
const { sha256Hex } = require("../utils/hash");

const router = express.Router();

router.post("/", async (req, res) => {
  const { auditId, docText } = req.body;
  if (!auditId || typeof docText !== "string") {
    return res.status(400).json({ error: "auditId and docText are required" });
  }
  try {
    const record = await ledger.get(auditId);
    if (!record) {
      return res.status(404).json({ error: `No anchored record found for audit ID ${auditId}` });
    }
    const currentHash = sha256Hex(docText);
    const verified = currentHash === record.docHash;
    res.json({ verified, anchoredHash: record.docHash, currentHash, record });
  } catch (err) {
    res.status(500).json({ error: "Verification failed", detail: err.message });
  }
});

module.exports = router;
