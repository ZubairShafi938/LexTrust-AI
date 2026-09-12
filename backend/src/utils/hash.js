const crypto = require("crypto");

/** SHA-256 hex digest of a string. This is what actually gets anchored —
 * never the underlying document or decision text. */
function sha256Hex(input) {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

/** Deterministic JSON stringify so the same decision object always hashes
 * the same way regardless of key insertion order. */
function stableStringify(obj) {
  const sortKeys = (value) => {
    if (Array.isArray(value)) return value.map(sortKeys);
    if (value && typeof value === "object") {
      return Object.keys(value)
        .sort()
        .reduce((acc, k) => {
          acc[k] = sortKeys(value[k]);
          return acc;
        }, {});
    }
    return value;
  };
  return JSON.stringify(sortKeys(obj));
}

module.exports = { sha256Hex, stableStringify };
