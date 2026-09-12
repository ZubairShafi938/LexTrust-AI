/**
 * Risk Agent
 * Looks across every requirement's verdict and produces a single risk
 * rating plus the specific items that drove it — the "why", not just a
 * traffic light.
 */
function run(complianceOutput) {
  const { requirements } = complianceOutput;
  const fails = requirements.filter((r) => r.status === "fail");
  const warns = requirements.filter((r) => r.status === "warn");

  let level = "LOW";
  if (fails.length > 0) level = "HIGH";
  else if (warns.length > 1) level = "MEDIUM";
  else if (warns.length === 1) level = "LOW-MEDIUM";

  const flags = [...fails, ...warns].map(
    (r) => `${r.status === "fail" ? "Unresolved" : "Underspecified"} obligation — ${r.text} (${r.section})`
  );

  return {
    level,
    flags,
    summary: flags.length
      ? flags.join(" · ")
      : "No outstanding risk items — all requirements clearly supported",
  };
}

module.exports = { run };
