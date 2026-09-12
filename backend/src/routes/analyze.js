const express = require("express");
const pipeline = require("../pipeline");

const router = express.Router();

router.post("/", (req, res) => {
  const { docText } = req.body;
  if (!docText || typeof docText !== "string") {
    return res.status(400).json({ error: "docText (string) is required" });
  }
  try {
    const result = pipeline.run(docText);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Analysis failed", detail: err.message });
  }
});

module.exports = router;
