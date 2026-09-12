/**
 * Document Agent
 * Splits the raw document into sections/clauses and extracts basic
 * structure. This is the only agent that touches the raw text directly —
 * everything downstream works off its output, so this is where you'd wire
 * in real PDF/OCR extraction for a production build.
 */
function run(docText) {
  const text = docText || "";
  const sectionRegex = /Section\s+(\d+)\.\s*([^\n]*)\n([\s\S]*?)(?=Section\s+\d+\.|$)/gi;

  const sections = [];
  let match;
  while ((match = sectionRegex.exec(text)) !== null) {
    sections.push({
      id: `Section ${match[1]}`,
      title: match[2].trim(),
      body: match[3].trim(),
    });
  }

  return {
    sections,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    lineCount: text.split("\n").filter((l) => l.trim().length > 0).length,
    summary: `Extracted ${sections.length} section${sections.length === 1 ? "" : "s"} · ${
      text.split(/\s+/).filter(Boolean).length
    } words · parsed clause boundaries`,
  };
}

module.exports = { run };
