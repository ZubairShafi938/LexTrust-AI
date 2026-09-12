# LexTrust AI
### Trustworthy AI Agents for Legal Compliance & Auditable Decisions

**Track:** AI × Blockchain (LegalTech / RegTech positioning)

## The problem

AI is increasingly used to review contracts and compliance documents, but
an AI verdict is only useful if it can be trusted after the fact. Once a
document is approved, nothing stops it from being quietly edited while the
old approval keeps circulating.

## The solution

A multi-agent AI pipeline analyzes a document requirement by requirement,
producing an evidence-backed decision — then LexTrust anchors the
fingerprint of both the document and the decision on-chain. Anyone can
later recompute the document's hash and compare it against the anchored
one to prove, cryptographically, whether it has changed.

Private data never touches the chain — only its SHA-256 fingerprint does.

## Three pillars

1. **Trust** — every verdict cites the clause that produced it.
2. **Intelligence** — five specialized agents collaborate instead of one
   generic chatbot: Document, Legal/RAG, Compliance, Risk, Decision.
3. **Verifiability** — the resulting audit record is tamper-evident,
   backed by a real smart contract (`contracts/AuditRegistry.sol`).

## What's built

- A working multi-agent backend (`backend/`) — no API keys required to run
- A smart contract for real testnet anchoring, with tests (`contracts/`)
- A local, zero-setup simulated ledger for offline demos
- A full frontend flow: intake → analysis → evidence → anchor → verify,
  including a live "edit the document, watch tamper detection fire" demo

## What's next

- Swap the keyword-matching Legal/RAG agent for embeddings + a real LLM call
- Add a document-type / jurisdiction picker backed by a real policy library
- On-chain event indexing for a full public audit-trail explorer
