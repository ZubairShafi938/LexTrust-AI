# LexTrust AI

**Trustworthy AI Agents for Legal Compliance & Auditable Decisions**

AI can make a decision. LexTrust lets you understand it, verify it, and
prove the record wasn't altered.

A multi-agent pipeline reviews a legal/compliance document clause by
clause and produces an evidence-backed decision. The document and decision
fingerprints are then anchored on-chain — private data never leaves the
session, only its SHA-256 hash does — so anyone can later prove whether
the document has been tampered with since the decision was made.

See [`PITCH.md`](./PITCH.md) for the project pitch, [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
for how it fits together, and [`docs/DEMO_SCRIPT.md`](./docs/DEMO_SCRIPT.md)
for a ready-to-read walkthrough.

## Project layout

```
lextrust-ai/
├── frontend/           single-page UI (no build step)
├── backend/            Express API + multi-agent pipeline + ledger
├── contracts/          AuditRegistry.sol + Hardhat deploy/test setup
├── docs/                architecture + demo script
├── PITCH.md
└── .env.example
```

## Quick start (2 minutes, no blockchain setup needed)

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Copy the environment template (defaults to local ledger mode — no wallet needed)
cp ../.env.example ../.env

# 3. Run the server (also serves the frontend)
npm start
```

Open **http://localhost:4000** — that's the whole app: intake → agent
analysis → evidence → blockchain anchor → tamper-detection verification.

> The frontend also works if you just open `frontend/index.html` directly
> in a browser with no backend running at all — it detects the backend is
> offline and falls back to an identical local simulation, so the demo
> never breaks mid-presentation.

## Running with a real blockchain (optional, for the full submission)

By default `CHAIN_MODE=local` anchors to `backend/data/ledger.json` — a
JSON file that behaves like an append-only ledger. To anchor real
transactions on a testnet instead:

```bash
cd contracts
npm install
# add RPC_URL and PRIVATE_KEY to your .env (a free Alchemy/Infura RPC URL
# and a throwaway testnet wallet funded from a faucet are enough)
npm run deploy:sepolia
# copy the printed contract address into .env as CONTRACT_ADDRESS
```

Then in `.env`, set:

```
CHAIN_MODE=onchain
```

Restart the backend — every "Anchor decision on blockchain" click now
sends a real transaction to `AuditRegistry.sol` and every "Verify" reads
it back on-chain.

## Testing the contract

```bash
cd contracts
npm install
npm test
```

## Testing the agent pipeline directly

```bash
cd backend
node -e "
const fs = require('fs');
const pipeline = require('./src/pipeline');
const doc = fs.readFileSync('./data/sample-document.txt', 'utf8');
console.log(JSON.stringify(pipeline.run(doc), null, 2));
"
```

## API reference

| Method | Route | Body | Returns |
|---|---|---|---|
| POST | `/api/analyze` | `{ docText }` | agent log, requirements, risk, decision |
| POST | `/api/anchor` | `{ auditId, docText, decision }` | anchored record (hashes, timestamp, tx/record hash) |
| POST | `/api/verify` | `{ auditId, docText }` | `{ verified, anchoredHash, currentHash }` |
| GET | `/api/ledger` | — | all anchored records (local mode only) |
| GET | `/api/health` | — | `{ status, chainMode }` |

## Extending it

- **Real LLM reasoning** — replace the keyword scoring in
  `backend/src/agents/legalRagAgent.js` with an embeddings search + an
  Anthropic/OpenAI call; every other agent's interface stays the same.
- **A different document type** — edit `backend/src/requirements.js`;
  nothing else needs to change.
- **A public audit explorer** — index `AuditAnchored` events from
  `AuditRegistry.sol` instead of (or alongside) the local ledger.
