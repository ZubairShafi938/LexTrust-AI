# Architecture

```
                         USER
                           │
                           ▼
                 ┌─────────────────┐
                 │  Frontend (SPA)  │  frontend/index.html
                 │  upload → verify │
                 └────────┬────────┘
                          │  fetch /api/*
                          ▼
                 ┌─────────────────┐
                 │  Express server  │  backend/server.js
                 └────────┬────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   /api/analyze     /api/anchor      /api/verify
          │               │               │
          ▼               │               │
 ┌──────────────────┐     │               │
 │   pipeline.js     │    │               │
 │ ───────────────── │    │               │
 │ 1. Document Agent │    │               │
 │ 2. Legal/RAG Agent│    │               │
 │ 3. Compliance Agt │    │               │
 │ 4. Risk Agent     │    │               │
 │ 5. Decision Agent │    │               │
 └──────────────────┘     │               │
                           ▼               ▼
                   ┌────────────────────────────┐
                   │   blockchain/index.js       │
                   │   (mode switch)              │
                   ├───────────────┬─────────────┤
                   │ localLedger.js│contractClient│
                   │ (JSON file,   │  .js (ethers,│
                   │  zero setup)  │  real testnet)│
                   └───────────────┴──────┬───────┘
                                           │
                                           ▼
                                 contracts/AuditRegistry.sol
                                 (deployed via Hardhat)
```

## Why hashes, not documents, go on-chain

Legal and compliance documents are private. LexTrust never writes document
content anywhere outside the session that requested the analysis. What gets
anchored is:

- `docHash` — SHA-256 of the exact document text that was analyzed
- `decisionHash` — SHA-256 of the compliance decision (score, risk level,
  verdict, and per-requirement statuses)

Anyone holding the audit ID can recompute a document's hash later and
compare it against the anchored one. A mismatch proves the document changed
since the decision was made — without ever exposing what the document says.

## Agent pipeline

Each agent is a small, independently testable module with one job:

| Agent | Input | Output |
|---|---|---|
| Document Agent | raw text | parsed sections + stats |
| Legal / RAG Agent | sections + requirement list | best-matching section & confidence per requirement |
| Compliance Agent | RAG matches | pass / warn / fail per requirement |
| Risk Agent | compliance verdicts | aggregate risk level + flagged items |
| Decision Agent | compliance + risk | final verdict, score, one-line summary |

This keyword/heuristic implementation is intentionally simple so the whole
pipeline runs with zero API keys and zero network calls. Each agent module
is a clean seam for plugging in a real LLM call or a vector database —
swap the internals, keep the same function signature, and nothing else in
the app needs to change.

## Chain mode switch

`backend/src/blockchain/index.js` picks between `localLedger.js` (a JSON
file that behaves like an append-only ledger — no wallet, no gas, no
network needed) and `contractClient.js` (a real `ethers.js` client against
the deployed `AuditRegistry` contract). Both expose the same
`anchor()` / `get()` / `list()` interface, so the rest of the backend never
needs to know which one is active. Toggle it with `CHAIN_MODE` in `.env`.
