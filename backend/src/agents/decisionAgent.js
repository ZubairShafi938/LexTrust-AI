/**
 * Decision Agent
 * The last stop in the pipeline. Takes the compliance verdicts and the
 * risk rating and produces the single decision that gets anchored —
 * everything upstream is the evidence for this line.
 */
function run(complianceOutput, riskOutput) {
  const { requirements } = complianceOutput;
  const total = requirements.length;
  const passed = requirements.filter((r) => r.status === "pass").length;
  const failed = requirements.filter((r) => r.status === "fail").length;
  const score = total === 0 ? 0 : Math.round((passed / total) * 100);

  let verdict = "COMPLIANT";
  if (failed > 0) verdict = "NON-COMPLIANT";
  else if (score < 100) verdict = "NEEDS REVIEW";

  return {
    score,
    riskLevel: riskOutput.level,
    verdict,
    summary: `Verdict: ${verdict} · Risk level: ${riskOutput.level}`,
  };
}

module.exports = { run };
