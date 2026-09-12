const express = require("express");
const ledger = require("../blockchain");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const records = await ledger.list();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Could not read ledger", detail: err.message });
  }
});

module.exports = router;
