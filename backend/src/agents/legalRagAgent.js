const requirements = require("../requirements");

/**
 * Legal / RAG Agent
 * For each requirement, retrieves the section whose text best supports it
 * and scores a confidence. This keyword-scoring approach is a stand-in
 * "retriever" — swap `scoreSection` for a real embedding similarity search
 * (or a call out to an LLM with the retrieved chunk) without changing the
 * agent's interface.
 */
function scoreSection(section, requirement) {
  const body = (section.body + " " + section.title).toLowerCase();
  let hits = 0;
  requirement.keywords.forEach((kw) => {
    if (body.includes(kw.toLowerCase())) hits += 1;
  });
  if (hits === 0) return { hits: 0, confidence: 0 };

  let confidence = Math.min(78 + hits * 20, 97);

  const placeholderMarkers = ["reserved", "to be finalized", "tbd", "future amendment"];
  if (requirement.penalizeIfPlaceholder && placeholderMarkers.some((m) => body.includes(m))) {
    confidence = Math.round(confidence * 0.15); // effectively "not actually defined"
  }
  if (requirement.penalizeIfVague && requirement.penalizeIfVague.some((phrase) => body.includes(phrase))) {
    confidence = Math.round(confidence * 0.65); // present, but underspecified
  }

  return { hits, confidence };
}

function run(documentAgentOutput) {
  const { sections } = documentAgentOutput;

  const matches = requirements.map((req) => {
    let best = { section: null, confidence: 0 };
    sections.forEach((section) => {
      const { confidence } = scoreSection(section, req);
      if (confidence > best.confidence) {
        best = { section, confidence };
      }
    });
    return {
      requirementId: req.id,
      text: req.text,
      matchedSection: best.section ? best.section.id : "No matching clause found",
      confidence: best.confidence,
    };
  });

  return {
    matches,
    summary: `Matched ${matches.length} requirements against ${sections.length} retrieved clauses`,
  };
}

module.exports = { run };
