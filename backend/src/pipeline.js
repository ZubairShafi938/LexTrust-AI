const documentAgent = require("./agents/documentAgent");
const legalRagAgent = require("./agents/legalRagAgent");
const complianceAgent = require("./agents/complianceAgent");
const riskAgent = require("./agents/riskAgent");
const decisionAgent = require("./agents/decisionAgent");

/**
 * Runs the full multi-agent pipeline over a document and returns both the
 * final result and a step-by-step log (used to drive the "agents thinking"
 * animation on the frontend — it's a real execution trace, not a fake delay).
 */
function run(docText) {
  const agentLog = [];

  const docOut = documentAgent.run(docText);
  agentLog.push({ name: "Document Agent", output: docOut.summary });

  const ragOut = legalRagAgent.run(docOut);
  agentLog.push({ name: "Legal / RAG Agent", output: ragOut.summary });

  const complianceOut = complianceAgent.run(ragOut);
  agentLog.push({ name: "Compliance Agent", output: complianceOut.summary });

  const riskOut = riskAgent.run(complianceOut);
  agentLog.push({ name: "Risk Agent", output: riskOut.summary });

  const decisionOut = decisionAgent.run(complianceOut, riskOut);
  agentLog.push({ name: "Decision Agent", output: decisionOut.summary });

  return {
    agentLog,
    document: { sections: docOut.sections, wordCount: docOut.wordCount },
    requirements: complianceOut.requirements,
    risk: riskOut,
    decision: decisionOut,
  };
}

module.exports = { run };
