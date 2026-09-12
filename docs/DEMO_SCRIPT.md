# Demo script (≈3 minutes)

**1. Open with the problem (20s)**
"AI is being used to review contracts and compliance documents everywhere —
but once an AI gives you a verdict, what stops someone from changing the
document afterward and keeping the old approval? Right now, nothing."

**2. Intake (20s)**
Open LexTrust. Point out the sample Data Processing Addendum already
loaded. Mention this could be any uploaded contract or policy.

**3. Analysis (30s)**
Click "Run analysis." Narrate the five agents as they light up:
Document → Legal/RAG → Compliance → Risk → Decision. Emphasize: *this is a
real pipeline running server-side, not a canned animation.*

**4. Evidence (30s)**
Land on the evidence table. Point at one "REVIEW" row and one "MISSING"
row — show that every verdict cites the exact section it came from.
"Nothing is marked satisfied without a citation."

**5. Anchor — the killer moment, part 1 (30s)**
Click "Anchor decision on blockchain." Show the document hash and decision
hash. Explain: "The document itself never leaves this session — only its
fingerprint gets sealed."

**6. Verify — the killer moment, part 2 (40s)**
Go to Verify. Edit one word in the document text (e.g. delete "encryption
of personal data"). Click "Verify integrity." Watch the banner flip to
**TAMPER DETECTED** in red, with the mismatched hashes side by side.
"This is the whole pitch: AI can make a decision, LexTrust lets you prove
whether it still holds."

**7. Close (20s)**
"Everything you saw runs on a real multi-agent backend and a smart
contract we wrote for this — `AuditRegistry.sol` — deployable to any EVM
testnet in one command. Today it's compliance documents; the same pattern
works for any AI decision that needs to stay provably unaltered."

## Judge Q&A prep

- **"Is this really on-chain?"** — Yes, optionally: `contracts/AuditRegistry.sol`
  is a real, tested Solidity contract. The default demo mode uses a local
  simulated ledger so nobody needs testnet ETH to see the flow; flipping
  `CHAIN_MODE=onchain` in `.env` after deploying anchors real transactions.
- **"Is the AI real or scripted?"** — The agent pipeline is real code
  (`backend/src/agents/*`) that parses the actual document text you give
  it. The matching logic is currently keyword/heuristic-based so the demo
  needs no API key; each agent is a clean seam for swapping in an LLM call.
- **"What happens with a bigger document?"** — The requirement list
  (`backend/src/requirements.js`) is data, not code — point it at a
  different policy library per document type or jurisdiction.
