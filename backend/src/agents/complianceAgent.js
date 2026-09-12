/**
 * Compliance Agent
 * Converts each requirement's retrieval confidence into a verdict.
 * Thresholds live here, isolated from the retrieval logic, so they can be
 * tuned per policy/jurisdiction without touching the RAG agent.
 */
function verdictFor(confidence) {
  if (confidence >= 80) return "pass";
  if (confidence >= 45) return "warn";
  return "fail";
}

function run(ragOutput) {
  const requirements = ragOutput.matches.map((m) => ({
    id: m.requirementId,
    text: m.text,
    section: m.matchedSection,
    confidence: m.confidence,
    status: verdictFor(m.confidence),
  }));

  const passed = requirements.filter((r) => r.status === "pass").length;
  const warned = requirements.filter((r) => r.status === "warn").length;
  const failed = requirements.filter((r) => r.status === "fail").length;

  return {
    requirements,
    summary: `${passed} satisfied · ${warned} flagged for review${failed ? ` · ${failed} missing` : ""}`,
  };
}

module.exports = { run };
