// Single point of truth for "where does an anchor actually go".
// CHAIN_MODE=local  (default) -> data/ledger.json, zero setup, perfect for a demo
// CHAIN_MODE=onchain           -> real contract call, needs RPC_URL / PRIVATE_KEY / CONTRACT_ADDRESS
const mode = (process.env.CHAIN_MODE || "local").toLowerCase();

module.exports = mode === "onchain" ? require("./contractClient") : require("./localLedger");
