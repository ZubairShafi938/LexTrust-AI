/**
 * Real on-chain anchor client. Talks to the AuditRegistry contract
 * (see /contracts/AuditRegistry.sol) over an RPC provider.
 *
 * Only activated when CHAIN_MODE=onchain — `ethers` is required lazily so
 * the rest of the app runs fine without it installed in local-ledger mode.
 *
 * Required env vars: RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS
 */

const ABI = [
  "function anchorDecision(string auditId, bytes32 docHash, bytes32 decisionHash) external",
  "function getRecord(string auditId) external view returns (bytes32 docHash, bytes32 decisionHash, uint256 timestamp, address submitter)",
  "event AuditAnchored(string indexed auditId, bytes32 docHash, bytes32 decisionHash, uint256 timestamp, address submitter)",
];

function toBytes32(hexString64) {
  return "0x" + hexString64; // hash.js produces 64 hex chars (32 bytes) without the 0x prefix
}

function getContract() {
  // eslint-disable-next-line global-require
  const { ethers } = require("ethers");
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  return new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);
}

async function anchor({ auditId, docHash, decisionHash }) {
  const contract = getContract();
  const tx = await contract.anchorDecision(auditId, toBytes32(docHash), toBytes32(decisionHash));
  const receipt = await tx.wait();
  return {
    auditId,
    docHash,
    decisionHash,
    timestamp: Date.now(),
    txHash: receipt.hash,
    mode: "onchain",
  };
}

async function get(auditId) {
  const contract = getContract();
  const [docHash, decisionHash, timestamp, submitter] = await contract.getRecord(auditId);
  if (timestamp === 0n) return null;
  return {
    auditId,
    docHash: docHash.replace(/^0x/, ""),
    decisionHash: decisionHash.replace(/^0x/, ""),
    timestamp: Number(timestamp) * 1000,
    submitter,
    mode: "onchain",
  };
}

async function list() {
  // On-chain enumeration needs an indexer or event-log scan in production;
  // out of scope for the hackathon build. get(auditId) is fully supported.
  return [];
}

module.exports = { anchor, get, list };
