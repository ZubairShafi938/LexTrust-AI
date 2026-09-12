require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./src/routes/analyze");
const anchorRoute = require("./src/routes/anchor");
const verifyRoute = require("./src/routes/verify");
const ledgerRoute = require("./src/routes/ledger");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/api/analyze", analyzeRoute);
app.use("/api/anchor", anchorRoute);
app.use("/api/verify", verifyRoute);
app.use("/api/ledger", ledgerRoute);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", chainMode: (process.env.CHAIN_MODE || "local") });
});

// Serve the frontend as static files so the whole app runs from one process
app.use(express.static(path.join(__dirname, "..", "frontend")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`LexTrust AI running → http://localhost:${PORT}`);
  console.log(`Chain mode: ${(process.env.CHAIN_MODE || "local").toUpperCase()}`);
});
